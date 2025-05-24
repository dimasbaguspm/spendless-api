import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SpendLess API',
      version: '1.0.0',
      description: 'A comprehensive expense tracking and budget management API',
      contact: {
        name: 'Dimas Bagus P',
        email: 'dimas.bagus.pm1@gmail.com',
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === 'production'
            ? 'https://your-production-domain.com/api'
            : `http://localhost:${process.env.PORT ?? 3000}/api`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and registration endpoints',
      },
      {
        name: 'Users',
        description: 'User profile management',
      },
      {
        name: 'Groups',
        description: 'Group management and user invitations',
      },
      {
        name: 'Accounts',
        description: 'Account management (savings, checking, credit, cash)',
      },
      {
        name: 'Account Limits',
        description: 'Spending limits and budget controls',
      },
      {
        name: 'Categories',
        description: 'Income and expense category management',
      },
      {
        name: 'Transactions',
        description: 'Transaction recording and management',
      },
      {
        name: 'Summary',
        description: 'Financial summaries and reporting',
      },
      {
        name: 'Health',
        description: 'API health check endpoints',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT Bearer token',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
            status: {
              type: 'number',
              description: 'HTTP status code',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Error timestamp',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User unique identifier',
            },
            groupId: {
              type: 'integer',
              description: 'Group identifier the user belongs to',
            },
            email: {
              type: 'string',
              format: 'email',
              maxLength: 255,
              description: 'User email address',
            },
            name: {
              type: 'string',
              maxLength: 255,
              description: 'User full name',
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the user is active',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
            },
          },
        },
        Group: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Group unique identifier',
            },
            name: {
              type: 'string',
              maxLength: 255,
              description: 'Group name',
            },
            defaultCurrency: {
              type: 'string',
              minLength: 3,
              maxLength: 3,
              description: 'Default currency code (3 characters)',
              example: 'USD',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Group creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Group last update timestamp',
            },
          },
        },
        Account: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Account unique identifier',
            },
            groupId: {
              type: 'integer',
              description: 'Group identifier the account belongs to',
            },
            name: {
              type: 'string',
              maxLength: 255,
              description: 'Account name',
            },
            type: {
              type: 'string',
              maxLength: 50,
              description: 'Account type (e.g., checking, savings, credit, cash)',
              example: 'checking',
            },
            note: {
              type: 'string',
              nullable: true,
              description: 'Optional account notes',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account last update timestamp',
            },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Category unique identifier',
            },
            groupId: {
              type: 'integer',
              description: 'Group identifier the category belongs to',
            },
            parentId: {
              type: 'integer',
              nullable: true,
              description: 'Parent category ID for nested categories',
            },
            name: {
              type: 'string',
              maxLength: 100,
              description: 'Category name',
            },
            note: {
              type: 'string',
              nullable: true,
              description: 'Optional category notes',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Category creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Category last update timestamp',
            },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Transaction unique identifier',
            },
            groupId: {
              type: 'integer',
              description: 'Group identifier',
            },
            accountId: {
              type: 'integer',
              description: 'Account identifier',
            },
            categoryId: {
              type: 'integer',
              description: 'Category identifier',
            },
            createdByUserId: {
              type: 'integer',
              description: 'User who created the transaction',
            },
            amount: {
              type: 'number',
              multipleOf: 0.01,
              description: 'Transaction amount with 2 decimal precision',
              example: 123.45,
            },
            currency: {
              type: 'string',
              minLength: 3,
              maxLength: 3,
              description: 'Currency code (3 characters)',
              example: 'USD',
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Transaction date',
            },
            note: {
              type: 'string',
              nullable: true,
              description: 'Optional transaction notes',
            },
            recurrenceId: {
              type: 'integer',
              nullable: true,
              description: 'Recurrence pattern ID if this is a recurring transaction',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Transaction creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Transaction last update timestamp',
            },
          },
        },
        AuthTokens: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              description: 'JWT access token',
            },
            refreshToken: {
              type: 'string',
              description: 'JWT refresh token',
            },
            expiresIn: {
              type: 'number',
              description: 'Access token expiration time in seconds',
            },
          },
        },
        AccountLimit: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Account limit unique identifier',
            },
            accountId: {
              type: 'integer',
              description: 'Account identifier',
            },
            period: {
              type: 'string',
              enum: ['month', 'week'],
              description: 'Limit period',
            },
            limit: {
              type: 'number',
              multipleOf: 0.01,
              minimum: 0,
              description: 'Spending limit amount',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account limit creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account limit last update timestamp',
            },
          },
        },
        Recurrence: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Recurrence unique identifier',
            },
            frequency: {
              type: 'string',
              enum: ['daily', 'weekly', 'monthly', 'yearly'],
              description: 'Recurrence frequency',
            },
            interval: {
              type: 'integer',
              minimum: 1,
              description: 'Interval between recurrences',
            },
            nextOccurrenceDate: {
              type: 'string',
              format: 'date',
              description: 'Next occurrence date',
            },
            endDate: {
              type: 'string',
              format: 'date',
              nullable: true,
              description: 'End date for recurrence',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Recurrence creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Recurrence last update timestamp',
            },
          },
        },
        RefreshToken: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Refresh token unique identifier',
            },
            userId: {
              type: 'integer',
              description: 'User identifier',
            },
            token: {
              type: 'string',
              description: 'Refresh token value',
            },
            expires: {
              type: 'string',
              format: 'date-time',
              description: 'Token expiration timestamp',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Token creation timestamp',
            },
            revokedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Token revocation timestamp',
            },
            replacedByToken: {
              type: 'string',
              nullable: true,
              description: 'Token that replaced this one',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {},
              description: 'Array of items',
            },
            pagination: {
              type: 'object',
              properties: {
                total: {
                  type: 'integer',
                  description: 'Total number of items',
                },
                page: {
                  type: 'integer',
                  description: 'Current page number',
                },
                limit: {
                  type: 'integer',
                  description: 'Items per page',
                },
                totalPages: {
                  type: 'integer',
                  description: 'Total number of pages',
                },
              },
            },
          },
        },
        QueryParameters: {
          type: 'object',
          properties: {
            pageNumber: {
              type: 'integer',
              minimum: 1,
              default: 1,
              description: 'Page number for pagination',
            },
            pageSize: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 25,
              description: 'Number of items per page',
            },
            sortBy: {
              type: 'string',
              description: 'Field to sort by',
            },
            sortOrder: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'asc',
              description: 'Sort order',
            },
          },
        },
        UserQueryParameters: {
          allOf: [
            { $ref: '#/components/schemas/QueryParameters' },
            {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  description: 'Filter by user ID',
                },
                groupId: {
                  type: 'integer',
                  description: 'Filter by group ID',
                },
                email: {
                  type: 'string',
                  format: 'email',
                  description: 'Filter by email',
                },
                name: {
                  type: 'string',
                  description: 'Filter by name',
                },
                isActive: {
                  type: 'boolean',
                  description: 'Filter by active status',
                },
                sortBy: {
                  type: 'string',
                  enum: ['name', 'email', 'createdAt'],
                  description: 'Field to sort by',
                },
              },
            },
          ],
        },
        GroupQueryParameters: {
          allOf: [
            { $ref: '#/components/schemas/QueryParameters' },
            {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  description: 'Filter by group ID',
                },
                name: {
                  type: 'string',
                  description: 'Filter by group name',
                },
                sortBy: {
                  type: 'string',
                  enum: ['name', 'createdAt'],
                  description: 'Field to sort by',
                },
              },
            },
          ],
        },
        AccountQueryParameters: {
          allOf: [
            { $ref: '#/components/schemas/QueryParameters' },
            {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  description: 'Filter by account ID',
                },
                groupId: {
                  type: 'integer',
                  description: 'Filter by group ID',
                },
                name: {
                  type: 'string',
                  description: 'Filter by account name',
                },
                type: {
                  type: 'string',
                  description: 'Filter by account type',
                },
                sortBy: {
                  type: 'string',
                  enum: ['name', 'type', 'createdAt'],
                  description: 'Field to sort by',
                },
              },
            },
          ],
        },
        CategoryQueryParameters: {
          allOf: [
            { $ref: '#/components/schemas/QueryParameters' },
            {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  description: 'Filter by category ID',
                },
                groupId: {
                  type: 'integer',
                  description: 'Filter by group ID',
                },
                parentId: {
                  type: 'integer',
                  nullable: true,
                  description: 'Filter by parent category ID',
                },
                name: {
                  type: 'string',
                  description: 'Filter by category name',
                },
                sortBy: {
                  type: 'string',
                  enum: ['name', 'createdAt'],
                  description: 'Field to sort by',
                },
              },
            },
          ],
        },
        TransactionQueryParameters: {
          allOf: [
            { $ref: '#/components/schemas/QueryParameters' },
            {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  description: 'Filter by transaction ID',
                },
                groupId: {
                  type: 'integer',
                  description: 'Filter by group ID',
                },
                accountId: {
                  type: 'integer',
                  description: 'Filter by account ID',
                },
                categoryId: {
                  type: 'integer',
                  description: 'Filter by category ID',
                },
                createdByUserId: {
                  type: 'integer',
                  description: 'Filter by user who created the transaction',
                },
                note: {
                  type: 'string',
                  description: 'Search in transaction notes',
                },
                startDate: {
                  type: 'string',
                  format: 'date',
                  description: 'Filter transactions from this date',
                },
                endDate: {
                  type: 'string',
                  format: 'date',
                  description: 'Filter transactions until this date',
                },
                currency: {
                  type: 'string',
                  minLength: 3,
                  maxLength: 3,
                  description: 'Filter by currency code',
                },
                recurrenceId: {
                  type: 'integer',
                  description: 'Filter by recurrence ID',
                },
                sortBy: {
                  type: 'string',
                  enum: ['date', 'amount', 'createdAt'],
                  description: 'Field to sort by',
                },
              },
            },
          ],
        },
        AccountLimitQueryParameters: {
          allOf: [
            { $ref: '#/components/schemas/QueryParameters' },
            {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  description: 'Filter by account limit ID',
                },
                accountId: {
                  type: 'integer',
                  description: 'Filter by account ID',
                },
                period: {
                  type: 'string',
                  enum: ['month', 'week'],
                  description: 'Filter by period',
                },
                sortBy: {
                  type: 'string',
                  enum: ['period', 'limit', 'createdAt'],
                  description: 'Field to sort by',
                },
              },
            },
          ],
        },
        RecurrenceQueryParameters: {
          allOf: [
            { $ref: '#/components/schemas/QueryParameters' },
            {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  description: 'Filter by recurrence ID',
                },
                frequency: {
                  type: 'string',
                  enum: ['daily', 'weekly', 'monthly', 'yearly'],
                  description: 'Filter by frequency',
                },
                startDate: {
                  type: 'string',
                  format: 'date',
                  description: 'Filter recurrences starting from this date',
                },
                endDate: {
                  type: 'string',
                  format: 'date',
                  description: 'Filter recurrences ending before this date',
                },
                sortBy: {
                  type: 'string',
                  enum: ['frequency', 'interval', 'nextOccurrenceDate', 'createdAt'],
                  description: 'Field to sort by',
                },
              },
            },
          ],
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
