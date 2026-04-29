import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatarUrl: { type: String, default: '' },
    role: { type: String, enum: ['CUSTOMER', 'ADMIN'], default: 'CUSTOMER' },
    planTier: { type: String, enum: ['FREE', 'STARTER', 'PRO', 'BUSINESS'], default: 'FREE' },
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
    industryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Industry', default: null },
    runsTotal: { type: Number, default: 10 },
    runsUsed: { type: Number, default: 0 },
    bonusRuns: { type: Number, default: 0 },
    stripeCustomerId: { type: String, default: '' },
    lastRunResetAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
