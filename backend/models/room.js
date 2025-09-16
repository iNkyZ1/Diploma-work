import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		slug: { type: String, unique: true, sparse: true },
		description: String,
		price: { type: Number, default: 0 },
		capacity: { type: Number, default: 1 },
		amenities: [String],
		images: [String],
		category: {
			type: String,
			enum: ['standard', 'comfort', 'luxury'],
			default: 'standard',
		},
	},
	{ timestamps: true },
);

export default mongoose.model('Room', roomSchema);
