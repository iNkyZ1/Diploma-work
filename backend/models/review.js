import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		text: { type: String, required: true },
		rating: { type: Number, min: 1, max: 5, default: 5 },
	},
	{ timestamps: true },
);

export default mongoose.model('Review', reviewSchema);
