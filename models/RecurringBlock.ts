import mongoose, { Schema } from 'mongoose';

const recurringBlockSchema = new Schema({
    userId: { type: String, required: true },
    url: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    days: { type: [Number], required: true },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    strictMode: { type: Boolean, default: null }
});

export default mongoose.models.RecurringBlock || mongoose.model('RecurringBlock', recurringBlockSchema);