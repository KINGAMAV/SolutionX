import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import config from './config/index.js';
import routes from './routes/index.js';

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: config.CORS_ORIGIN,
    credentials: true,
  },
});

// Middleware
app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// ============================================================
// Socket.IO Events
// ============================================================

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Courier availability toggle
  socket.on('courier:available', (data) => {
    io.emit('courier:status-changed', {
      courierId: socket.id,
      status: data.isAvailable,
    });
  });

  // Location update
  socket.on('courier:location', (data) => {
    io.emit('delivery:location-updated', {
      courierId: socket.id,
      lat: data.lat,
      lng: data.lng,
      missionId: data.missionId,
    });
  });

  // Order created
  socket.on('order:created', (data) => {
    io.emit('order:created', data);
  });

  // Artisan request
  socket.on('artisan:request-created', (data) => {
    io.emit('artisan:request-created', data);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = config.PORT;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
