import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import PurchaseOrder, { PurchaseOrderStatus } from '../models/PurchaseOrder.js';
import SystemLog from '../models/SystemLog.js';
import VendorQuote from '../models/VendorQuote.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI not found in .env');
    process.exit(1);
}

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB Atlas...');

        // 1. Clear existing data
        await Product.deleteMany({});
        await PurchaseOrder.deleteMany({});
        await SystemLog.deleteMany({});
        await VendorQuote.deleteMany({});
        console.log('Existing data cleared.');

        // 2. Create 10+ SKUs (Products)
        const productsRaw = [
            { sku: 'SKU-001', name: 'Industrial Drill Press', currentStock: 2, reorderLevel: 5, unitPrice: 45000, currency: 'INR' },
            { sku: 'SKU-002', name: 'High-Torque Motor', currentStock: 12, reorderLevel: 10, unitPrice: 12000, currency: 'INR' },
            { sku: 'SKU-003', name: 'Control Panel V4', currentStock: 1, reorderLevel: 3, unitPrice: 85000, currency: 'INR' },
            { sku: 'SKU-004', name: 'Aluminium Rod 2m', currentStock: 150, reorderLevel: 50, unitPrice: 800, currency: 'INR' },
            { sku: 'SKU-005', name: 'Steel Gasket Set', currentStock: 45, reorderLevel: 100, unitPrice: 1200, currency: 'INR' }, // Low Stock
            { sku: 'SKU-006', name: 'CNC Router Head', currentStock: 0, reorderLevel: 2, unitPrice: 120000, currency: 'INR' }, // Out of Stock
            { sku: 'SKU-007', name: 'Ball Bearing Pack', currentStock: 200, reorderLevel: 150, unitPrice: 450, currency: 'INR' },
            { sku: 'SKU-008', name: 'Hydraulic Pump', currentStock: 3, reorderLevel: 8, unitPrice: 32000, currency: 'INR' }, // Low Stock
            { sku: 'SKU-009', name: 'Thermal Sensor 2X', currentStock: 80, reorderLevel: 50, unitPrice: 2100, currency: 'INR' },
            { sku: 'SKU-010', name: 'Pneumatic Actuator', currentStock: 4, reorderLevel: 6, unitPrice: 15500, currency: 'INR' },
            { sku: 'SKU-011', name: 'Heavy Duty Caster', currentStock: 25, reorderLevel: 20, unitPrice: 3800, currency: 'INR' },
            { sku: 'SKU-012', name: 'PLC Module M101', currentStock: 2, reorderLevel: 5, unitPrice: 75000, currency: 'INR' } // Low Stock
        ];

        const products = await Product.insertMany(productsRaw);
        console.log(`Created ${products.length} products.`);

        // 3. Define 3+ Vendors
        const vendors = ['V-GLOBAL-TOOLS', 'V-PRECISION-PARTS', 'V-INDUSTRIAL-SUPPLIES'];

        // 4. Create many POs in various states
        const posRaw = [];

        // Helper to get random item
        const getRandomProduct = () => products[Math.floor(Math.random() * products.length)];
        const getRandomVendor = () => vendors[Math.floor(Math.random() * vendors.length)];
        const getRandomStatus = () => {
            const statuses = Object.values(PurchaseOrderStatus);
            return statuses[Math.floor(Math.random() * statuses.length)];
        };

        // Create 30 various POs
        for (let i = 0; i < 30; i++) {
            const product = getRandomProduct();
            const quantity = Math.floor(Math.random() * 10) + 2;
            const status = getRandomStatus();
            const vendorId = getRandomVendor();

            posRaw.push({
                vendorId,
                items: [{
                    productId: product._id,
                    quantity,
                    price: product.unitPrice
                }],
                status,
                totalAmount: product.unitPrice * quantity
            });
        }

        // Add some high-value POs for testing > 100,000 INR
        posRaw.push({
            vendorId: 'V-GLOBAL-TOOLS',
            items: [{ productId: products[5]._id, quantity: 1, price: 120000 }],
            status: PurchaseOrderStatus.AWAITING_HUMAN_CONFIRMATION,
            totalAmount: 120000
        });

        posRaw.push({
            vendorId: 'V-PRECISION-PARTS',
            items: [{ productId: products[2]._id, quantity: 2, price: 85000 }],
            status: PurchaseOrderStatus.PENDING_APPROVAL,
            totalAmount: 170000
        });

        await PurchaseOrder.insertMany(posRaw);
        console.log(`Created ${posRaw.length} purchase orders.`);

        // 5. Create "Refill Requests" (logs of worker actions)
        const logsRaw = [
            {
                agentName: 'ProcurementWorker',
                toolName: 'check_low_stock',
                arguments: {},
                status: 'SUCCESS',
                response: [products[0].sku, products[4].sku, products[5].sku]
            },
            {
                agentName: 'ProcurementWorker',
                toolName: 'fetch_vendor_quotes',
                arguments: { sku: 'SKU-006' },
                status: 'SUCCESS',
                response: [
                    { vendorId: 'V-GLOBAL-TOOLS', price: 120000 },
                    { vendorId: 'V-PRECISION-PARTS', price: 125000 }
                ]
            },
            {
                agentName: 'ProcurementWorker',
                toolName: 'draft_purchase_order',
                arguments: { vendorId: 'V-GLOBAL-TOOLS', productId: products[5].sku, quantity: 2 },
                status: 'SUCCESS',
                response: { message: 'PO drafted successfully', poId: 'NEW-PO-123' }
            },
            {
                agentName: 'FinanceManager',
                toolName: 'approve_po',
                arguments: { id: 'PO-789' },
                status: 'SUCCESS',
                response: { success: true, newStatus: 'APPROVED' }
            }
        ];

        await SystemLog.insertMany(logsRaw);
        console.log(`Created ${logsRaw.length} system logs (Refill simulation).`);

        // 6. Create Vendor Quotes for all products
        const quotesRaw = [];
        for (const product of products) {
            // Each product gets 3 quotes with slightly different prices
            quotesRaw.push({
                vendorName: 'Global Supplies',
                sku: product.sku,
                price: product.unitPrice * 1.05,
                leadTime: '3 days'
            });
            quotesRaw.push({
                vendorName: 'Precision Tools Co',
                sku: product.sku,
                price: product.unitPrice * 1.02,
                leadTime: '5 days'
            });
            quotesRaw.push({
                vendorName: 'Budget Parts Inc',
                sku: product.sku,
                price: product.unitPrice * 0.98,
                leadTime: '10 days'
            });
        }
        await VendorQuote.insertMany(quotesRaw);
        console.log(`Created ${quotesRaw.length} vendor quotes.`);

        console.log('Database Seeding Complete!');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
