import { Schema, model, Document } from 'mongoose';

export interface IVendorQuote extends Document {
    vendorName: string;
    sku: string;
    price: number;
    leadTime: string;
    currency: string;
}

const vendorQuoteSchema = new Schema<IVendorQuote>({
    vendorName: {
        type: String,
        required: [true, 'Vendor name is required'],
        trim: true,
    },
    sku: {
        type: String,
        required: [true, 'SKU is required'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    leadTime: {
        type: String,
        required: [true, 'Lead time is required'],
    },
    currency: {
        type: String,
        default: 'INR',
    },
}, {
    timestamps: true,
});

// Create an index on SKU for faster lookups
vendorQuoteSchema.index({ sku: 1 });

const VendorQuote = model<IVendorQuote>('VendorQuote', vendorQuoteSchema);

export default VendorQuote;
