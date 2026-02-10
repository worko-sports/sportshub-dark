import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  transactionId: { type: String },
  paymentScreenshot: { type: String },
  answers: [{
    question: { type: String },
    answer: { type: String }
  }],
}, {
  timestamps: true,
});

export default mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);
