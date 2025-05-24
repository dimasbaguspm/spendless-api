import { BadRequestException } from '../exceptions/index.ts';

/**
 * Parses a string ID into a number
 * @param id The string ID to parse
 * @param errorMessage Optional custom error message
 * @returns The parsed number ID
 * @throws BadRequestException if the ID is not a valid number
 */
export function parseId(id: unknown, errorMessage?: string): number {
  if (typeof id === 'undefined' || id === null || id === '') {
    throw new BadRequestException(errorMessage ?? 'ID is required');
  }

  if (!['number', 'string'].includes(typeof id)) {
    throw new BadRequestException(errorMessage ?? 'ID must be a number or string');
  }

  const parsedId = parseInt(id as string, 10);

  if (isNaN(parsedId)) {
    throw new BadRequestException(errorMessage ?? `Invalid ID. Must be a valid number.`);
  }

  return parsedId;
}

/**
 * Parses a string amount into a number
 * @param amount The string amount to parse
 * @param errorMessage Optional custom error message
 * @returns The parsed number amount
 * @throws BadRequestException if the amount is not a valid number
 */
export function parseAmount(amount: string, errorMessage?: string): number {
  if (!amount) {
    throw new BadRequestException(errorMessage ?? 'Amount is required');
  }

  const parsedAmount = parseFloat(amount);

  if (isNaN(parsedAmount)) {
    throw new BadRequestException(errorMessage ?? `Invalid amount: ${amount}. Must be a valid number.`);
  }

  return parsedAmount;
}
