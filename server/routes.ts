import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertPolaroidSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission route
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate request body
      const contactData = insertContactSchema.parse(req.body);
      
      // Store contact submission
      const savedSubmission = await storage.createContactSubmission(contactData);
      
      res.status(201).json({
        message: "Contact submission received",
        data: savedSubmission,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: "Invalid contact form data", 
          errors: validationError.details
        });
      }
      
      console.error("Error processing contact form:", error);
      res.status(500).json({ message: "Server error processing contact form" });
    }
  });

  // Endpoint to get all contact submissions (for admin/demo purposes)
  app.get("/api/contact", async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.status(200).json(submissions);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationError.details
        });
      }
      
      console.error("Error retrieving contact submissions:", error);
      res.status(500).json({ message: "Server error retrieving contact submissions" });
    }
  });

  // Polaroid image routes
  // Create a new polaroid image
  app.post("/api/polaroids", async (req, res) => {
    try {
      // Validate request body
      const polaroidData = insertPolaroidSchema.parse(req.body);
      
      // Store polaroid image
      const savedImage = await storage.createPolaroidImage(polaroidData);
      
      res.status(201).json({
        message: "Polaroid image saved",
        data: savedImage,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: "Invalid polaroid image data", 
          errors: validationError.details
        });
      }
      
      console.error("Error saving polaroid image:", error);
      res.status(500).json({ message: "Server error saving polaroid image" });
    }
  });

  // Get all polaroid images
  app.get("/api/polaroids", async (req, res) => {
    try {
      const images = await storage.getAllPolaroidImages();
      res.status(200).json(images);
    } catch (error) {
      console.error("Error retrieving polaroid images:", error);
      res.status(500).json({ message: "Server error retrieving polaroid images" });
    }
  });

  // Get a specific polaroid image by ID
  app.get("/api/polaroids/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const image = await storage.getPolaroidImage(id);
      
      if (!image) {
        return res.status(404).json({ message: "Polaroid image not found" });
      }
      
      res.status(200).json(image);
    } catch (error) {
      console.error("Error retrieving polaroid image:", error);
      res.status(500).json({ message: "Server error retrieving polaroid image" });
    }
  });

  // Delete a polaroid image
  app.delete("/api/polaroids/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      // Check if the image exists
      const image = await storage.getPolaroidImage(id);
      
      if (!image) {
        return res.status(404).json({ message: "Polaroid image not found" });
      }
      
      // Delete the image
      await storage.deletePolaroidImage(id);
      
      res.status(200).json({ message: "Polaroid image deleted successfully" });
    } catch (error) {
      console.error("Error deleting polaroid image:", error);
      res.status(500).json({ message: "Server error deleting polaroid image" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
