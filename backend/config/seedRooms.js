import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import Room from '../models/room.js';

if (!process.env.ENABLE_SEED || process.env.ENABLE_SEED !== 'true') {
	console.log('Seed disabled. Set ENABLE_SEED=true in .env to seed rooms.');
	process.exit(0);
}

async function seedRooms() {
	const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/baikal_hotel';
	await mongoose.connect(mongoUri);
	console.log('✅ Connected to MongoDB for seeding');

	let rooms = [];
	try {
		const mod = await import('../data/rooms.js');
		rooms = mod.default || mod.roomsData || [];
	} catch (err) {
		console.error('❌ Failed to import rooms data:', err.message);
		process.exit(1);
	}

	if (!rooms.length) {
		console.warn('❌ No rooms data found. Check backend/data/rooms.js');
		process.exit(1);
	}

	await Room.deleteMany({});
	const created = await Room.create(
		rooms.map((r) => ({
			title: r.name || r.title || 'Room',
			slug:
				r.slug ||
				(r.name ? String(r.name).toLowerCase().replace(/\s+/g, '-') : undefined),
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
		})),
	);

	console.log(`✅ Seed completed. Rooms created: ${created.length}`);
	await mongoose.disconnect();
	process.exit(0);
}

seedRooms().catch((err) => {
	console.error('❌ Seed error:', err);
	process.exit(1);
});
