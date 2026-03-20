import { Request, Response, NextFunction } from 'express';
import VendorQuote from '../models/VendorQuote.js';

export const getQuotesBySku = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sku } = req.params;
        const quotes = await VendorQuote.find({ sku });

        res.status(200).json({
            success: true,
            data: quotes,
        });
    } catch (error) {
        next(error);
    }
};

export const createQuote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const quote = new VendorQuote(req.body);
        await quote.save();
        res.status(201).json({
            success: true,
            data: quote,
        });
    } catch (error) {
        next(error);
    }
};
