import { Schema, model, Document, Types } from 'mongoose';

export enum PurchaseOrderStatus {
    PENDING_APPROVAL = 'PENDING_APPROVAL',
    AWAITING_HUMAN_CONFIRMATION = 'AWAITING_HUMAN_CONFIRMATION',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    ORDERED = 'ORDERED',
    RECEIVED = 'RECEIVED',
}

export interface IPurchaseOrderItem {
    productId: string | Types.ObjectId;
    quantity: number;
    price: number;
}

export interface IPurchaseOrder extends Document {
    vendorId: string;
    items: IPurchaseOrderItem[];
    status: PurchaseOrderStatus;
    totalAmount: number;
}

const purchaseOrderItemSchema = new Schema<IPurchaseOrderItem>({
    productId: {
        type: String, // Storing as String (or ObjectId) depending on design. AGENT.md says String.
        required: [true, 'Product ID is required'],
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
});

const purchaseOrderSchema = new Schema<IPurchaseOrder>({
    vendorId: {
        type: String,
        required: [true, 'Vendor ID is required'],
        trim: true,
    },
    items: {
        type: [purchaseOrderItemSchema],
        required: [true, 'Items are required'],
        validate: [
            (val: any[]) => val.length > 0,
            'Purchase order must have at least one item',
        ],
    },
    status: {
        type: String,
        enum: Object.values(PurchaseOrderStatus),
        default: PurchaseOrderStatus.PENDING_APPROVAL,
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required'],
        default: 0,
    },
}, {
    timestamps: true,
});

// Middleware to calculate totalAmount before saving
purchaseOrderSchema.pre('save', function (next) {
    this.totalAmount = this.items.reduce((total, item) => {
        return total + item.quantity * item.price;
    }, 0);
    next();
});

const PurchaseOrder = model<IPurchaseOrder>('PurchaseOrder', purchaseOrderSchema);

export default PurchaseOrder;
