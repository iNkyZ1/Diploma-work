import express from 'express';
import mongoose from 'mongoose';
import { protect } from '../middleware/auth.js';
import Booking from '../models/booking.js';
import Room from '../models/room.js';

const router = express.Router();

router.get('/', protect, async (req, res, next) => {
	try {
		const query = req.user?.isAdmin ? {} : { user: req.user.id };
		const bookings = await Booking.find(query)
			.sort({ createdAt: -1 })
			.populate('room', 'title slug price')
			.populate('user', 'name email');
		res.json(bookings);
	} catch (err) {
		next(err);
	}
});

router.post('/', protect, async (req, res, next) => {
	try {
		const { room, checkIn, checkOut, guests } = req.body || {};
		if (!room || !checkIn || !checkOut) {
			return res
				.status(400)
				.json({ message: 'room, checkIn и checkOut обязательны' });
		}

		const fromDate = new Date(checkIn);
		const toDate = new Date(checkOut);
		if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime()) || fromDate > toDate) {
			return res.status(400).json({ message: 'Неверные даты' });
		}

		const roomDoc = await Room.findById(room);
		if (!roomDoc) {
			return res.status(404).json({ message: 'Номер не найден' });
		}

		const conflict = await Booking.findOne({
			room: room,
			checkIn: { $lte: toDate },
			checkOut: { $gte: fromDate },
		});

		if (conflict) {
			return res
				.status(400)
				.json({ message: 'Этот номер уже забронирован на выбранные даты' });
		}

		const created = await Booking.create({
			user: req.user.id,
			room,
			checkIn: fromDate,
			checkOut: toDate,
			guests: guests || 1,
		});

		const populated = await Booking.findById(created._id)
			.populate('room', 'title slug price')
			.populate('user', 'name email');

		res.status(201).json(populated);
	} catch (err) {
		next(err);
	}
});

router.delete('/:id', protect, async (req, res, next) => {
	try {
		const id = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: 'Неверный id' });
		}

		const booking = await Booking.findById(id);
		if (!booking) return res.status(404).json({ message: 'Бронирование не найдено' });

		const isOwner = String(booking.user) === String(req.user.id);
		if (!req.user.isAdmin && !isOwner) {
			return res
				.status(403)
				.json({ message: 'Нет прав для удаления этого бронирования' });
		}

		await booking.deleteOne();
		return res.json({ message: 'Бронирование отменено' });
	} catch (err) {
		next(err);
	}
});

export default router;
