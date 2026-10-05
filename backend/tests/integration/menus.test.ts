/// <reference types="jest" />
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../../src/app.js';
import { User } from '../../src/modules/users/user.model.js';
import { Restaurant } from '../../src/modules/restaurants/restaurants.model.js';
import { Menu } from '../../src/modules/menus/menus.model.js';
import { MenuCategory } from '../../src/modules/menus/models/menuCategory.model.js';
import { MenuItem } from '../../src/modules/menus/models/menuItem.model.js';
import { MenuVariant } from '../../src/modules/menus/models/menuVariant.model.js';
import { MenuAddon } from '../../src/modules/menus/models/menuAddon.model.js';

describe('Menu, Categories, Variants & Availability Module Integration Tests', () => {
  const app = createApp();
  let ownerToken: string;
  let restaurantId: string;

  const ownerUser = {
    name: 'Chef Luigi',
    email: 'luigi.owner@example.com',
    password: 'SecurePassword123!',
    role: 'restaurant_owner',
  };

  const sampleRestaurant = {
    restaurantName: 'Luigi Pizzeria',
    legalBusinessName: 'Luigi Pizzeria Inc',
    description: 'Neapolitan Wood Fired Pizzas',
    cuisineTypes: ['Italian'],
    email: 'luigi.pizzeria@example.com',
    phone: '+14155554321',
    address: '200 Broadway St',
    city: 'San Francisco',
    state: 'CA',
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
    await Menu.deleteMany({});
    await MenuCategory.deleteMany({});
    await MenuItem.deleteMany({});
    await MenuVariant.deleteMany({});
    await MenuAddon.deleteMany({});

    // Register & Login Owner
    await request(app).post('/api/v1/auth/register').send(ownerUser);
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: ownerUser.email,
      password: ownerUser.password,
    });

    ownerToken = loginRes.body.data.tokens.accessToken;

    // Create Restaurant Workspace
    const restRes = await request(app)
      .post('/api/v1/restaurants')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(sampleRestaurant);

    restaurantId = restRes.body.data._id;
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  it('1. POST /api/v1/restaurants/:restaurantId/menus should create menu in draft state', async () => {
    const res = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/menus`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        menuName: 'Dinner Menu',
        menuDescription: 'Evening specials & wood-fired pizzas',
        menuType: 'dinner',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.menuName).toBe('Dinner Menu');
    expect(res.body.data.publishState).toBe('draft');
  });

  it('2. Category CRUD & Reorder flow should organize menu categories', async () => {
    // Create Menu
    const menuRes = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/menus`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ menuName: 'Main Menu' });

    const menuId = menuRes.body.data._id;

    // Create Categories
    const cat1 = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/menus/${menuId}/categories`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ categoryName: 'Pizzas', displayOrder: 0 });

    const cat2 = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/menus/${menuId}/categories`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ categoryName: 'Beverages', displayOrder: 1 });

    expect(cat1.status).toBe(201);
    expect(cat2.status).toBe(201);

    // List Categories
    const listRes = await request(app)
      .get(`/api/v1/restaurants/${restaurantId}/menus/${menuId}/categories`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.data.length).toBe(2);
  });

  it('3. Item CRUD & Publish flow should add items and toggle live published state', async () => {
    const menuRes = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/menus`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ menuName: 'Pizza Menu' });

    const menuId = menuRes.body.data._id;

    const catRes = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/menus/${menuId}/categories`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ categoryName: 'Wood-Fired Pizzas' });

    const categoryId = catRes.body.data._id;

    // Create Item in Draft State
    const itemRes = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/menus/${menuId}/items`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        categoryId,
        itemName: 'Margherita Pizza',
        itemDescription: 'San Marzano tomatoes, fresh mozzarella, basil',
        basePrice: 18.5,
        isVeg: true,
        dietaryTags: ['veg'],
      });

    expect(itemRes.status).toBe(201);
    expect(itemRes.body.data.itemName).toBe('Margherita Pizza');
    expect(itemRes.body.data.publishState).toBe('draft');

    const itemId = itemRes.body.data._id;

    // Publish Item Live
    const pubRes = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/menus/${menuId}/items/${itemId}/publish`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(pubRes.status).toBe(200);
    expect(pubRes.body.data.publishState).toBe('published');
  });

  it('4. Variants & Addons CRUD should create size options and extra toppings', async () => {
    const menuRes = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/menus`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ menuName: 'Special Menu' });

    const menuId = menuRes.body.data._id;
    const catRes = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/menus/${menuId}/categories`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ categoryName: 'Pizzas' });

    const itemRes = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/menus/${menuId}/items`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        categoryId: catRes.body.data._id,
        itemName: 'Pepperoni Pizza',
        basePrice: 20.0,
      });

    const itemId = itemRes.body.data._id;

    // Create Size Variant
    const variantRes = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/menus/${menuId}/items/${itemId}/variants`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        variantName: 'Large 16 inch',
        priceAdjustment: 5.0,
      });

    expect(variantRes.status).toBe(201);
    expect(variantRes.body.data.variantName).toBe('Large 16 inch');

    // Create Addon Group
    const addonRes = await request(app)
      .post(`/api/v1/restaurants/${restaurantId}/menus/${menuId}/items/${itemId}/addons`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        groupName: 'Extra Cheese & Toppings',
        isRequired: false,
        addonItems: [
          { name: 'Extra Mozzarella', price: 2.5, isAvailable: true },
          { name: 'Truffle Oil', price: 3.0, isAvailable: true },
        ],
      });

    expect(addonRes.status).toBe(201);
    expect(addonRes.body.data.groupName).toBe('Extra Cheese & Toppings');
  });
});
