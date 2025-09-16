import express from 'express';
import { protect } from '../middleware/auth.js';
import Review from '../models/review.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const reviews = await Review.find().populate('user', 'name email');
		res.json(reviews);
	} catch (err) {
		console.error('Ошибка получения отзывов:', err);
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

router.post('/', protect, async (req, res) => {
	try {
		const { text, rating } = req.body || {};

		if (!text || !String(text).trim()) {
			return res.status(400).json({ message: 'Текст отзыва обязателен' });
		}

		let r = Number(rating);
		if (Number.isNaN(r)) {
			r = undefined;
		} else {
			if (r < 1) r = 1;
			if (r > 5) r = 5;
		}

		const reviewData = {
			user: req.user.id,
			text: String(text).trim(),
		};
		if (typeof r === 'number') reviewData.rating = r;

		const created = await Review.create(reviewData);
		const populated = await Review.findById(created._id).populate(
			'user',
			'name email',
		);

		res.status(201).json(populated);
	} catch (err) {
		console.error('Ошибка создания отзыва:', err);
		if (err && err.name === 'ValidationError') {
			return res.status(400).json({ message: err.message });
		}
		res.status(500).json({ message: 'Ошибка сервера' });
	}
});

router.delete('/:id', protect, async (req, res) => {
	try {
		const id = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: 'Неверный id' });
		}

		const review = await Review.findById(id);
		if (!review) return res.status(404).json({ message: 'Отзыв не найден' });

		if (req.user.role !== 'admin' && String(review.user) !== req.user.id) {
			return res.status(403).json({ message: 'Можно удалять только свои отзывы' });
		}

		await review.deleteOne();
		return res.json({ message: 'Отзыв удалён' });
	} catch (err) {
		console.error('Ошибка удаления отзыва:', err);
		return res.status(500).json({ message: 'Ошибка сервера' });
	}
});

export default router;
