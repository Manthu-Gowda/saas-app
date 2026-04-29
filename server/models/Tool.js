import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    industryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Industry',
      required: true,
    },
    provider: {
      type: String,
      default: 'OpenAI GPT-4o',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    fields: [
      {
        name: String,
        label: String,
        type: { type: String, enum: ['text', 'textarea', 'number', 'select', 'file'] },
        required: { type: Boolean, default: false },
      }
    ]
  },
  {
    timestamps: true,
  }
);

const Tool = mongoose.model('Tool', toolSchema);
export default Tool;
