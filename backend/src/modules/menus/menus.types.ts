import { MenuType, MenuStatus, MenuVisibility, PublishState } from './menus.model.js';
import { ItemAvailabilityStatus } from './models/menuItem.model.js';
import { IAddonItem } from './models/menuAddon.model.js';

export interface CreateMenuDTO {
  branchId?: string;
  menuName: string;
  menuDescription?: string;
  menuType?: MenuType;
  visibility?: MenuVisibility;
  currency?: string;
}

export interface UpdateMenuDTO extends Partial<CreateMenuDTO> {
  status?: MenuStatus;
}

export interface CreateCategoryDTO {
  categoryName: string;
  categoryDescription?: string;
  parentCategoryId?: string;
  displayOrder?: number;
  isFeatured?: boolean;
  visibility?: 'public' | 'hidden';
}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {}

export interface ReorderCategoriesDTO {
  orderedCategoryIds: string[];
}

export interface CreateItemDTO {
  categoryId: string;
  itemName: string;
  itemDescription?: string;
  basePrice: number;
  discountedPrice?: number;
  currency?: string;
  isVeg?: boolean;
  dietaryTags?: string[];
  displayOrder?: number;
}

export interface UpdateItemDTO extends Partial<CreateItemDTO> {
  availabilityStatus?: ItemAvailabilityStatus;
}

export interface CreateVariantDTO {
  variantName: string;
  priceAdjustment?: number;
  isDefault?: boolean;
}

export interface UpdateVariantDTO extends Partial<CreateVariantDTO> {
  availabilityStatus?: 'available' | 'out_of_stock';
}

export interface CreateAddonDTO {
  groupName: string;
  isRequired?: boolean;
  minSelections?: number;
  maxSelections?: number;
  addonItems: IAddonItem[];
}

export interface UpdateAddonDTO extends Partial<CreateAddonDTO> {}

export interface UpdateMediaDTO {
  primaryImageUrl?: string;
  galleryUrls?: string[];
}

export interface UpdateNutritionDTO {
  calories?: number;
  proteinGrams?: number;
  carbsGrams?: number;
  fatGrams?: number;
  allergens?: string[];
  ingredients?: string[];
}

export interface UpdateAvailabilityDTO {
  availableDays?: string[];
  timeWindow?: {
    startTime: string;
    endTime: string;
  };
  isAvailableAllDay?: boolean;
}

export interface MenuSummaryResponse {
  menuId: string;
  menuName: string;
  publishState: PublishState;
  status: MenuStatus;
  profileCompleteness: number;
  stats: {
    totalCategoriesCount: number;
    totalItemsCount: number;
    publishedItemsCount: number;
    draftItemsCount: number;
    archivedItemsCount: number;
  };
  missingSetupItems: string[];
  createdAt: Date;
}
