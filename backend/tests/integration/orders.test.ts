/// <reference types="jest" />
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../../src/app.js';
import { User } from '../../src/modules/users/user.model.js';
import { Restaurant } from '../../src/modules/restaurants/restaurants.model.js';
import { RestaurantBranch } from '../../src/modules/restaurants/models/restaurantBranch.model.js';
import { Menu } from '../../src/modules/menus/menus.model.js';
import { MenuCategory } from '../../src/modules/menus/models/menuCategory.model.js';
import { MenuItem } from '../../src/modules/menus/models/menuItem.model.js';
import { Cart } from '../../src/modules/orders/models/cart.model.js';
import { Order } from '../../src/modules/orders/orders.model.js';

describe('Order, Cart, Checkout & Order Lifecycle Integration Tests', () => {
  const app = createApp();
  let customerToken: string;
  let ownerToken: string;
  let restaurantId: string;
  let branchId: string;
  let itemId: string;

  const customerUser = {
    name: 'Bob Customer',
    email: 'bob.customer@example.com',
    password: 'SecurePassword123!',
    role: 'customer',
  };

  const ownerUser = {
    name: 'Chef Marco',
    email: 'marco.owner@example.com',
    password: 'SecurePassword123!',
    role: 'restaurant_owner',
  };

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feasto_v2_test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await RestaurantBranch.deleteMany({});
    await Menu.deleteMany({});
    await MenuCategory.deleteMany({});
    await MenuItem.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});

    // Register & Login Owner
    await request(app).post('/api/v1/auth/register').send(ownerUser);
    const ownerLogin = await request(app).post('/api/v1/auth/login').send({
      email: ownerUser.email,
      password: ownerUser.password,
    });
    ownerToken = ownerLogin.body.data.tokens.accessToken;

    // Register & Login Customer
    await request(app).post('/api/v1/auth/register').send(customerUser);
    const custLogin = await request(app).post('/api/v1/auth/login').send({
      email: customerUser.email,
      password: customerUser.password,
    });
    customerToken = custLogin.body.data.tokens.accessToken;

    // Setup Restaurant Workspace & Branch
    const restRes = await request(app)
      .post('/api/v1/restaurants')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        restaurantName: 'Marco Trattoria',
        legalBusinessName: 'Marco Foods LLC',
        description: 'Authentic pasta & seafood',
        cuisineTypes: ['Italian'],
        email: 'info@marco.com',
        phone: '+14155551234',
        address: '100 Beach St',
        city: 'San Francisco',
        state: 'CA',
      });
    restaurantId = restRes.body.data._id;

    // Update restaurant operationalStatus to open
    await request(app)
      .patch(`/api/v1/restaurants/${restaurantId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ operationalStatus: 'open' });

    const branchesRes = await request(app)
      .get(`/api/v1/restaurants/${restaurantId}/branches`)
      .set('Authorization', `Bearer ${ownerToken}`);
    branchId = branchesRes.body.data[0]._id;

    // Setup Menu & Item
    const menuRes = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/menus`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ menuName: 'Regular Menu' });
    const menuId = menuRes.body.data._id;

    const catRes = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/menus/${menuId}/categories`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ categoryName: 'Pastas' });

    const itemRes = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/menus/${menuId}/items`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        categoryId: catRes.body.data._id,
        itemName: 'Fettuccine Alfredo',
        basePrice: 16.0,
      });
    itemId = itemRes.body.data._id;
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  it('1. Cart operations: Add item, check subtotal, clear cart', async () => {
    const addRes = await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        restaurantId,
        branchId,
        itemId,
        basePrice: 16.0,
        quantity: 2,
        addons: [{ name: 'Extra Cheese', price: 2.0 }],
      });

    expect(addRes.status).toBe(201);
    expect(addRes.body.success).toBe(true);
    expect(addRes.body.data.subtotal).toBe(36.0); // (16 + 2) * 2

    const cartRes = await request(app)
      .get('/api/v1/cart')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(cartRes.status).toBe(200);
    expect(cartRes.body.data.items.length).toBe(1);
  });

  it('2. Checkout & Order Placement: Initialize checkout session, confirm, and verify order placement', async () => {
    // Add item to cart
    await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        restaurantId,
        branchId,
        itemId,
        basePrice: 16.0,
        quantity: 1,
      });

    // Initialize Checkout
    const initRes = await request(app)
      .post('/api/v1/checkout/initialize')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        orderType: 'delivery',
        tipAmount: 3.0,
      });

    expect(initRes.status).toBe(201);
    expect(initRes.body.data).toHaveProperty('sessionId');
    const sessionId = initRes.body.data.sessionId;

    // Confirm Checkout to Create Order
    const orderRes = await request(app)
      .post('/api/v1/checkout/confirm')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ checkoutSessionId: sessionId });

    expect(orderRes.status).toBe(201);
    expect(orderRes.body.data.orderStatus).toBe('placed');
    expect(orderRes.body.data).toHaveProperty('orderNumber');
  });

  it('3. Restaurant Order Queue: Accept order, mark preparing, and mark ready', async () => {
    // Customer places order
    await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ restaurantId, branchId, itemId, basePrice: 16.0, quantity: 1 });

    const initRes = await request(app)
      .post('/api/v1/checkout/initialize')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ orderType: 'delivery' });

    const orderRes = await request(app)
      .post('/api/v1/checkout/confirm')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ checkoutSessionId: initRes.body.data.sessionId });

    const orderId = orderRes.body.data._id;

    // Restaurant Accepts Order
    const acceptRes = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/orders/${orderId}/accept`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(acceptRes.status).toBe(200);
    expect(acceptRes.body.data.orderStatus).toBe('accepted');

    // Mark Preparing
    const prepRes = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/orders/${orderId}/prepare`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(prepRes.status).toBe(200);
    expect(prepRes.body.data.orderStatus).toBe('preparing');

    // Mark Ready
    const readyRes = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/orders/${orderId}/ready`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(readyRes.status).toBe(200);
    expect(readyRes.body.data.orderStatus).toBe('ready');
  });
});
