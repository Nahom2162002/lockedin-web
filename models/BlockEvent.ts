import mongoose, { Schema } from 'mongoose';

const blockEventSchema = new Schema({
    userId: { type: String, required: true },
    url: { type: String, required: true },
    blockedAt: { type: Date, default: Date.now }
});

export default mongoose.models.BlockEvent || mongoose.model('BlockEvent', blockEventSchema);