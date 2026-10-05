import { IMenuDocument } from './menus.model.js';

export interface MenuCompletenessResult {
  score: number;
  missingItems: string[];
}

export const calculateMenuCompleteness = (
  menu: IMenuDocument,
  categoryCount: number = 0,
  itemCount: number = 0,
  publishedItemCount: number = 0
): MenuCompletenessResult => {
  let score = 0;
  const missingItems: string[] = [];

  // Menu Profile (30%)
  if (menu.menuName && menu.menuType) {
    score += 30;
  } else {
    missingItems.push('menu_name_and_type');
  }

  // Categories Setup (20%)
  if (categoryCount > 0) {
    score += 20;
  } else {
    missingItems.push('categories_setup');
  }

  // Items Present (20%)
  if (itemCount > 0) {
    score += 20;
  } else {
    missingItems.push('menu_items');
  }

  // Published Items Present (15%)
  if (publishedItemCount > 0) {
    score += 15;
  } else {
    missingItems.push('published_items');
  }

  // Menu Published (15%)
  if (menu.publishState === 'published') {
    score += 15;
  } else {
    missingItems.push('menu_published_state');
  }

  return {
    score: Math.min(100, score),
    missingItems,
  };
};
