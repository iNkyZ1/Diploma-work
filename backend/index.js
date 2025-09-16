import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';
import seedOnStart from './config/seedOnStart.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const USE_MEMORY_DB =
	String(process.env.USE_MEMORY_DB || 'false').toLowerCase() === 'true';

async function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectExternalMongoWithRetry(uri, attempts = 10, delayMs = 3000) {
	let lastErr;
	for (let i = 1; i <= attempts; i++) {
		try {
			await mongoose.connect(uri);
			console.log(`✅ Connected to external MongoDB: ${uri}`);
			return true;
		} catch (err) {
			lastErr = err;
			console.warn(
				`⚠️ [${i}/${attempts}] Cannot connect to external MongoDB: ${err.message}`,
			);
			if (i < attempts) {
				console.log(`⏳ Retrying in ${Math.round(delayMs / 1000)}s...`);
				await sleep(delayMs);
			}
		}
	}
	console.error(`❌ All attempts to connect to external MongoDB failed.`);
	if (lastErr) console.error(lastErr);
	return false;
}

async function connectDB() {
	if (await connectExternalMongoWithRetry(MONGO_URI)) {
		return;
	}

	if (!USE_MEMORY_DB) {
		console.error(
			'❌ USE_MEMORY_DB is false, refusing to start with in-memory MongoDB.',
		);
		process.exit(1);
	}

	const { MongoMemoryServer } = await import('mongodb-memory-server');
	console.log(`✅ Starting in-memory MongoDB (fallback)...`);
	const mongoServer = await MongoMemoryServer.create();
	const uri = mongoServer.getUri();
	await mongoose.connect(uri);
	console.log(`✅ Connected to in-memory MongoDB (fallback)`);
}

async function startServer() {
	await connectDB();

	if (process.env.ENABLE_SEED === 'true') {
		try {
			const createdCount = await seedOnStart();
			console.log(`✅ Seed completed on start. Rooms created: ${createdCount}`);
		} catch (err) {
			console.error(`❌ Seed on start failed:`, err);
		}
	}

	app.listen(PORT, () => {
		console.log(`🚀 Server running on http://localhost:${PORT}`);
	});
}

startServer();
