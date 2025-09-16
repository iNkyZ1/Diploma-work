import express from 'express';
import Room from '../models/room.js';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/seed-rooms', async (req, res, next) => {
	try {
		const possiblePaths = [
			'../../frontend/src/data/rooms-data.js',
			'../../../frontend/src/data/rooms-data.js',
			'/app/frontend/src/data/rooms-data.js',
		];

		let rooms = [];
		for (const p of possiblePaths) {
			try {
				const mod = await import(p);
				rooms = mod.default || mod.rooms || mod.roomsData || [];
				if (rooms && rooms.length) {
					console.log('Imported rooms from', p);
					break;
				}
			} catch {
				// тихо пропускаем
			}
		}

		if (!rooms.length) {
			return res.status(400).json({
				message: 'Rooms data not found in frontend. Check path and export.',
			});
		}

		await Room.deleteMany({});
		const created = await Room.create(
			rooms.map((r) => ({
				title: r.name || r.title || 'Room',
				slug:
					r.slug ||
					(r.name
						? String(r.name).toLowerCase().replace(/\s+/g, '-')
						: undefined),
				description: r.description || r.desc || '',
				price: r.price || r.cost || 0,
				capacity: r.capacity || r.guests || 1,
				amenities: r.amenities || r.facilities || [],
				images: r.images
					? Array.isArray(r.images)
						? r.images
						: [r.images]
					: r.image
					? [r.image]
					: [],
				category: r.category || r.type || 'standard',
			})),
		);

		res.json({ message: 'Seed completed', seeded: created.length });
	} catch (err) {
		next(err);
	}
});

router.post('/create-admin', async (req, res, next) => {
	try {
		const { email, password } = req.body || {};
		if (!email || !password) {
			return res.status(400).json({ message: 'email и password обязательны' });
		}

		const existingAdmin = await User.findOne({ role: 'admin' });
		if (existingAdmin) {
			return res.status(400).json({
				message: 'Администратор уже существует. Второго создать нельзя.',
			});
		}

		const normalized = String(email).toLowerCase().trim();
		const existingUser = await User.findOne({ email: normalized });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: 'Пользователь с таким email уже существует' });
		}

		const passwordHash = await bcrypt.hash(password, 10);
		const user = await User.create({
			name: 'admin',
			email: normalized,
			passwordHash,
			role: 'admin',
		});

		res.json({
			message: 'Admin created',
			user: { id: user._id.toString(), email: user.email },
		});
	} catch (err) {
		next(err);
	}
});

router.post('/fix-room-categories', async (req, res, next) => {
	try {
		const defaultCategory = req.body?.defaultCategory || 'standard';
		const filter = { $or: [{ category: { $exists: false } }, { category: null }] };

		const update = { $set: { category: defaultCategory } };
		const result = await Room.updateMany(filter, update);

		res.json({
			message: 'Categories fixed',
			matched: result.matchedCount ?? result.n ?? 0,
			modified: result.modifiedCount ?? result.nModified ?? 0,
			setTo: defaultCategory,
		});
	} catch (err) {
		next(err);
	}
});

export default router;
