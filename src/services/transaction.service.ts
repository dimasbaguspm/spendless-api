import { SQL, and, asc, desc, eq, gte, ilike, lte } from 'drizzle-orm';

import { db } from '../core/db/config.ts';
import { TransactionQueryInput } from '../helpers/validation/transaction.schema.ts';
import { transactions, NewTransaction, Transaction } from '../models/schema.ts';

export class TransactionService {
  /**
   * Create a new transaction for a user
   */
  async createTransaction(transactionData: NewTransaction): Promise<Transaction> {
    const [transaction] = await db.insert(transactions).values(transactionData).returning();
    return transaction;
  }

  /**
   * Get all transactions for a user with optional filtering
   */
  async getTransactions(userId: number, filters?: TransactionQueryInput): Promise<Transaction[]> {
    const {
      categoryId,
      startDate,
      endDate,
      note,
      pageNumber = 1,
      pageSize = 25,
      sortBy = 'createdAt',
      sortOrder = 'asc',
    } = filters ?? {};

    // Build filter conditions
    const conditions: SQL[] = [eq(transactions.userId, userId)];
    if (categoryId) conditions.push(eq(transactions.categoryId, categoryId));
    if (startDate) conditions.push(gte(transactions.date, startDate));
    if (endDate) conditions.push(lte(transactions.date, endDate));
    if (note) conditions.push(ilike(transactions.note, `%${note}%`));

    // handle sorting
    const isAscending = sortOrder === 'asc';
    let order: SQL | null = null;
    switch (sortBy) {
      case 'amount':
        order = isAscending ? asc(transactions.amount) : desc(transactions.amount);
        break;
      case 'date':
        order = isAscending ? asc(transactions.date) : desc(transactions.date);
        break;
      default:
        order = isAscending ? asc(transactions.createdAt) : desc(transactions.createdAt);
        break;
    }

    // Start building the query
    return await db
      .select()
      .from(transactions)
      .where(and(...conditions))
      .orderBy(order)
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize);
  }

  /**
   * Get a specific transaction by ID
   * Optionally validate that it belongs to the specified user
   */
  async getTransactionById(transactionId: number, userId?: number): Promise<Transaction | undefined> {
    const conditions: SQL[] = [eq(transactions.id, transactionId)];
    if (userId !== undefined) {
      conditions.push(eq(transactions.userId, userId));
    }

    const [transaction] = await db
      .select()
      .from(transactions)
      .where(and(...conditions));

    return transaction;
  }

  /**
   * Update a transaction by ID
   * Returns the updated transaction or undefined if not found
   */
  async updateTransaction(
    transactionId: number,
    userId: number,
    updateData: Partial<Omit<NewTransaction, 'createdAt' | 'updatedAt' | 'userId'>>
  ): Promise<Transaction | undefined> {
    // First check if the transaction exists and belongs to the user
    const transactionExists = await this.getTransactionById(transactionId, userId);

    if (!transactionExists) {
      return undefined;
    }

    const [updatedTransaction] = await db
      .update(transactions)
      .set({ ...updateData, updatedAt: new Date().toISOString() })
      .where(and(eq(transactions.id, transactionId), eq(transactions.userId, userId)))
      .returning();

    return updatedTransaction;
  }

  /**
   * Delete a transaction by ID
   * Returns true if successful, false if not found or doesn't belong to user
   */
  async deleteTransaction(transactionId: number, userId: number): Promise<boolean> {
    // First check if the transaction exists and belongs to the user
    const transactionExists = await this.getTransactionById(transactionId, userId);

    if (!transactionExists) {
      return false;
    }

    const result = await db
      .delete(transactions)
      .where(and(eq(transactions.id, transactionId), eq(transactions.userId, userId)))
      .returning({ deletedId: transactions.id });

    return result.length > 0;
  }
}
