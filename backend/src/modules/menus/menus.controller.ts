import { Request, Response } from 'express';
import { menusService, MenusService } from './menus.service.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { HttpStatus } from '../../shared/constants/httpStatusCodes.js';

const parseParam = (val: string | string[] | undefined): string => {
  if (!val) return '';
  return Array.isArray(val) ? val[0] : val;
};

export class MenusController {
  constructor(private service: MenusService = menusService) {}

  getMenus = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const menus = await this.service.getMenusByRestaurant(restaurantId);
    sendSuccess(res, menus, 'Menus retrieved successfully');
  };

  createMenu = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const menu = await this.service.createMenu(restaurantId, req.body);
    sendSuccess(res, menu, 'Menu created successfully', HttpStatus.CREATED);
  };

  getMenu = async (req: Request, res: Response): Promise<void> => {
    const menuId = parseParam(req.params.menuId);
    const menu = await this.service.getMenu(menuId);
    sendSuccess(res, menu, 'Menu details retrieved');
  };

  updateMenu = async (req: Request, res: Response): Promise<void> => {
    const menuId = parseParam(req.params.menuId);
    const updated = await this.service.updateMenu(menuId, req.body);
    sendSuccess(res, updated, 'Menu updated successfully');
  };

  deleteMenu = async (req: Request, res: Response): Promise<void> => {
    const menuId = parseParam(req.params.menuId);
    const result = await this.service.deleteMenu(menuId);
    sendSuccess(res, result, 'Menu soft-deleted successfully');
  };

  duplicateMenu = async (req: Request, res: Response): Promise<void> => {
    const menuId = parseParam(req.params.menuId);
    const duplicated = await this.service.duplicateMenu(menuId);
    sendSuccess(res, duplicated, 'Menu duplicated successfully', HttpStatus.CREATED);
  };

  publishMenu = async (req: Request, res: Response): Promise<void> => {
    const menuId = parseParam(req.params.menuId);
    const published = await this.service.publishMenu(menuId);
    sendSuccess(res, published, 'Menu published live');
  };

  unpublishMenu = async (req: Request, res: Response): Promise<void> => {
    const menuId = parseParam(req.params.menuId);
    const unpublished = await this.service.unpublishMenu(menuId);
    sendSuccess(res, unpublished, 'Menu unpublished to draft state');
  };

  archiveMenu = async (req: Request, res: Response): Promise<void> => {
    const menuId = parseParam(req.params.menuId);
    const archived = await this.service.archiveMenu(menuId);
    sendSuccess(res, archived, 'Menu archived successfully');
  };

  getSummary = async (req: Request, res: Response): Promise<void> => {
    const menuId = parseParam(req.params.menuId);
    const summary = await this.service.getSummary(menuId);
    sendSuccess(res, summary, 'Menu summary retrieved');
  };

  // --- Category Handlers ---
  getCategories = async (req: Request, res: Response): Promise<void> => {
    const menuId = parseParam(req.params.menuId);
    const categories = await this.service.getCategories(menuId);
    sendSuccess(res, categories, 'Menu categories retrieved');
  };

  createCategory = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const menuId = parseParam(req.params.menuId);
    const category = await this.service.createCategory(menuId, restaurantId, req.body);
    sendSuccess(res, category, 'Category created successfully', HttpStatus.CREATED);
  };

  updateCategory = async (req: Request, res: Response): Promise<void> => {
    const menuId = parseParam(req.params.menuId);
    const categoryId = parseParam(req.params.categoryId);
    const updated = await this.service.updateCategory(categoryId, menuId, req.body);
    sendSuccess(res, updated, 'Category updated successfully');
  };

  deleteCategory = async (req: Request, res: Response): Promise<void> => {
    const menuId = parseParam(req.params.menuId);
    const categoryId = parseParam(req.params.categoryId);
    const result = await this.service.deleteCategory(categoryId, menuId);
    sendSuccess(res, result, 'Category deleted successfully');
  };

  reorderCategories = async (req: Request, res: Response): Promise<void> => {
    const menuId = parseParam(req.params.menuId);
    const result = await this.service.reorderCategories(menuId, req.body);
    sendSuccess(res, result, 'Categories reordered successfully');
  };

  // --- Item Handlers ---
  getItems = async (req: Request, res: Response): Promise<void> => {
    const menuId = parseParam(req.params.menuId);
    const categoryId = req.query.categoryId ? parseParam(req.query.categoryId as string) : undefined;
    const items = await this.service.getItems(menuId, categoryId);
    sendSuccess(res, items, 'Menu items retrieved');
  };

  createItem = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const menuId = parseParam(req.params.menuId);
    const item = await this.service.createItem(menuId, restaurantId, req.body);
    sendSuccess(res, item, 'Menu item created successfully', HttpStatus.CREATED);
  };

  getItem = async (req: Request, res: Response): Promise<void> => {
    const itemId = parseParam(req.params.itemId);
    const item = await this.service.getItem(itemId);
    sendSuccess(res, item, 'Menu item details retrieved');
  };

  updateItem = async (req: Request, res: Response): Promise<void> => {
    const menuId = parseParam(req.params.menuId);
    const itemId = parseParam(req.params.itemId);
    const updated = await this.service.updateItem(itemId, menuId, req.body);
    sendSuccess(res, updated, 'Menu item updated successfully');
  };

  deleteItem = async (req: Request, res: Response): Promise<void> => {
    const menuId = parseParam(req.params.menuId);
    const itemId = parseParam(req.params.itemId);
    const result = await this.service.deleteItem(itemId, menuId);
    sendSuccess(res, result, 'Menu item deleted successfully');
  };

  duplicateItem = async (req: Request, res: Response): Promise<void> => {
    const menuId = parseParam(req.params.menuId);
    const itemId = parseParam(req.params.itemId);
    const duplicated = await this.service.duplicateItem(itemId, menuId);
    sendSuccess(res, duplicated, 'Menu item duplicated', HttpStatus.CREATED);
  };

  publishItem = async (req: Request, res: Response): Promise<void> => {
    const menuId = parseParam(req.params.menuId);
    const itemId = parseParam(req.params.itemId);
    const published = await this.service.publishItem(itemId, menuId);
    sendSuccess(res, published, 'Item published live');
  };

  unpublishItem = async (req: Request, res: Response): Promise<void> => {
    const menuId = parseParam(req.params.menuId);
    const itemId = parseParam(req.params.itemId);
    const unpublished = await this.service.unpublishItem(itemId, menuId);
    sendSuccess(res, unpublished, 'Item unpublished to draft state');
  };

  archiveItem = async (req: Request, res: Response): Promise<void> => {
    const menuId = parseParam(req.params.menuId);
    const itemId = parseParam(req.params.itemId);
    const archived = await this.service.archiveItem(itemId, menuId);
    sendSuccess(res, archived, 'Item archived');
  };

  // --- Variants & Addons Handlers ---
  getVariants = async (req: Request, res: Response): Promise<void> => {
    const itemId = parseParam(req.params.itemId);
    const variants = await this.service.getVariants(itemId);
    sendSuccess(res, variants, 'Item variants retrieved');
  };

  createVariant = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const itemId = parseParam(req.params.itemId);
    const variant = await this.service.createVariant(itemId, restaurantId, req.body);
    sendSuccess(res, variant, 'Item variant created', HttpStatus.CREATED);
  };

  updateVariant = async (req: Request, res: Response): Promise<void> => {
    const itemId = parseParam(req.params.itemId);
    const variantId = parseParam(req.params.variantId);
    const updated = await this.service.updateVariant(variantId, itemId, req.body);
    sendSuccess(res, updated, 'Item variant updated');
  };

  deleteVariant = async (req: Request, res: Response): Promise<void> => {
    const itemId = parseParam(req.params.itemId);
    const variantId = parseParam(req.params.variantId);
    const result = await this.service.deleteVariant(variantId, itemId);
    sendSuccess(res, result, 'Item variant deleted');
  };

  getAddons = async (req: Request, res: Response): Promise<void> => {
    const itemId = parseParam(req.params.itemId);
    const addons = await this.service.getAddons(itemId);
    sendSuccess(res, addons, 'Item addon groups retrieved');
  };

  createAddon = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const itemId = parseParam(req.params.itemId);
    const addon = await this.service.createAddon(itemId, restaurantId, req.body);
    sendSuccess(res, addon, 'Addon group created', HttpStatus.CREATED);
  };

  updateAddon = async (req: Request, res: Response): Promise<void> => {
    const itemId = parseParam(req.params.itemId);
    const addonId = parseParam(req.params.addonId);
    const updated = await this.service.updateAddon(addonId, itemId, req.body);
    sendSuccess(res, updated, 'Addon group updated');
  };

  deleteAddon = async (req: Request, res: Response): Promise<void> => {
    const itemId = parseParam(req.params.itemId);
    const addonId = parseParam(req.params.addonId);
    const result = await this.service.deleteAddon(addonId, itemId);
    sendSuccess(res, result, 'Addon group deleted');
  };

  // --- Media, Nutrition & Availability ---
  updateMedia = async (req: Request, res: Response): Promise<void> => {
    const menuId = parseParam(req.params.menuId);
    const itemId = parseParam(req.params.itemId);
    const updated = await this.service.updateMedia(itemId, menuId, req.body);
    sendSuccess(res, updated, 'Item media updated');
  };

  updateNutrition = async (req: Request, res: Response): Promise<void> => {
    const menuId = parseParam(req.params.menuId);
    const itemId = parseParam(req.params.itemId);
    const updated = await this.service.updateNutrition(itemId, menuId, req.body);
    sendSuccess(res, updated, 'Item nutrition updated');
  };

  updateAvailability = async (req: Request, res: Response): Promise<void> => {
    const menuId = parseParam(req.params.menuId);
    const itemId = parseParam(req.params.itemId);
    const updated = await this.service.updateAvailability(itemId, menuId, req.body);
    sendSuccess(res, updated, 'Item availability schedule updated');
  };
}

export const menusController = new MenusController();
