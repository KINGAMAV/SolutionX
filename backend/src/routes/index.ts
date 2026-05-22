import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import {
  authController,
  residentController,
  shopController,
  courseController,
} from '../controllers/index.js';

const router = Router();

// ============================================================
// Auth Routes
// ============================================================
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.get('/auth/me', authMiddleware, authController.me);

// ============================================================
// Resident Routes
// ============================================================
router.get('/resident/dashboard', authMiddleware, requireRole(['resident']), residentController.dashboard);
router.get('/resident/orders', authMiddleware, requireRole(['resident']), residentController.getOrders);
router.post('/resident/orders', authMiddleware, requireRole(['resident']), residentController.createOrder);
router.get('/resident/artisans', authMiddleware, requireRole(['resident']), residentController.getArtisans);
router.post('/resident/artisans/request', authMiddleware, requireRole(['resident']), residentController.requestArtisan);
router.get('/resident/profile', authMiddleware, requireRole(['resident']), residentController.getProfile);
router.put('/resident/profile', authMiddleware, requireRole(['resident']), residentController.updateProfile);

// ============================================================
// Shop Routes
// ============================================================
router.get('/shop/products/:shopId', shopController.getProducts);
router.get('/shop/orders', authMiddleware, requireRole(['shop']), shopController.getOrders);

// ============================================================
// Courier Routes
// ============================================================
router.get('/courier/missions', authMiddleware, requireRole(['courier']), courseController.getAvailableCourses);
router.post('/courier/missions/:missionId/accept', authMiddleware, requireRole(['courier']), courseController.acceptMission);
router.post('/courier/location', authMiddleware, requireRole(['courier']), courseController.updateLocation);

export default router;
