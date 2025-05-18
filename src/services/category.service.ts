import { SQL, and, asc, desc, eq, ilike } from 'drizzle-orm';

import { db } from '../core/db/config.ts';
import { CategoryQueryInput } from '../helpers/validation/category.schema.ts';
import { categories, NewCategory, Category } from '../models/schema.ts';

export class CategoryService {
  /**
   * Create a new category for a user
   */
  async createCategory(categoryData: NewCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(categoryData).returning();
    return category;
  }

  /**
   * Get all categories for a user
   * If includeDefault is true, also return categories without a userId (default categories)
   */
  async getCategoriesByUserId(userId: number, filters?: Partial<CategoryQueryInput>): Promise<Category[]> {
    const { type, name, sortBy = 'createdAt', sortOrder = 'asc', pageSize = 25, pageNumber = 1 } = filters ?? {};

    // Build filter conditions
    const conditions: SQL[] = [eq(categories.userId, userId)];
    if (type) conditions.push(eq(categories.type, type));
    if (name) conditions.push(ilike(categories.name, `%${name}%`));

    // handle sorting
    const isAscending = sortOrder === 'asc';
    let order: SQL | null = null;
    switch (sortBy) {
      case 'name':
        order = isAscending ? asc(categories.name) : desc(categories.name);
        break;
      default:
        order = isAscending ? asc(categories.createdAt) : desc(categories.createdAt);
        break;
    }

    const userCategories = await db
      .select()
      .from(categories)
      .where(and(...conditions))
      .orderBy(order)
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize);

    return userCategories;
  }

  /**
   * Get a specific category by ID
   * Optionally validate that it belongs to the specified user
   */
  async getCategoryById(
    categoryId: number,
    filters?: {
      userId?: number;
    }
  ): Promise<Category | undefined> {
    const { userId } = filters ?? {};

    const conditions: SQL[] = [eq(categories.id, categoryId)];

    if (userId) conditions.push(eq(categories.userId, userId));

    const [category] = await db
      .select()
      .from(categories)
      .where(and(...conditions));

    return category;
  }

  /**
   * Update a category by ID
   * Returns the updated category or undefined if not found
   */
  async updateCategory(
    categoryId: number,
    userId: number,
    updateData: Partial<Omit<NewCategory, 'createdAt' | 'updatedAt' | 'userId'>>
  ): Promise<Category | undefined> {
    // First check if the category exists and belongs to the user
    const categoryExists = await this.getCategoryById(categoryId, { userId });

    if (!categoryExists) return undefined;

    const [updatedCategory] = await db
      .update(categories)
      .set({ ...updateData, updatedAt: new Date().toISOString() })
      .where(eq(categories.id, categoryId))
      .returning();

    return updatedCategory;
  }

  /**
   * Delete a category by ID
   * Returns true if successful, false if not found or doesn't belong to user
   */
  async deleteCategory(categoryId: number, userId: number): Promise<boolean> {
    // First check if the category exists and belongs to the user
    const categoryExists = await this.getCategoryById(categoryId, { userId });

    if (!categoryExists) return false;

    const result = await db
      .delete(categories)
      .where(eq(categories.id, categoryId))
      .returning({ deletedId: categories.id });

    return result.length > 0;
  }
}
