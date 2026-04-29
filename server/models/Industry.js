import mongoose from 'mongoose';

const industrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String, default: '🏢' },
    description: { type: String },
    color: { type: String, default: '#6c47ff' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Industry = mongoose.model('Industry', industrySchema);
export default Industry;
