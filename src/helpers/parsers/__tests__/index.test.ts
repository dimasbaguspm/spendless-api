import { BadRequestException } from '../../exceptions/index.ts';
import { parseId, parseAmount } from '../index.ts';

describe('parseId', () => {
  it('should parse valid string ID', () => {
    expect(parseId('123')).toBe(123);
    expect(parseId('456')).toBe(456);
    expect(parseId('0')).toBe(0);
  });

  it('should parse valid number ID', () => {
    expect(parseId(123)).toBe(123);
    expect(parseId(456)).toBe(456);
    expect(parseId(0)).toBe(0);
  });

  it('should handle negative numbers', () => {
    expect(parseId('-123')).toBe(-123);
    expect(parseId(-456)).toBe(-456);
  });

  it('should handle large numbers', () => {
    expect(parseId('999999')).toBe(999999);
    expect(parseId(999999)).toBe(999999);
  });

  it('should throw BadRequestException for null/undefined ID', () => {
    expect(() => parseId(null)).toThrow(BadRequestException);
    expect(() => parseId(undefined)).toThrow(BadRequestException);
    expect(() => parseId('')).toThrow(BadRequestException);

    expect(() => parseId(null)).toThrow('ID is required');
    expect(() => parseId(undefined)).toThrow('ID is required');
    expect(() => parseId('')).toThrow('ID is required');
  });

  it('should throw BadRequestException for invalid types', () => {
    expect(() => parseId({})).toThrow(BadRequestException);
    expect(() => parseId([])).toThrow(BadRequestException);
    expect(() => parseId(true)).toThrow(BadRequestException);
    expect(() => parseId(false)).toThrow(BadRequestException);

    expect(() => parseId({})).toThrow('ID must be a number or string');
    expect(() => parseId([])).toThrow('ID must be a number or string');
  });

  it('should throw BadRequestException for invalid string numbers', () => {
    expect(() => parseId('abc')).toThrow(BadRequestException);
    expect(() => parseId('NaN')).toThrow(BadRequestException);

    expect(() => parseId('abc')).toThrow('Invalid ID. Must be a valid number.');
  });

  it('should use custom error message when provided', () => {
    const customMessage = 'Custom ID error';

    expect(() => parseId(null, customMessage)).toThrow(customMessage);
    expect(() => parseId({}, customMessage)).toThrow(customMessage);
    expect(() => parseId('abc', customMessage)).toThrow(customMessage);
  });

  it('should handle edge cases with whitespace', () => {
    expect(parseId(' 123 ')).toBe(123);
    expect(parseId('  456  ')).toBe(456);
  });

  it('should handle zero values correctly', () => {
    expect(parseId('0')).toBe(0);
    expect(parseId(0)).toBe(0);
    expect(() => parseId('00')).not.toThrow();
    expect(parseId('00')).toBe(0);
  });
});

describe('parseAmount', () => {
  it('should parse valid string amounts', () => {
    expect(parseAmount('123')).toBe(123);
    expect(parseAmount('123.45')).toBe(123.45);
    expect(parseAmount('0')).toBe(0);
    expect(parseAmount('0.0')).toBe(0);
  });

  it('should parse decimal amounts', () => {
    expect(parseAmount('12.34')).toBe(12.34);
    expect(parseAmount('0.99')).toBe(0.99);
    expect(parseAmount('999.999')).toBe(999.999);
  });

  it('should handle negative amounts', () => {
    expect(parseAmount('-123')).toBe(-123);
    expect(parseAmount('-12.34')).toBe(-12.34);
    expect(parseAmount('-0.5')).toBe(-0.5);
  });

  it('should handle large amounts', () => {
    expect(parseAmount('999999.99')).toBe(999999.99);
    expect(parseAmount('1000000')).toBe(1000000);
  });

  it('should handle scientific notation', () => {
    expect(parseAmount('1e2')).toBe(100);
    expect(parseAmount('1.23e2')).toBe(123);
    expect(parseAmount('1e-2')).toBe(0.01);
    expect(parseAmount('123.abc')).toBe(123);
  });

  it('should throw BadRequestException for empty/null amount', () => {
    expect(() => parseAmount('')).toThrow(BadRequestException);
    expect(() => parseAmount(null as unknown as string)).toThrow(BadRequestException);
    expect(() => parseAmount(undefined as unknown as string)).toThrow(BadRequestException);

    expect(() => parseAmount('')).toThrow('Amount is required');
    expect(() => parseAmount(null as unknown as string)).toThrow('Amount is required');
  });

  it('should throw BadRequestException for invalid string amounts', () => {
    expect(() => parseAmount('abc')).toThrow(BadRequestException);
    expect(() => parseAmount('NaN')).toThrow(BadRequestException);

    expect(() => parseAmount('abc')).toThrow('Invalid amount: abc. Must be a valid number.');
  });

  it('should use custom error message when provided', () => {
    const customMessage = 'Custom amount error';

    expect(() => parseAmount('', customMessage)).toThrow(customMessage);
    expect(() => parseAmount('abc', customMessage)).toThrow(customMessage);
    expect(() => parseAmount(null as unknown as string, customMessage)).toThrow(customMessage);
  });

  it('should handle edge cases with whitespace', () => {
    expect(parseAmount(' 123 ')).toBe(123);
    expect(parseAmount('  12.34  ')).toBe(12.34);
  });

  it('should handle special numeric strings', () => {
    expect(parseAmount('+123')).toBe(123);
    expect(parseAmount('+12.34')).toBe(12.34);
  });

  it('should handle zero values correctly', () => {
    expect(parseAmount('0')).toBe(0);
    expect(parseAmount('0.0')).toBe(0);
    expect(parseAmount('00')).toBe(0);
    expect(parseAmount('0.00')).toBe(0);
  });

  it('should handle very small decimal amounts', () => {
    expect(parseAmount('0.01')).toBe(0.01);
    expect(parseAmount('0.001')).toBe(0.001);
    expect(parseAmount('0.0001')).toBe(0.0001);
  });
});
