import mongoose, { Schema } from 'mongoose';

const focusEventSchema = new Schema({
    userId:      { type: String, required: true },
    minutes:     { type: Number, required: true },
    date:        { type: String, required: true }, // user's local YYYY-MM-DD
    completedAt: { type: Date, default: Date.now }
});

focusEventSchema.index({ userId: 1, date: 1 });

export default mongoose.models.FocusEvent || mongoose.model('FocusEvent', focusEventSchema);
