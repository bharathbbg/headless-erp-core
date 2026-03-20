import { Request, Response, NextFunction } from 'express';
import SystemLog from '../models/SystemLog.js';

export const logToolCall = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const logData = req.body;
        const log = new SystemLog(logData);
        await log.save();
        res.status(201).json({
            success: true,
            data: log,
        });
    } catch (error) {
        next(error);
    }
};

export const getSystemLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const logs = await SystemLog.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: logs,
        });
    } catch (error) {
        next(error);
    }
};
