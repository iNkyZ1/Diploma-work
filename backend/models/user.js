import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		name: { type: String, trim: true },
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		passwordHash: { type: String, required: true },
		role: { type: String, enum: ['guest', 'admin'], default: 'guest' },
	},
	{ timestamps: true },
);

userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model('User', userSchema);
