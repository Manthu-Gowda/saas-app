import mongoose from 'mongoose';

const aiProviderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    baseUrl: { type: String, default: '' },
    apiKeyEnc: { type: String, default: '' },
    defaultModel: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false },
    config: {
      maxTokens: { type: Number, default: 2000 },
      temperature: { type: Number, default: 0.7 },
    },
    pricing: {
      inputPer1M: { type: Number, default: 0 },
      outputPer1M: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const AiProvider = mongoose.model('AiProvider', aiProviderSchema);
export default AiProvider;
