import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  name: { type: String, required: true },
  systemPrompt: { type: String, required: true },
  userPromptTemplate: { type: String, required: true },
  outputVariable: { type: String, required: true },
  aiProviderId: { type: mongoose.Schema.Types.ObjectId, ref: 'AiProvider', default: null },
}, { _id: false });

const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, enum: ['text', 'textarea', 'select'], default: 'text' },
  required: { type: Boolean, default: true },
  placeholder: { type: String, default: '' },
  options: [{ type: String }],
}, { _id: false });

const agentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '🤖' },
    industryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Industry', default: null },
    steps: [stepSchema],
    inputFields: [fieldSchema],
    planRequired: { type: String, enum: ['FREE', 'STARTER', 'PRO', 'BUSINESS'], default: 'FREE' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Agent = mongoose.model('Agent', agentSchema);
export default Agent;
