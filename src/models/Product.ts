import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
    sku: string;
    name: string;
    currentStock: number;
    reorderLevel: number;
    unitPrice: number;
    currency: string;
}

const productSchema = new Schema<IProduct>({
    sku: {
        type: String,
        required: [true, 'SKU is required'],
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    currentStock: {
        type: Number,
        required: [true, 'Current stock is required'],
        default: 0,
    },
    reorderLevel: {
        type: Number,
        required: [true, 'Reorder level is required'],
        default: 0,
    },
    unitPrice: {
        type: Number,
        required: [true, 'Unit price is required'],
        default: 0.0,
    },
    currency: {
        type: String,
        default: 'INR',
    },
}, {
    timestamps: true,
});

const Product = model<IProduct>('Product', productSchema);

export default Product;
