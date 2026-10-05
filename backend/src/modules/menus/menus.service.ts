import { Types } from 'mongoose';
import { menusRepository, MenusRepository } from './menus.repository.js';
import {
  CreateMenuDTO,
  UpdateMenuDTO,
  CreateCategoryDTO,
  UpdateCategoryDTO,
  ReorderCategoriesDTO,
  CreateItemDTO,
  UpdateItemDTO,
  CreateVariantDTO,
  UpdateVariantDTO,
  CreateAddonDTO,
  UpdateAddonDTO,
  UpdateMediaDTO,
  UpdateNutritionDTO,
  UpdateAvailabilityDTO,
  MenuSummaryResponse,
} from './menus.types.js';
import { calculateMenuCompleteness } from './menus.utils.js';
import { MENU_CONSTANTS, MENU_ERROR_CODES } from './menus.constants.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { BadRequestError } from '../../shared/errors/BadRequestError.js';
import { IMenuDocument } from './menus.model.js';
import { IMenuCategoryDocument } from './models/menuCategory.model.js';
import { IMenuItemDocument } from './models/menuItem.model.js';
import { IMenuVariantDocument } from './models/menuVariant.model.js';
import { IMenuAddonDocument } from './models/menuAddon.model.js';
import { logger } from '../../shared/utils/logger.js';

export class MenusService {
  constructor(private repo: MenusRepository = menusRepository) {}

  async createMenu(restaurantId: string, dto: CreateMenuDTO): Promise<IMenuDocument> {
    const menu = await this.repo.createMenu({
      ...dto,
      restaurantId: new Types.ObjectId(restaurantId),
      branchId: dto.branchId ? new Types.ObjectId(dto.branchId) : undefined,
      publishState: 'draft',
      status: 'active',
    });

    logger.info({ restaurantId, menuId: menu._id.toString() }, '📋 Menu created successfully');
    return menu;
  }

  async getMenu(menuId: string): Promise<IMenuDocument> {
    const menu = await this.repo.findMenuById(menuId);
    if (!menu) {
      throw new NotFoundError('Menu not found', MENU_ERROR_CODES.MENU_NOT_FOUND);
    }
    return menu;
  }

  async getMenusByRestaurant(restaurantId: string): Promise<IMenuDocument[]> {
    return this.repo.getMenusByRestaurant(restaurantId);
  }

  async updateMenu(menuId: string, dto: UpdateMenuDTO): Promise<IMenuDocument> {
    const existing = await this.getMenu(menuId);
    const updateData: Record<string, unknown> = { ...dto };
    if (dto.branchId) {
      updateData.branchId = new Types.ObjectId(dto.branchId);
    }

    const updated = await this.repo.updateMenu(menuId, updateData as Partial<IMenuDocument>);
    if (!updated) {
      throw new NotFoundError('Failed to update menu', MENU_ERROR_CODES.MENU_NOT_FOUND);
    }

    const categoryCount = await this.repo.countCategories(menuId);
    const itemCount = await this.repo.countItems(menuId);
    const publishedItemCount = await this.repo.countItemsByPublishState(menuId, 'published');
    const completeness = calculateMenuCompleteness(updated, categoryCount, itemCount, publishedItemCount);

    updated.profileCompleteness = completeness.score;
    await updated.save();

    logger.info({ menuId }, '✏️ Menu updated successfully');
    return updated;
  }

  async deleteMenu(menuId: string): Promise<{ success: boolean }> {
    const success = await this.repo.softDeleteMenu(menuId);
    if (!success) {
      throw new NotFoundError('Menu not found', MENU_ERROR_CODES.MENU_NOT_FOUND);
    }
    logger.info({ menuId }, '🗑️ Menu soft-deleted');
    return { success: true };
  }

  async duplicateMenu(menuId: string): Promise<IMenuDocument> {
    const sourceMenu = await this.getMenu(menuId);
    const duplicatedMenu = await this.repo.createMenu({
      restaurantId: sourceMenu.restaurantId,
      branchId: sourceMenu.branchId,
      menuName: `${sourceMenu.menuName} (Copy)`,
      menuDescription: sourceMenu.menuDescription,
      menuType: sourceMenu.menuType,
      currency: sourceMenu.currency,
      publishState: 'draft',
      status: 'active',
    });

    const categories = await this.repo.getCategories(menuId);
    for (const cat of categories) {
      const newCat = await this.repo.createCategory({
        menuId: duplicatedMenu._id,
        restaurantId: sourceMenu.restaurantId,
        categoryName: cat.categoryName,
        categoryDescription: cat.categoryDescription,
        displayOrder: cat.displayOrder,
        isFeatured: cat.isFeatured,
      });

      const items = await this.repo.getItems(menuId, cat._id.toString());
      for (const item of items) {
        await this.repo.createItem({
          menuId: duplicatedMenu._id,
          categoryId: newCat._id,
          restaurantId: sourceMenu.restaurantId,
          itemName: item.itemName,
          itemDescription: item.itemDescription,
          basePrice: item.basePrice,
          discountedPrice: item.discountedPrice,
          isVeg: item.isVeg,
          dietaryTags: item.dietaryTags,
          publishState: 'draft',
          displayOrder: item.displayOrder,
        });
      }
    }

    logger.info({ sourceMenuId: menuId, newMenuId: duplicatedMenu._id.toString() }, '📄 Menu duplicated');
    return duplicatedMenu;
  }

  async publishMenu(menuId: string): Promise<IMenuDocument> {
    const menu = await this.getMenu(menuId);
    menu.publishState = 'published';
    await menu.save();
    logger.info({ menuId }, '🚀 Menu published');
    return menu;
  }

  async unpublishMenu(menuId: string): Promise<IMenuDocument> {
    const menu = await this.getMenu(menuId);
    menu.publishState = 'draft';
    await menu.save();
    logger.info({ menuId }, '⏸️ Menu unpublished to draft state');
    return menu;
  }

  async archiveMenu(menuId: string): Promise<IMenuDocument> {
    const menu = await this.getMenu(menuId);
    menu.publishState = 'archived';
    menu.status = 'archived';
    await menu.save();
    logger.info({ menuId }, '📦 Menu archived');
    return menu;
  }

  async getSummary(menuId: string): Promise<MenuSummaryResponse> {
    const menu = await this.getMenu(menuId);
    const categoryCount = await this.repo.countCategories(menuId);
    const itemCount = await this.repo.countItems(menuId);
    const publishedItemCount = await this.repo.countItemsByPublishState(menuId, 'published');
    const draftItemCount = await this.repo.countItemsByPublishState(menuId, 'draft');
    const archivedItemCount = await this.repo.countItemsByPublishState(menuId, 'archived');

    const completeness = calculateMenuCompleteness(menu, categoryCount, itemCount, publishedItemCount);

    return {
      menuId: menu._id.toString(),
      menuName: menu.menuName,
      publishState: menu.publishState,
      status: menu.status,
      profileCompleteness: completeness.score,
      stats: {
        totalCategoriesCount: categoryCount,
        totalItemsCount: itemCount,
        publishedItemsCount: publishedItemCount,
        draftItemsCount: draftItemCount,
        archivedItemsCount: archivedItemCount,
      },
      missingSetupItems: completeness.missingItems,
      createdAt: menu.createdAt,
    };
  }

  // --- Category Management ---
  async getCategories(menuId: string): Promise<IMenuCategoryDocument[]> {
    return this.repo.getCategories(menuId);
  }

  async createCategory(menuId: string, restaurantId: string, dto: CreateCategoryDTO): Promise<IMenuCategoryDocument> {
    const count = await this.repo.countCategories(menuId);
    if (count >= MENU_CONSTANTS.MAX_CATEGORIES_PER_MENU) {
      throw new BadRequestError(`Maximum limit of ${MENU_CONSTANTS.MAX_CATEGORIES_PER_MENU} categories reached`);
    }

    return this.repo.createCategory({
      ...dto,
      menuId: new Types.ObjectId(menuId),
      restaurantId: new Types.ObjectId(restaurantId),
      parentCategoryId: dto.parentCategoryId
        ? new Types.ObjectId(dto.parentCategoryId)
        : undefined,
    });
  }

  async updateCategory(categoryId: string, menuId: string, dto: UpdateCategoryDTO): Promise<IMenuCategoryDocument> {
    const updateData: Record<string, unknown> = { ...dto };
    if (dto.parentCategoryId) {
      updateData.parentCategoryId = new Types.ObjectId(dto.parentCategoryId);
    }
    const updated = await this.repo.updateCategory(categoryId, menuId, updateData as Partial<IMenuCategoryDocument>);
    if (!updated) {
      throw new NotFoundError('Category not found', MENU_ERROR_CODES.CATEGORY_NOT_FOUND);
    }
    return updated;
  }

  async deleteCategory(categoryId: string, menuId: string): Promise<{ success: boolean }> {
    const success = await this.repo.softDeleteCategory(categoryId, menuId);
    if (!success) {
      throw new NotFoundError('Category not found', MENU_ERROR_CODES.CATEGORY_NOT_FOUND);
    }
    return { success: true };
  }

  async reorderCategories(menuId: string, dto: ReorderCategoriesDTO): Promise<{ success: boolean }> {
    for (let i = 0; i < dto.orderedCategoryIds.length; i++) {
      await this.repo.updateCategory(dto.orderedCategoryIds[i], menuId, { displayOrder: i });
    }
    return { success: true };
  }

  // --- Item Management ---
  async getItems(menuId: string, categoryId?: string): Promise<IMenuItemDocument[]> {
    return this.repo.getItems(menuId, categoryId);
  }

  async createItem(menuId: string, restaurantId: string, dto: CreateItemDTO): Promise<IMenuItemDocument> {
    const count = await this.repo.countItems(menuId);
    if (count >= MENU_CONSTANTS.MAX_ITEMS_PER_CATEGORY * MENU_CONSTANTS.MAX_CATEGORIES_PER_MENU) {
      throw new BadRequestError('Maximum item capacity reached for menu');
    }

    return this.repo.createItem({
      ...dto,
      menuId: new Types.ObjectId(menuId),
      categoryId: new Types.ObjectId(dto.categoryId),
      restaurantId: new Types.ObjectId(restaurantId),
      publishState: 'draft',
      availabilityStatus: 'available',
    });
  }

  async getItem(itemId: string): Promise<IMenuItemDocument> {
    const item = await this.repo.findItemById(itemId);
    if (!item) {
      throw new NotFoundError('Menu item not found', MENU_ERROR_CODES.ITEM_NOT_FOUND);
    }
    return item;
  }

  async updateItem(itemId: string, menuId: string, dto: UpdateItemDTO): Promise<IMenuItemDocument> {
    const updateData: Record<string, unknown> = { ...dto };
    if (dto.categoryId) {
      updateData.categoryId = new Types.ObjectId(dto.categoryId);
    }
    const updated = await this.repo.updateItem(itemId, menuId, updateData as Partial<IMenuItemDocument>);
    if (!updated) {
      throw new NotFoundError('Menu item not found', MENU_ERROR_CODES.ITEM_NOT_FOUND);
    }
    return updated;
  }

  async deleteItem(itemId: string, menuId: string): Promise<{ success: boolean }> {
    const success = await this.repo.softDeleteItem(itemId, menuId);
    if (!success) {
      throw new NotFoundError('Menu item not found', MENU_ERROR_CODES.ITEM_NOT_FOUND);
    }
    return { success: true };
  }

  async duplicateItem(itemId: string, menuId: string): Promise<IMenuItemDocument> {
    const sourceItem = await this.getItem(itemId);
    return this.repo.createItem({
      menuId: new Types.ObjectId(menuId),
      categoryId: sourceItem.categoryId,
      restaurantId: sourceItem.restaurantId,
      itemName: `${sourceItem.itemName} (Copy)`,
      itemDescription: sourceItem.itemDescription,
      basePrice: sourceItem.basePrice,
      discountedPrice: sourceItem.discountedPrice,
      isVeg: sourceItem.isVeg,
      dietaryTags: sourceItem.dietaryTags,
      publishState: 'draft',
      availabilityStatus: 'available',
    });
  }

  async publishItem(itemId: string, menuId: string): Promise<IMenuItemDocument> {
    return this.updateItem(itemId, menuId, { publishState: 'published' } as Partial<UpdateItemDTO>);
  }

  async unpublishItem(itemId: string, menuId: string): Promise<IMenuItemDocument> {
    return this.updateItem(itemId, menuId, { publishState: 'draft' } as Partial<UpdateItemDTO>);
  }

  async archiveItem(itemId: string, menuId: string): Promise<IMenuItemDocument> {
    return this.updateItem(itemId, menuId, { publishState: 'archived' } as Partial<UpdateItemDTO>);
  }

  // --- Variants & Addons Management ---
  async getVariants(itemId: string): Promise<IMenuVariantDocument[]> {
    return this.repo.getVariants(itemId);
  }

  async createVariant(itemId: string, restaurantId: string, dto: CreateVariantDTO): Promise<IMenuVariantDocument> {
    return this.repo.createVariant({
      itemId: new Types.ObjectId(itemId),
      restaurantId: new Types.ObjectId(restaurantId),
      ...dto,
    });
  }

  async updateVariant(variantId: string, itemId: string, dto: UpdateVariantDTO): Promise<IMenuVariantDocument> {
    const updated = await this.repo.updateVariant(variantId, itemId, dto);
    if (!updated) {
      throw new NotFoundError('Variant not found', MENU_ERROR_CODES.VARIANT_NOT_FOUND);
    }
    return updated;
  }

  async deleteVariant(variantId: string, itemId: string): Promise<{ success: boolean }> {
    const success = await this.repo.deleteVariant(variantId, itemId);
    if (!success) {
      throw new NotFoundError('Variant not found', MENU_ERROR_CODES.VARIANT_NOT_FOUND);
    }
    return { success: true };
  }

  async getAddons(itemId: string): Promise<IMenuAddonDocument[]> {
    return this.repo.getAddons(itemId);
  }

  async createAddon(itemId: string, restaurantId: string, dto: CreateAddonDTO): Promise<IMenuAddonDocument> {
    return this.repo.createAddon({
      itemId: new Types.ObjectId(itemId),
      restaurantId: new Types.ObjectId(restaurantId),
      ...dto,
    });
  }

  async updateAddon(addonId: string, itemId: string, dto: UpdateAddonDTO): Promise<IMenuAddonDocument> {
    const updated = await this.repo.updateAddon(addonId, itemId, dto);
    if (!updated) {
      throw new NotFoundError('Addon not found', MENU_ERROR_CODES.ADDON_NOT_FOUND);
    }
    return updated;
  }

  async deleteAddon(addonId: string, itemId: string): Promise<{ success: boolean }> {
    const success = await this.repo.deleteAddon(addonId, itemId);
    if (!success) {
      throw new NotFoundError('Addon not found', MENU_ERROR_CODES.ADDON_NOT_FOUND);
    }
    return { success: true };
  }

  // --- Media, Nutrition & Availability ---
  async updateMedia(itemId: string, menuId: string, dto: UpdateMediaDTO): Promise<IMenuItemDocument> {
    const updateData: Record<string, unknown> = {};
    if (dto.primaryImageUrl !== undefined) updateData['media.primaryImageUrl'] = dto.primaryImageUrl;
    if (dto.galleryUrls !== undefined) updateData['media.galleryUrls'] = dto.galleryUrls;
    return this.updateItem(itemId, menuId, updateData as Partial<UpdateItemDTO>);
  }

  async updateNutrition(itemId: string, menuId: string, dto: UpdateNutritionDTO): Promise<IMenuItemDocument> {
    const updateData: Record<string, unknown> = {};
    if (dto.calories !== undefined) updateData['nutrition.calories'] = dto.calories;
    if (dto.proteinGrams !== undefined) updateData['nutrition.proteinGrams'] = dto.proteinGrams;
    if (dto.carbsGrams !== undefined) updateData['nutrition.carbsGrams'] = dto.carbsGrams;
    if (dto.fatGrams !== undefined) updateData['nutrition.fatGrams'] = dto.fatGrams;
    if (dto.allergens !== undefined) updateData['nutrition.allergens'] = dto.allergens;
    if (dto.ingredients !== undefined) updateData['nutrition.ingredients'] = dto.ingredients;
    return this.updateItem(itemId, menuId, updateData as Partial<UpdateItemDTO>);
  }

  async updateAvailability(itemId: string, menuId: string, dto: UpdateAvailabilityDTO): Promise<IMenuItemDocument> {
    const updateData: Record<string, unknown> = {};
    if (dto.availableDays !== undefined) updateData['availability.availableDays'] = dto.availableDays;
    if (dto.isAvailableAllDay !== undefined) updateData['availability.isAvailableAllDay'] = dto.isAvailableAllDay;
    if (dto.timeWindow) {
      updateData['availability.timeWindow.startTime'] = dto.timeWindow.startTime;
      updateData['availability.timeWindow.endTime'] = dto.timeWindow.endTime;
    }
    return this.updateItem(itemId, menuId, updateData as Partial<UpdateItemDTO>);
  }
}

export const menusService = new MenusService();
