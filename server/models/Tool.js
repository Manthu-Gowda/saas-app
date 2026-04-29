import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
  name: String,
  label: String,
  type: { type: String, enum: ['text', 'textarea', 'number', 'select', 'file'] },
  required: { type: Boolean, default: false },
  placeholder: String,
  options: [String],
}, { _id: false });

const toolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    icon: { type: String, default: '🤖' },
    industryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Industry', required: true },
    systemPrompt: { type: String, default: '' },
    userPromptTemplate: { type: String, default: '' },
    fields: [fieldSchema],
    planRequired: { type: String, enum: ['FREE', 'STARTER', 'PRO', 'BUSINESS'], default: 'FREE' },
    outputFormat: { type: String, enum: ['text', 'markdown', 'json'], default: 'markdown' },
    tokensPerRun: { type: Number, default: 2000 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    sortOrder: { type: Number, default: 0 },
    aiProviderId: { type: mongoose.Schema.Types.ObjectId, ref: 'AiProvider', default: null },
    // Legacy field kept for backwards compatibility
    provider: { type: String, default: '' },
  },
  { timestamps: true }
);

const Tool = mongoose.model('Tool', toolSchema);
export default Tool;
