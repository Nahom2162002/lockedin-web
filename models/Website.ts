import mongoose, { Schema } from 'mongoose';

const websiteSchema = new Schema({
  userId:      { type: String, required: true },
  url:         { type: String, required: true },
  dateCreated: { type: Date },
  startTime:   { type: String },
  endTime:     { type: String },
  strictMode: { type: Boolean, default: null }
});

export default mongoose.models.Website || mongoose.model('Website', websiteSchema);