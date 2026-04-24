import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: ['create', 'update', 'delete'],
    },
    module: {
        type: String,
        required: true,
    },
    recordId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'module',
    },
    recordName: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    oldValues: {
        type: mongoose.Schema.Types.Mixed,
    },
    newValues: {
        type: mongoose.Schema.Types.Mixed,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 30,
    }
})

export default mongoose.model('AuditLog', auditLogSchema);