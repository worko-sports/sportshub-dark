import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sport: { type: String, required: true },
  city: { type: String, required: true },
  start: { type: String, required: true },
  type: { type: String, required: true },
  fee: { type: Number, required: true },
  prize: { type: String, required: true },
  banner: { type: String },
  org: { type: String, required: true },
  requirements: { type: String },
  qrCode: { type: String },
  whatsappLink: { type: String },
  customQuestions: [String],
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
