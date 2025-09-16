import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
	console.error(
		'❌ JWT_SECRET не задан в окружении! Защищённые маршруты не смогут работать.\n' +
			'Установите переменную окружения JWT_SECRET в файле .env или в конфигурации контейнера.',
	);
}

export const protect = async (req, res, next) => {
	try {
		if (!JWT_SECRET) {
			return res
				.status(500)
				.json({ message: 'Server misconfiguration: JWT secret is missing' });
		}

		const auth = req.headers?.authorization;
		if (!auth || !auth.startsWith('Bearer ')) {
			return res.status(401).json({
				message:
					'Unauthorized: token missing. Provide header "Authorization: Bearer <token>"',
			});
		}

		const token = auth.split(' ')[1];
		if (!token) {
			return res.status(401).json({ message: 'Unauthorized: token missing' });
		}

		let payload;
		try {
			payload = jwt.verify(token, JWT_SECRET);
		} catch (err) {
			console.warn('Invalid JWT token:', err?.message || err);
			return res.status(401).json({ message: 'Invalid token' });
		}

		const user = await User.findById(payload.id).select('-passwordHash -__v');
		if (!user) return res.status(401).json({ message: 'User not found' });

		const u = user.toObject ? user.toObject() : user;
		req.user = {
			id: String(u._id),
			name: u.name,
			email: u.email,
			role: u.role || 'guest',
			isAdmin: String(u.role).toLowerCase() === 'admin',
			createdAt: u.createdAt,
			updatedAt: u.updatedAt,
		};

		next();
	} catch (err) {
		console.error('Auth middleware error:', err);
		return res.status(500).json({ message: 'Auth error' });
	}
};

export const isAdmin = (req, res, next) => {
	if (!req.user) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
	if (!req.user.isAdmin) {
		return res.status(403).json({ message: 'Admin only' });
	}
	next();
};
