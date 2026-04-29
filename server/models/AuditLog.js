import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    targetType: { type: String, default: '' },
    targetId: { type: String, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: '' },
  },
  { timestamps: true }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
