import { Request, Response } from 'express';

import { BadRequestException, NotFoundException } from '../helpers/exceptions/index.ts';
import { getErrorResponse } from '../helpers/http-response/index.ts';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryQuerySchema,
} from '../helpers/validation/category.schema.ts';
import { getZodErrorDetails, validate } from '../helpers/validation/index.ts';
import { CategoryService } from '../services/category.service.ts';
import { TokenService } from '../services/token.service.ts';

export class CategoryController {
  private categoryService: CategoryService;
  private tokenService: TokenService;

  constructor() {
    this.categoryService = new CategoryService();
    this.tokenService = new TokenService();
  }

  /**
   * Create a new category
   */
  async createCategory(req: Request, res: Response) {
    try {
      const { id: userId } = this.tokenService.getUserFromRequest(req);

      const { data, error, success } = await validate(createCategorySchema, req?.body);

      if (!success) {
        throw new BadRequestException('Validation error', {
          errors: getZodErrorDetails(error),
        });
      }

      const categoryData = {
        ...data,
        userId,
      };

      const result = await this.categoryService.createCategory(categoryData);

      res.status(201).json(result);
    } catch (error) {
      getErrorResponse(res, error);
    }
  }

  /**
   * Get all categories for a user
   */
  async getCategories(req: Request, res: Response) {
    try {
      const { id: userId } = this.tokenService.getUserFromRequest(req);

      const { data, error, success } = await validate(categoryQuerySchema, req.query);

      if (!success) {
        throw new BadRequestException('Validation error', {
          errors: getZodErrorDetails(error),
        });
      }

      const categories = await this.categoryService.getCategoriesByUserId(userId, {
        type: data.type,
        name: data.name,
        sortBy: data.sortBy as 'name' | 'createdAt' | undefined,
        sortOrder: data.sortOrder as 'asc' | 'desc' | undefined,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize,
      });

      res.status(200).json(categories);
    } catch (error) {
      getErrorResponse(res, error);
    }
  }

  /**
   * Get a specific category by ID
   */
  async getCategoryById(req: Request, res: Response) {
    try {
      const categoryId = parseInt(req.params.id, 10);

      if (isNaN(categoryId)) throw new BadRequestException('Invalid category ID');

      const { id: userId } = this.tokenService.getUserFromRequest(req);

      const category = await this.categoryService.getCategoryById(categoryId, { userId });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      res.status(200).json(category);
    } catch (error) {
      getErrorResponse(res, error);
    }
  }

  /**
   * Update a category
   */
  async updateCategory(req: Request, res: Response) {
    try {
      const categoryId = parseInt(req.params.id, 10);

      if (isNaN(categoryId)) throw new BadRequestException('Invalid category ID');

      const { id: userId } = this.tokenService.getUserFromRequest(req);

      const { data, error, success } = await validate(updateCategorySchema, req?.body);

      if (!success) {
        throw new BadRequestException('Validation error', {
          errors: getZodErrorDetails(error),
        });
      }

      const updatedCategory = await this.categoryService.updateCategory(categoryId, userId, data);

      if (!updatedCategory) {
        throw new NotFoundException('Category not found');
      }

      res.status(200).json(updatedCategory);
    } catch (error) {
      getErrorResponse(res, error);
    }
  }

  /**
   * Delete a category
   */
  async deleteCategory(req: Request, res: Response) {
    try {
      const categoryId = parseInt(req.params.id, 10);

      if (isNaN(categoryId)) throw new BadRequestException('Invalid category ID');

      const { id: userId } = this.tokenService.getUserFromRequest(req);

      const isDeleted = await this.categoryService.deleteCategory(categoryId, userId);

      if (!isDeleted) {
        throw new NotFoundException('Category not found');
      }

      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      getErrorResponse(res, error);
    }
  }
}
