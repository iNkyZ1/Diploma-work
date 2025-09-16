import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import roomsRoutes from './routes/rooms.js';
import bookingRoutes from './routes/bookings.js';
import usersRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';
import reviewsRoutes from './routes/reviews.js';

const app = express();
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(
	cors({
		origin: CLIENT_URL,
		credentials: true,
	}),
);

app.use(express.json());
app.use(morgan('dev'));

app.get('/api/ping', (req, res) => res.json({ message: 'pong' }));
app.get('/', (req, res) => {
	res.send('Backend for Отель "Жемчужина Байкала" — API at /api/*');
});

app.use('/api', authRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewsRoutes);

const enableSeed =
	typeof process.env.ENABLE_SEED !== 'undefined' &&
	String(process.env.ENABLE_SEED).trim().toLowerCase() === 'true';

if (enableSeed) {
	import('./routes/dev.js')
		.then((mod) => {
			const devRoutes = mod.default || mod;
			app.use('/api/dev', devRoutes);
			console.log('⚙️ Dev routes enabled at /api/dev');
		})
		.catch((err) => {
			console.warn('⚠️ Could not load dev routes:', err?.message || err);
		});
} else {
	console.log('ℹ️ Dev routes disabled (ENABLE_SEED !== "true")');
}

app.use('*', (req, res) => {
	res.status(404).json({
		message: 'Route not found',
		path: req.originalUrl,
	});
});

app.use((err, req, res, next) => {
	console.error('Global error handler:', err);
	const errorResponse = {
		message: err.message || 'Internal server error',
		...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
	};
	res.status(err.status || 500).json(errorResponse);
});

export default app;
