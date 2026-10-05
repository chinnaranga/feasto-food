import { Types } from 'mongoose';
import { Menu, IMenuDocument } from './menus.model.js';
import { MenuCategory, IMenuCategoryDocument } from './models/menuCategory.model.js';
import { MenuItem, IMenuItemDocument } from './models/menuItem.model.js';
import { MenuVariant, IMenuVariantDocument } from './models/menuVariant.model.js';
import { MenuAddon, IMenuAddonDocument } from './models/menuAddon.model.js';

export class MenusRepository {
  // --- Menu Repository Methods ---
  async createMenu(menuData: Partial<IMenuDocument>): Promise<IMenuDocument> {
    const menu = new Menu(menuData);
    return menu.save();
  }

  async findMenuById(menuId: string | Types.ObjectId): Promise<IMenuDocument | null> {
    return Menu.findOne({ _id: menuId, isDeleted: false }).exec();
  }

  async getMenusByRestaurant(restaurantId: string | Types.ObjectId): Promise<IMenuDocument[]> {
    return Menu.find({ restaurantId, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async updateMenu(
    menuId: string | Types.ObjectId,
    updateData: Partial<IMenuDocument>
  ): Promise<IMenuDocument | null> {
    return Menu.findOneAndUpdate(
      { _id: menuId, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  async softDeleteMenu(menuId: string | Types.ObjectId): Promise<boolean> {
    const result = await Menu.findOneAndUpdate(
      { _id: menuId, isDeleted: false },
      { $set: { isDeleted: true, status: 'archived', publishState: 'archived' } }
    ).exec();
    return result !== null;
  }

  // --- Category Repository Methods ---
  async countCategories(menuId: string | Types.ObjectId): Promise<number> {
    return MenuCategory.countDocuments({ menuId, isDeleted: false }).exec();
  }

  async getCategories(menuId: string | Types.ObjectId): Promise<IMenuCategoryDocument[]> {
    return MenuCategory.find({ menuId, isDeleted: false }).sort({ displayOrder: 1, createdAt: 1 }).exec();
  }

  async findCategoryById(categoryId: string | Types.ObjectId): Promise<IMenuCategoryDocument | null> {
    return MenuCategory.findOne({ _id: categoryId, isDeleted: false }).exec();
  }

  async createCategory(categoryData: Partial<IMenuCategoryDocument>): Promise<IMenuCategoryDocument> {
    const category = new MenuCategory(categoryData);
    return category.save();
  }

  async updateCategory(
    categoryId: string | Types.ObjectId,
    menuId: string | Types.ObjectId,
    updateData: Partial<IMenuCategoryDocument>
  ): Promise<IMenuCategoryDocument | null> {
    return MenuCategory.findOneAndUpdate(
      { _id: categoryId, menuId, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  async softDeleteCategory(categoryId: string | Types.ObjectId, menuId: string | Types.ObjectId): Promise<boolean> {
    const result = await MenuCategory.findOneAndUpdate(
      { _id: categoryId, menuId, isDeleted: false },
      { $set: { isDeleted: true } }
    ).exec();
    return result !== null;
  }

  // --- Item Repository Methods ---
  async countItems(menuId: string | Types.ObjectId): Promise<number> {
    return MenuItem.countDocuments({ menuId, isDeleted: false }).exec();
  }

  async countItemsByPublishState(menuId: string | Types.ObjectId, publishState: string): Promise<number> {
    return MenuItem.countDocuments({ menuId, publishState, isDeleted: false }).exec();
  }

  async getItems(menuId: string | Types.ObjectId, categoryId?: string): Promise<IMenuItemDocument[]> {
    const query: Record<string, unknown> = { menuId, isDeleted: false };
    if (categoryId) query.categoryId = categoryId;
    return MenuItem.find(query).sort({ displayOrder: 1, createdAt: 1 }).exec();
  }

  async findItemById(itemId: string | Types.ObjectId): Promise<IMenuItemDocument | null> {
    return MenuItem.findOne({ _id: itemId, isDeleted: false }).exec();
  }

  async createItem(itemData: Partial<IMenuItemDocument>): Promise<IMenuItemDocument> {
    const item = new MenuItem(itemData);
    return item.save();
  }

  async updateItem(
    itemId: string | Types.ObjectId,
    menuId: string | Types.ObjectId,
    updateData: Partial<IMenuItemDocument>
  ): Promise<IMenuItemDocument | null> {
    return MenuItem.findOneAndUpdate(
      { _id: itemId, menuId, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  async softDeleteItem(itemId: string | Types.ObjectId, menuId: string | Types.ObjectId): Promise<boolean> {
    const result = await MenuItem.findOneAndUpdate(
      { _id: itemId, menuId, isDeleted: false },
      { $set: { isDeleted: true, publishState: 'archived' } }
    ).exec();
    return result !== null;
  }

  // --- Variants Repository Methods ---
  async getVariants(itemId: string | Types.ObjectId): Promise<IMenuVariantDocument[]> {
    return MenuVariant.find({ itemId }).sort({ isDefault: -1, createdAt: 1 }).exec();
  }

  async createVariant(variantData: Partial<IMenuVariantDocument>): Promise<IMenuVariantDocument> {
    const variant = new MenuVariant(variantData);
    return variant.save();
  }

  async updateVariant(
    variantId: string | Types.ObjectId,
    itemId: string | Types.ObjectId,
    updateData: Partial<IMenuVariantDocument>
  ): Promise<IMenuVariantDocument | null> {
    return MenuVariant.findOneAndUpdate(
      { _id: variantId, itemId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  async deleteVariant(variantId: string | Types.ObjectId, itemId: string | Types.ObjectId): Promise<boolean> {
    const result = await MenuVariant.findOneAndDelete({ _id: variantId, itemId }).exec();
    return result !== null;
  }

  // --- Addons Repository Methods ---
  async getAddons(itemId: string | Types.ObjectId): Promise<IMenuAddonDocument[]> {
    return MenuAddon.find({ itemId }).sort({ createdAt: 1 }).exec();
  }

  async createAddon(addonData: Partial<IMenuAddonDocument>): Promise<IMenuAddonDocument> {
    const addon = new MenuAddon(addonData);
    return addon.save();
  }

  async updateAddon(
    addonId: string | Types.ObjectId,
    itemId: string | Types.ObjectId,
    updateData: Partial<IMenuAddonDocument>
  ): Promise<IMenuAddonDocument | null> {
    return MenuAddon.findOneAndUpdate(
      { _id: addonId, itemId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  async deleteAddon(addonId: string | Types.ObjectId, itemId: string | Types.ObjectId): Promise<boolean> {
    const result = await MenuAddon.findOneAndDelete({ _id: addonId, itemId }).exec();
    return result !== null;
  }
}

export const menusRepository = new MenusRepository();
