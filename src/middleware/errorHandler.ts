import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    statusCode?: number;
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    console.error(`Status code: ${statusCode}, Message: ${message}`);

    res.status(statusCode).json({
        success: false,
        data: null,
        error: message,
    });
};

export default errorHandler;
