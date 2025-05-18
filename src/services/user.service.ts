import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

import { db } from '../core/db/config.ts';
import { users, NewUser, User } from '../models/schema.ts';

export class UserService {
  /**
   * Create a new user
   */
  async createUser(userData: Omit<NewUser, 'createdAt' | 'updatedAt'>): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = {
      ...userData,
      password: hashedPassword,
    };

    const [user] = await db.insert(users).values(newUser).returning();
    return user;
  }

  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  /**
   * Find a user by ID
   */
  async findById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  /**
   * Validate user password
   */
  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
