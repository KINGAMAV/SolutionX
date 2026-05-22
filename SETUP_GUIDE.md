# SolutionX - Complete Setup Guide

## 📋 Architecture Overview

```
├── Frontend (React + Vite)
│   └── Connected to Supabase Auth & API
├── Backend (Node.js + Express + Socket.io)
│   └── PostgreSQL (Supabase or local)
└── Database Schema (Prisma + PostgreSQL)
```

---

## 🚀 Step 1: Setup Supabase Database

### Option A: Use Existing Supabase (Recommended)

1. Go to your Supabase project dashboard
2. Open SQL Editor → New Query
3. Copy the entire content from `supabase_schema.sql`
4. Paste into the editor and execute
5. Verify all tables are created in the Database section

**Your Supabase connection string should be:**
```
postgresql://postgres.xxxxx:password@db.supabase.co:5432/postgres
```

### Option B: Local PostgreSQL with Docker

```bash
docker compose up postgres
```

This will:
- Start PostgreSQL on `localhost:5432`
- Create database `solutionx`
- Initialize all tables via Prisma migration

---

## 🔧 Step 2: Setup Backend

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL running (either Supabase or local)

### Installation

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

### .env Configuration

```env
# Supabase Option
DATABASE_URL="postgresql://postgres.xxxxx:password@db.supabase.co:5432/postgres?schema=public"

# OR Local Option
DATABASE_URL="postgresql://postgres:password@localhost:5432/solutionx"

# JWT Secret (generate a random string in production)
JWT_SECRET="your-super-secret-key-min-32-chars"

# Supabase credentials (from project settings)
SUPABASE_URL="https://xxxxx.supabase.co"
SUPABASE_KEY="your-anon-key"

# Frontend URL for CORS
CORS_ORIGIN="http://localhost:3000"
```

### Start Backend

```bash
# Development mode (with hot reload)
npm run dev

# Output should show:
# 🚀 Server running on http://localhost:5000
# 📊 Health check: http://localhost:5000/health
```

Test health check:
```bash
curl http://localhost:5000/health
# Should return: {"status":"OK","timestamp":"..."}
```

---

## 🎨 Step 3: Update Frontend

### 1. Create API client

Create `src/lib/api.ts`:
```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string) => {
  apiClient.defaults.headers.Authorization = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  delete apiClient.defaults.headers.Authorization;
};
```

### 2. Update `.env.local`

```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Update `AppContext.tsx` to use Backend API

Replace auth calls to use backend instead of Supabase directly:

```typescript
// Login
const response = await apiClient.post('/auth/login', {
  email: formData.email,
  password: formData.password,
});
const { user, token } = response.data;
setAuthToken(token);
```

### 4. Install axios

```bash
npm install axios
```

---

## 📱 Step 4: Test Full Flow

### Test 1: Create a House

```bash
curl -X POST http://localhost:5000/api/admin/houses \
  -H "Content-Type: application/json" \
  -d '{"houseNumber":"001","block":"A"}'
```

### Test 2: Signup as Resident

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"resident@test.com",
    "password":"password123",
    "name":"Jean-Marc",
    "houseNumber":"001",
    "role":"resident"
  }'

# Response: {"user":{...},"token":"eyJ..."}
```

### Test 3: Get Resident Dashboard

```bash
curl -X GET http://localhost:5000/api/resident/dashboard \
  -H "Authorization: Bearer eyJ..."
```

### Test 4: Signup as Shop

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"shop@test.com",
    "password":"password123",
    "name":"Market ABC",
    "role":"shop"
  }'
```

---

## 🔗 Step 5: Connect Frontend + Backend

### Update `LoginScreen.tsx`

Replace the Supabase auth with backend API:

```typescript
import { apiClient, setAuthToken } from '../lib/api';

const handleSubmit = async () => {
  setError('');
  setLoading(true);

  try {
    if (mode === 'login') {
      const response = await apiClient.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      
      const { user, token } = response.data;
      setAuthToken(token);
      dispatch({ type: 'SET_USER', payload: user });
      navigate('/');
    } else {
      const response = await apiClient.post('/auth/signup', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        houseNumber: formData.houseNumber,
        role: 'resident',
      });

      const { user, token } = response.data;
      setAuthToken(token);
      dispatch({ type: 'SET_USER', payload: user });
      navigate('/');
    }
  } catch (err: any) {
    setError(err.response?.data?.error || 'An error occurred');
  } finally {
    setLoading(false);
  }
};
```

### Update `ProfileScreen.tsx`

```typescript
const handleLogout = async () => {
  await apiClient.post('/auth/logout');
  clearAuthToken();
  dispatch({ type: 'SET_USER', payload: null });
  navigate('/login');
};
```

---

## 🎯 Step 6: Implement Core Features

### Courses (Orders)

**Frontend** (`GroceryScreen.tsx`):
```typescript
const handleCheckout = async () => {
  try {
    const response = await apiClient.post('/resident/orders', {
      shopId: selectedShop.id,
      items: state.cart,
      deliveryType: 'day',
    });
    navigate('/orders/' + response.data.id);
  } catch (err) {
    console.error(err);
  }
};
```

**Backend** - Already implemented in `controllers/index.ts`

### Artisans

**Frontend** (`ArtisanProfileScreen.tsx`):
```typescript
const handleBooking = async () => {
  try {
    const response = await apiClient.post('/resident/artisans/request', {
      artisanId: artisan.id,
      requestedDate: selectedDate,
      requestedTimeSlot: selectedTime,
      description: description,
    });
    navigate('/services/artisans');
  } catch (err) {
    console.error(err);
  }
};
```

### Real-time Updates via WebSocket

Create `src/lib/websocket.ts`:
```typescript
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL);

export const websocket = {
  on: socket.on.bind(socket),
  emit: socket.emit.bind(socket),
  off: socket.off.bind(socket),
};
```

---

## 📦 Step 7: Database Seeding (Optional)

Create initial data:

```typescript
// backend/src/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  // Create houses
  const house1 = await prisma.house.create({
    data: { houseNumber: '001', block: 'A' },
  });

  // Create delivery rates
  await prisma.deliveryRate.createMany({
    data: [
      { timeSlot: 'day', baseFee: 500, distanceRatePerKm: 50 },
      { timeSlot: 'evening', baseFee: 500, distanceRatePerKm: 50, surgePct: 15 },
      { timeSlot: 'night', baseFee: 500, distanceRatePerKm: 50, surgePct: 50 },
    ],
  });

  console.log('✅ Seeding complete');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
```

Run:
```bash
cd backend
npx ts-node src/seed.ts
```

---

## 🚢 Step 8: Deployment Checklist

- [ ] Update `.env` with production URLs
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Enable HTTPS on production
- [ ] Setup database backups
- [ ] Configure CORS properly
- [ ] Add rate limiting to endpoints
- [ ] Setup error logging (Sentry, etc.)
- [ ] Add monitoring & alerts
- [ ] Create CI/CD pipeline

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Check database connection
npm run prisma:studio

# Check logs
npm run dev
```

### Frontend can't connect to backend
- Verify backend is running on http://localhost:5000
- Check CORS_ORIGIN in backend .env
- Check VITE_API_URL in frontend .env.local
- Clear browser cache and restart dev server

### Database migration errors
```bash
# Reset database (CAREFUL - deletes data)
npm run prisma:migrate reset

# Or manually fix
npm run prisma:migrate dev --name fix_schema
```

---

## 📚 API Documentation

Full API endpoints in `backend/src/routes/index.ts`

### Key Routes

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | `/auth/signup` | ❌ | - |
| POST | `/auth/login` | ❌ | - |
| GET | `/auth/me` | ✅ | all |
| GET | `/resident/dashboard` | ✅ | resident |
| GET | `/resident/orders` | ✅ | resident |
| POST | `/resident/orders` | ✅ | resident |
| GET | `/resident/artisans` | ✅ | resident |
| POST | `/resident/artisans/request` | ✅ | resident |
| GET | `/shop/orders` | ✅ | shop |
| GET | `/courier/missions` | ✅ | courier |

---

## ✅ What's Ready

- ✅ Complete database schema
- ✅ Backend API scaffold
- ✅ Authentication (JWT)
- ✅ Core CRUD operations
- ✅ Real-time WebSocket setup
- ✅ Role-based access control

## ⏳ What's Next

- Implement payment integration
- Add file uploads for artisan documents
- Complete notification system
- Add dispute resolution workflow
- Mobile app with Capacitor
- Admin dashboard
- Analytics & reporting

---

## 🔗 Quick Links

- [Supabase Docs](https://supabase.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Express Docs](https://expressjs.com)
- [Socket.io Docs](https://socket.io/docs)

---

## 📞 Support

For issues or questions, check logs first:

```bash
# Backend logs
npm run dev

# Database
npm run prisma:studio

# Network
curl http://localhost:5000/health
```

Good luck! 🚀
