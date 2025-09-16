import express from 'express';
import { protect } from '../middleware/auth.js';
import Booking from '../models/booking.js';
import Room from '../models/room.js';
import User from '../models/user.js';

const router = express.Router();

router.get('/bookings', protect, async (req, res, next) => {
	try {
		if (!req.user || req.user.role !== 'admin') {
			return res.status(403).json({ message: 'Доступ запрещён' });
		}

		const bookings = await Booking.find({})
			.sort({ createdAt: -1 })
			.populate({
				path: 'room',
				select: 'title slug price category floor images',
			})
			.populate({
				path: 'user',
				select: 'name email role',
			})
			.lean();

		const items = bookings.map((b) => ({
			id: b._id?.toString?.(),
			user: b.user
				? {
						id: b.user._id?.toString?.(),
						name: b.user.name,
						email: b.user.email,
						role: b.user.role,
				  }
				: null,
			room: b.room
				? {
						id: b.room._id?.toString?.(),
						title: b.room.title || b.room.name,
						price: b.room.price,
						category: b.room.category,
						images: b.room.images || [],
				  }
				: null,
			from: b.from || b.startDate || b.checkIn || null,
			to: b.to || b.endDate || b.checkOut || null,
			guests: b.guests ?? b.people ?? 1,
			status: b.status || 'confirmed',
			createdAt: b.createdAt,
			raw: b,
		}));

		res.json({ items, total: items.length });
	} catch (err) {
		next(err);
	}
});

export default router;
