import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const prisma = new PrismaClient();

export const authController = {
  async signup(req: Request, res: Response) {
    try {
      const { email, password, name, houseNumber, role = 'resident' } = req.body;

      // In production, hash password with bcrypt
      // For now, storing plain (INSECURE - for demo only)
      const user = await prisma.user.create({
        data: {
          email,
          name,
          role,
          isActive: true,
        },
      });

      // If resident, create resident record and link to house
      if (role === 'resident' && houseNumber) {
        const house = await prisma.house.findUnique({
          where: { houseNumber },
        });

        if (!house) {
          return res.status(400).json({ error: 'House not found' });
        }

        await prisma.resident.create({
          data: {
            userId: user.id,
            houseId: house.id,
          },
        });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRY }
      );

      res.json({ user, token });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRY }
      );

      res.json({ user, token });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async me(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
      });

      res.json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },
};

export const residentController = {
  async dashboard(req: Request, res: Response) {
    try {
      const resident = await prisma.resident.findUnique({
        where: { userId: req.userId },
        include: {
          orders: {
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      res.json(resident);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async getOrders(req: Request, res: Response) {
    try {
      const resident = await prisma.resident.findUnique({
        where: { userId: req.userId },
      });

      if (!resident) {
        return res.status(404).json({ error: 'Resident not found' });
      }

      const orders = await prisma.order.findMany({
        where: { residentId: resident.id },
        include: { items: true, mission: true },
        orderBy: { createdAt: 'desc' },
      });

      res.json(orders);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async createOrder(req: Request, res: Response) {
    try {
      const { shopId, items, deliveryType = 'day' } = req.body;

      const resident = await prisma.resident.findUnique({
        where: { userId: req.userId },
      });

      if (!resident) {
        return res.status(404).json({ error: 'Resident not found' });
      }

      // Calculate total
      let totalAmount = 0;
      items.forEach((item: any) => {
        totalAmount += item.price * item.quantity;
      });

      // Get delivery rate
      const rate = await prisma.deliveryRate.findFirst({
        where: { timeSlot: deliveryType },
      });

      const deliveryFee = rate ? rate.baseFee.toNumber() : 500;

      const order = await prisma.order.create({
        data: {
          residentId: resident.id,
          houseId: resident.houseId,
          shopId,
          type: 'grocery',
          status: 'confirmed',
          totalAmount,
          deliveryFee,
          deliveryType,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      res.json(order);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async getArtisans(req: Request, res: Response) {
    try {
      const artisans = await prisma.artisanProfile.findMany({
        where: { status: 'validated', isActive: true },
        include: { user: true },
      });

      res.json(artisans);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async requestArtisan(req: Request, res: Response) {
    try {
      const { artisanId, requestedDate, requestedTimeSlot, description } = req.body;

      const resident = await prisma.resident.findUnique({
        where: { userId: req.userId },
      });

      if (!resident) {
        return res.status(404).json({ error: 'Resident not found' });
      }

      const request = await prisma.artisanRequest.create({
        data: {
          residentId: resident.id,
          artisanId,
          requestedDate: new Date(requestedDate),
          requestedTimeSlot,
          description,
        },
      });

      res.json(request);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async getProfile(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        include: {
          resident: {
            include: { house: true },
          },
        },
      });

      res.json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      const { name, avatarUrl } = req.body;

      const user = await prisma.user.update({
        where: { id: req.userId },
        data: {
          name: name || undefined,
          avatarUrl: avatarUrl || undefined,
        },
      });

      res.json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },
};

export const shopController = {
  async getProducts(req: Request, res: Response) {
    try {
      const { shopId } = req.params;

      const products = await prisma.product.findMany({
        where: { shopId, isActive: true },
      });

      res.json(products);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async getOrders(req: Request, res: Response) {
    try {
      const shop = await prisma.shop.findUnique({
        where: { userId: req.userId },
      });

      if (!shop) {
        return res.status(404).json({ error: 'Shop not found' });
      }

      const orders = await prisma.order.findMany({
        where: { shopId: shop.id },
        include: { items: true, resident: { include: { house: true } } },
        orderBy: { createdAt: 'desc' },
      });

      res.json(orders);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },
};

export const courseController = {
  async getAvailableCourses(req: Request, res: Response) {
    try {
      const courses = await prisma.order.findMany({
        where: {
          type: 'delivery',
          status: 'confirmed',
          assignedCourierId: null,
        },
        include: {
          resident: { include: { house: true } },
          mission: true,
        },
      });

      res.json(courses);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async acceptMission(req: Request, res: Response) {
    try {
      const { missionId } = req.params;

      const courier = await prisma.courier.findUnique({
        where: { userId: req.userId },
      });

      if (!courier) {
        return res.status(404).json({ error: 'Courier not found' });
      }

      const mission = await prisma.deliveryMission.update({
        where: { id: missionId },
        data: {
          courierId: courier.id,
          status: 'accepted',
        },
      });

      await prisma.order.update({
        where: { id: mission.orderId },
        data: { assignedCourierId: courier.id, status: 'preparing' },
      });

      res.json(mission);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },

  async updateLocation(req: Request, res: Response) {
    try {
      const { lat, lng } = req.body;

      const courier = await prisma.courier.update({
        where: { userId: req.userId },
        data: {
          locationLat: lat,
          locationLng: lng,
          lastSeen: new Date(),
        },
      });

      res.json(courier);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },
};
