import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../services/prismaClient';
import { GeminiEngine, GenerateItineraryRequest } from '../services/geminiEngine';
import { BudgetValidator } from '../services/budgetValidator';
import { AuthenticatedRequest } from '../middleware/auth';

const itineraryGenerateSchema = z.object({
  startingPoint: z.string().min(1),
  destination: z.string().min(1),
  freeHours: z.coerce.number().min(0.5).max(48),
  totalBudget: z.coerce.number().min(50),
  startTime: z.string().optional(),
  purpose: z.string().optional().default('EXPLORATION'),
  transportPreference: z.enum(['METRO', 'AUTO', 'CAB', 'WALKING', 'BALANCED']).optional().default('BALANCED'),
  dietaryPreference: z.string().optional(),
  accessibilityNeeds: z.string().optional(),
  safetyPriority: z.enum(['HIGH', 'STANDARD']).optional().default('HIGH'),
  customNotes: z.string().optional(),
});

export class ItineraryController {
  public static async generate(req: AuthenticatedRequest, res: Response): Promise<void> {
    const input = itineraryGenerateSchema.parse(req.body);

    const generated = await GeminiEngine.generateItinerary(input as GenerateItineraryRequest);

    // Save generated itinerary to database
    let itineraryRecord = null;
    try {
      itineraryRecord = await prisma.itinerary.create({
        data: {
          userId: req.user?.id && !req.user.isGuest ? req.user.id : null,
          title: generated.title,
          city: generated.city,
          startingPoint: generated.startingPoint,
          destination: generated.destination,
          totalBudget: generated.totalBudget,
          estimatedCost: generated.estimatedCost,
          durationHours: generated.durationHours,
          purpose: generated.purpose,
          transportPreference: generated.transportPreference,
          isValidated: generated.validation.isValid,
          budgetVariance: generated.validation.varianceAmount,
          disclaimer: generated.disclaimer,
          stops: {
            create: generated.stops.map((stop, idx) => ({
              orderIndex: idx + 1,
              placeName: stop.placeName,
              category: stop.category,
              arrivalTime: stop.arrivalTime,
              departureTime: stop.departureTime,
              activityCost: stop.activityCost,
              transportCost: stop.transportCost,
              travelMethod: stop.travelMethod,
              safetyNote: stop.safetyNote,
              address: stop.address,
            })),
          },
        },
        include: { stops: true },
      });
    } catch {
      // If db write fails, return generated output directly
    }

    res.status(201).json({
      success: true,
      itineraryId: itineraryRecord?.id || 'temp-session',
      data: generated,
    });
  }

  public static async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const itinerary = await prisma.itinerary.findUnique({
      where: { id },
      include: { stops: { orderBy: { orderIndex: 'asc' } } },
    });

    if (!itinerary) {
      res.status(404).json({ success: false, message: 'Itinerary not found' });
      return;
    }

    res.json({
      success: true,
      data: itinerary,
    });
  }

  public static async validatePlan(req: Request, res: Response): Promise<void> {
    const { totalBudget, freeHours, stops } = req.body;
    if (!stops || !Array.isArray(stops)) {
      res.status(400).json({ success: false, message: 'Stops array is required.' });
      return;
    }

    const report = BudgetValidator.validate({
      totalBudget: Number(totalBudget) || 1000,
      freeHours: Number(freeHours) || 4,
      stops,
    });

    res.json({
      success: true,
      validation: report,
    });
  }
}
