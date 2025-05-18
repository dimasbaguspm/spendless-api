import { Request, Response } from 'express';

import { BadRequestException, NotFoundException } from '../helpers/exceptions/index.ts';
import { getErrorResponse } from '../helpers/http-response/index.ts';
import { getZodErrorDetails, validate } from '../helpers/validation/index.ts';
import {
  createTransactionSchema,
  updateTransactionSchema,
  transactionQuerySchema,
} from '../helpers/validation/transaction.schema.ts';
import { NewTransaction } from '../models/schema.ts';
import { CategoryService } from '../services/category.service.ts';
import { TokenService } from '../services/token.service.ts';
import { TransactionService } from '../services/transaction.service.ts';

export class TransactionController {
  private transactionService: TransactionService;
  private categoryService: CategoryService;
  private tokenService: TokenService;

  constructor() {
    this.transactionService = new TransactionService();
    this.categoryService = new CategoryService();
    this.tokenService = new TokenService();
  }

  /**
   * Create a new transaction
   */
  async createTransaction(req: Request, res: Response) {
    try {
      const { id: userId } = this.tokenService.getUserFromRequest(req);

      const { data, error, success } = await validate(createTransactionSchema, req?.body);

      if (!success) {
        throw new BadRequestException('Validation error', {
          errors: getZodErrorDetails(error),
        });
      }

      // Verify the category exists and belongs to the user
      const category = await this.categoryService.getCategoryById(data.categoryId, { userId });
      if (!category) {
        throw new NotFoundException('Category not found');
      }

      const transactionData = {
        userId,
        categoryId: data.categoryId,
        amount: data.amount.toString(), // Ensure amount is a string
        date: new Date(data.date).toISOString(), // Ensure date is in ISO format
        note: data.note,
      } satisfies NewTransaction;

      const result = await this.transactionService.createTransaction(transactionData);

      res.status(201).json(result);
    } catch (error) {
      getErrorResponse(res, error);
    }
  }

  /**
   * Get all transactions for a user with optional filtering
   */
  async getTransactions(req: Request, res: Response) {
    try {
      const { id: userId } = this.tokenService.getUserFromRequest(req);

      const { data, error, success } = await validate(transactionQuerySchema, req?.query ?? {});

      if (!success) {
        throw new BadRequestException('Validation error', {
          errors: getZodErrorDetails(error),
        });
      }

      const transactions = await this.transactionService.getTransactions(userId, {
        categoryId: +(data?.categoryId ?? ''),
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize,
        sortBy: data.sortBy,
        sortOrder: data.sortOrder,
      });

      res.status(200).json(transactions);
    } catch (error) {
      getErrorResponse(res, error);
    }
  }

  /**
   * Get a specific transaction by ID
   */
  async getTransactionById(req: Request, res: Response) {
    try {
      const transactionId = parseInt(req.params.id, 10);

      if (isNaN(transactionId)) throw new BadRequestException('Invalid transaction ID');

      const { id: userId } = this.tokenService.getUserFromRequest(req);

      const transaction = await this.transactionService.getTransactionById(transactionId, userId);

      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      res.status(200).json(transaction);
    } catch (error) {
      getErrorResponse(res, error);
    }
  }

  /**
   * Update a transaction
   */
  async updateTransaction(req: Request, res: Response) {
    try {
      const transactionId = parseInt(req.params.id, 10);

      if (isNaN(transactionId)) throw new BadRequestException('Invalid transaction ID');

      const { id: userId } = this.tokenService.getUserFromRequest(req);

      const { data, error, success } = await validate(updateTransactionSchema, req?.body);

      if (!success) {
        throw new BadRequestException('Validation error', {
          errors: getZodErrorDetails(error),
        });
      }

      // If category ID is provided, verify it exists and belongs to the user
      if (data.categoryId) {
        const category = await this.categoryService.getCategoryById(data.categoryId, { userId });
        if (!category) throw new NotFoundException('Category not found');
      }

      // Prepare update data with proper types
      const updateData: Partial<Omit<NewTransaction, 'createdAt' | 'updatedAt' | 'userId'>> = {};

      if (data.categoryId !== undefined) {
        updateData.categoryId = data.categoryId;
      }

      if (data.amount !== undefined) {
        updateData.amount = data.amount.toString();
      }

      if (data.date !== undefined) {
        updateData.date = new Date(data.date).toISOString();
      }

      if (data.note !== undefined) {
        updateData.note = data.note;
      }

      const updatedTransaction = await this.transactionService.updateTransaction(transactionId, userId, updateData);

      if (!updatedTransaction) {
        throw new NotFoundException('Transaction not found');
      }

      res.status(200).json(updatedTransaction);
    } catch (error) {
      getErrorResponse(res, error);
    }
  }

  /**
   * Delete a transaction
   */
  async deleteTransaction(req: Request, res: Response) {
    try {
      const transactionId = parseInt(req.params.id, 10);

      if (isNaN(transactionId)) throw new BadRequestException('Invalid transaction ID');

      const { id: userId } = this.tokenService.getUserFromRequest(req);

      const isDeleted = await this.transactionService.deleteTransaction(transactionId, userId);

      if (!isDeleted) {
        throw new NotFoundException('Transaction not found');
      }

      res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      getErrorResponse(res, error);
    }
  }
}
