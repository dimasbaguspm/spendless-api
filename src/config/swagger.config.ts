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
        name: 'Categories',
        description: 'Income and expense category management',
      },
      {
        name: 'Transactions',
        description: 'Transaction recording and management',
      },
      {
        name: 'Account Limits',
        description: 'Spending limits and budget controls',
      },
      {
        name: 'Summary',
        description: 'Financial summaries and reporting',
      },
      {
        name: 'Health',
        description: 'API health check endpoints',
      },
      {
        name: 'Documentation',
        description: 'API documentation endpoints',
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
              type: 'string',
              description: 'User unique identifier',
            },
            name: {
              type: 'string',
              description: 'User full name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            groupId: {
              type: 'string',
              description: 'Group identifier the user belongs to',
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
              type: 'string',
              description: 'Group unique identifier',
            },
            name: {
              type: 'string',
              description: 'Group name',
            },
            description: {
              type: 'string',
              description: 'Group description',
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
              type: 'string',
              description: 'Account unique identifier',
            },
            name: {
              type: 'string',
              description: 'Account name',
            },
            type: {
              type: 'string',
              enum: ['savings', 'checking', 'credit', 'cash'],
              description: 'Account type',
            },
            balance: {
              type: 'number',
              format: 'decimal',
              description: 'Current account balance',
            },
            groupId: {
              type: 'string',
              description: 'Group identifier the account belongs to',
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
              type: 'string',
              description: 'Category unique identifier',
            },
            name: {
              type: 'string',
              description: 'Category name',
            },
            type: {
              type: 'string',
              enum: ['income', 'expense'],
              description: 'Category type',
            },
            groupId: {
              type: 'string',
              description: 'Group identifier the category belongs to',
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
              type: 'string',
              description: 'Transaction unique identifier',
            },
            description: {
              type: 'string',
              description: 'Transaction description',
            },
            amount: {
              type: 'number',
              format: 'decimal',
              description: 'Transaction amount',
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Transaction date',
            },
            accountId: {
              type: 'string',
              description: 'Account identifier',
            },
            categoryId: {
              type: 'string',
              description: 'Category identifier',
            },
            groupId: {
              type: 'string',
              description: 'Group identifier',
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
