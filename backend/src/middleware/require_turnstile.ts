import type { Request, Response, NextFunction } from "express";
import { verifyTurnstile } from "../utils/turnstile_helper";

export async function requireTurnstile(req: Request, res: Response, next: NextFunction) {
  const token = req.body?.turnstileToken;

  if (!token) {
    return res.status(400).json({ error: "Missing Turnstile token" });
  }

  try {
    const result = await verifyTurnstile(token, req.ip);

    if (!result.success) {
      return res.status(403).json({
        error: "Bot verification failed",
        codes: result["error-codes"] ?? [],
      });
    }

    
    next();
  } catch (e) {
    return res.status(500).json({ error: "Turnstile verification error" });
  }
}
