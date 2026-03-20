import { Schema, model, Document } from 'mongoose';

export interface ISystemLog extends Document {
    agentName: string;
    toolName: string;
    arguments: any;
    timestamp: Date;
    status: 'SUCCESS' | 'ERROR';
    response?: any;
    error?: string;
}

const systemLogSchema = new Schema<ISystemLog>({
    agentName: {
        type: String,
        required: true,
    },
    toolName: {
        type: String,
        required: true,
    },
    arguments: {
        type: Schema.Types.Mixed,
    },
    status: {
        type: String,
        enum: ['SUCCESS', 'ERROR'],
        required: true,
    },
    response: {
        type: Schema.Types.Mixed,
    },
    error: {
        type: String,
    },
}, {
    timestamps: true,
});

const SystemLog = model<ISystemLog>('SystemLog', systemLogSchema);

export default SystemLog;
