import { Router, Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { requireAuth, AuthRequest } from "../middleware/auth";
import {
  RegisterSchema,
  LoginSchema,
  RefreshTokenSchema,
} from "@hudhuria/shared";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }
  const result = await authService.register(parsed.data);
  res.status(201).json({ success: true, data: result });
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }
  const result = await authService.login(parsed.data);
  res.json({ success: true, data: result });
});

// POST /api/auth/refresh
router.post("/refresh", async (req: Request, res: Response, next: NextFunction) => {
  const parsed = RefreshTokenSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: "Validation error", errors: parsed.error.flatten() });
  }
  const result = await authService.refresh(parsed.data.refreshToken);
  res.json({ success: true, data: result });
});

// POST /api/auth/logout
router.post("/logout", requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ success: false, message: "refreshToken is required" });
  }
  await authService.logout(refreshToken);
  res.json({ success: true });
});

export default router;
