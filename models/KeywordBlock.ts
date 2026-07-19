import mongoose, { Schema } from 'mongoose';

const keywordBlockSchema = new Schema({
    userId:    { type: String, required: true },
    keyword:   { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

keywordBlockSchema.index({ userId: 1 });

export default mongoose.models.KeywordBlock || mongoose.model('KeywordBlock', keywordBlockSchema);