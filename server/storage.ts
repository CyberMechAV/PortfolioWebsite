import { 
  users, 
  contactSubmissions, 
  polaroidImages,
  type User, 
  type InsertUser, 
  type ContactSubmission, 
  type InsertContact,
  type PolaroidImage,
  type InsertPolaroid
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact form operations
  createContactSubmission(data: InsertContact): Promise<ContactSubmission>;
  getContactSubmission(id: number): Promise<ContactSubmission | undefined>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  
  // Polaroid image operations
  createPolaroidImage(data: InsertPolaroid): Promise<PolaroidImage>;
  getPolaroidImage(id: number): Promise<PolaroidImage | undefined>;
  getAllPolaroidImages(): Promise<PolaroidImage[]>;
  deletePolaroidImage(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Contact form operations
  async createContactSubmission(data: InsertContact): Promise<ContactSubmission> {
    const [submission] = await db.insert(contactSubmissions).values(data).returning();
    return submission;
  }

  async getContactSubmission(id: number): Promise<ContactSubmission | undefined> {
    const [submission] = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id));
    return submission;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions);
  }
  
  // Polaroid image operations
  async createPolaroidImage(data: InsertPolaroid): Promise<PolaroidImage> {
    const [image] = await db.insert(polaroidImages).values(data).returning();
    return image;
  }
  
  async getPolaroidImage(id: number): Promise<PolaroidImage | undefined> {
    const [image] = await db.select().from(polaroidImages).where(eq(polaroidImages.id, id));
    return image;
  }
  
  async getAllPolaroidImages(): Promise<PolaroidImage[]> {
    return await db.select().from(polaroidImages);
  }
  
  async deletePolaroidImage(id: number): Promise<void> {
    await db.delete(polaroidImages).where(eq(polaroidImages.id, id));
  }
}

export const storage = new DatabaseStorage();
