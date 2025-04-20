import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
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

  const httpServer = createServer(app);
  return httpServer;
}
