import { Router, Response, NextFunction } from "express";
import * as adminService from "../services/admin.service";
import { requireAuth, requireRole, AuthRequest } from "../middleware/auth";

const router = Router();

// All admin routes require ADMIN role
router.use(requireAuth, requireRole("ADMIN"));

// GET /api/admin/stats
router.get("/stats", async (_req: AuthRequest, res: Response) => {
  const stats = await adminService.getPlatformStats();
  res.json({ success: true, data: stats });
});

// GET /api/admin/users
router.get("/users", async (req: AuthRequest, res: Response, next: NextFunction) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 20;
  const role = req.query.role as string | undefined;
  const search = req.query.search as string | undefined;
  const result = await adminService.listUsers(page, pageSize, role, search);
  res.json({ success: true, data: result });
});

// PATCH /api/admin/users/:id/role
router.patch("/users/:id/role", async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { role } = req.body;
  if (!role) {
    return res.status(400).json({ success: false, message: "role is required" });
  }
  const user = await adminService.updateUserRole(req.params.id, req.userId!, role);
  res.json({ success: true, data: user });
});

// GET /api/admin/events
router.get("/events", async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 20;
  const status = req.query.status as string | undefined;
  const result = await adminService.listAllEvents(page, pageSize, status);
  res.json({ success: true, data: result });
});

export default router;
