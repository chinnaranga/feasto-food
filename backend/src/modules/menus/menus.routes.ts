import { Router } from 'express';
import { menusController } from './menus.controller.js';
import { validateRequest } from '../../shared/validators/common.js';
import {
  createMenuSchema,
  updateMenuSchema,
  createCategorySchema,
  updateCategorySchema,
  reorderCategoriesSchema,
  createItemSchema,
  updateItemSchema,
  createVariantSchema,
  updateVariantSchema,
  createAddonSchema,
  updateAddonSchema,
  updateMediaSchema,
  updateNutritionSchema,
  updateAvailabilitySchema,
} from './menus.validation.js';
import { authenticate } from '../../shared/middleware/authMiddleware.js';
import { requireRestaurantAccess } from '../restaurants/restaurants.middleware.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import './menus.docs.js';

const router = Router({ mergeParams: true });

// All menu endpoints require authentication and restaurant access verification
router.use(authenticate, requireRestaurantAccess);

// Menu Endpoints
router.get('/', catchAsync(menusController.getMenus));

router.post(
  '/',
  validateRequest({ body: createMenuSchema }),
  catchAsync(menusController.createMenu)
);

router.get('/:menuId', catchAsync(menusController.getMenu));

router.patch(
  '/:menuId',
  validateRequest({ body: updateMenuSchema }),
  catchAsync(menusController.updateMenu)
);

router.delete('/:menuId', catchAsync(menusController.deleteMenu));

router.post('/:menuId/duplicate', catchAsync(menusController.duplicateMenu));
router.post('/:menuId/publish', catchAsync(menusController.publishMenu));
router.post('/:menuId/unpublish', catchAsync(menusController.unpublishMenu));
router.post('/:menuId/archive', catchAsync(menusController.archiveMenu));
router.get('/:menuId/summary', catchAsync(menusController.getSummary));

// Category Endpoints
router.get('/:menuId/categories', catchAsync(menusController.getCategories));

router.post(
  '/:menuId/categories',
  validateRequest({ body: createCategorySchema }),
  catchAsync(menusController.createCategory)
);

router.patch(
  '/:menuId/categories/:categoryId',
  validateRequest({ body: updateCategorySchema }),
  catchAsync(menusController.updateCategory)
);

router.delete('/:menuId/categories/:categoryId', catchAsync(menusController.deleteCategory));

router.post(
  '/:menuId/categories/reorder',
  validateRequest({ body: reorderCategoriesSchema }),
  catchAsync(menusController.reorderCategories)
);

// Item Endpoints
router.get('/:menuId/items', catchAsync(menusController.getItems));

router.post(
  '/:menuId/items',
  validateRequest({ body: createItemSchema }),
  catchAsync(menusController.createItem)
);

router.get('/:menuId/items/:itemId', catchAsync(menusController.getItem));

router.patch(
  '/:menuId/items/:itemId',
  validateRequest({ body: updateItemSchema }),
  catchAsync(menusController.updateItem)
);

router.delete('/:menuId/items/:itemId', catchAsync(menusController.deleteItem));

router.post('/:menuId/items/:itemId/duplicate', catchAsync(menusController.duplicateItem));
router.post('/:menuId/items/:itemId/publish', catchAsync(menusController.publishItem));
router.post('/:menuId/items/:itemId/unpublish', catchAsync(menusController.unpublishItem));
router.post('/:menuId/items/:itemId/archive', catchAsync(menusController.archiveItem));

// Variants Endpoints
router.get('/:menuId/items/:itemId/variants', catchAsync(menusController.getVariants));

router.post(
  '/:menuId/items/:itemId/variants',
  validateRequest({ body: createVariantSchema }),
  catchAsync(menusController.createVariant)
);

router.patch(
  '/:menuId/items/:itemId/variants/:variantId',
  validateRequest({ body: updateVariantSchema }),
  catchAsync(menusController.updateVariant)
);

router.delete('/:menuId/items/:itemId/variants/:variantId', catchAsync(menusController.deleteVariant));

// Addons Endpoints
router.get('/:menuId/items/:itemId/addons', catchAsync(menusController.getAddons));

router.post(
  '/:menuId/items/:itemId/addons',
  validateRequest({ body: createAddonSchema }),
  catchAsync(menusController.createAddon)
);

router.patch(
  '/:menuId/items/:itemId/addons/:addonId',
  validateRequest({ body: updateAddonSchema }),
  catchAsync(menusController.updateAddon)
);

router.delete('/:menuId/items/:itemId/addons/:addonId', catchAsync(menusController.deleteAddon));

// Media, Nutrition & Availability Endpoints
router.patch(
  '/:menuId/items/:itemId/media',
  validateRequest({ body: updateMediaSchema }),
  catchAsync(menusController.updateMedia)
);

router.patch(
  '/:menuId/items/:itemId/nutrition',
  validateRequest({ body: updateNutritionSchema }),
  catchAsync(menusController.updateNutrition)
);

router.patch(
  '/:menuId/items/:itemId/availability',
  validateRequest({ body: updateAvailabilitySchema }),
  catchAsync(menusController.updateAvailability)
);

export default router;
