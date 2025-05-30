import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
    userId: mongoose.Types.ObjectId;
    providerId: mongoose.Types.ObjectId;
    childId: mongoose.Types.ObjectId;
    startDate: Date;
    endDate: Date;
    status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
    totalAmount: number;
    childrenCount: number;
    paymentMethod: 'debit_card' | 'bank_transfer' | 'e_wallet';
    emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
    };
    notes?: string;
}

const bookingSchema = new Schema<IBooking>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        providerId: {
            type: Schema.Types.ObjectId,
            ref: 'Provider',
            required: true,
        },
        childId: {
            type: Schema.Types.ObjectId,
            ref: 'Child',
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
            default: 'pending',
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        childrenCount: {
            type: Number,
            required: true,
            min: 1
        },
        paymentMethod: {
            type: String,
            enum: ['debit_card', 'bank_transfer', 'e_wallet'],
            required: true,
        },
        emergencyContact: {
            name: {
                type: String,
                required: false
            },
            phone: {
                type: String,
                required: false
            },
            relationship: {
                type: String,
                required: false
            }
        },
        notes: String,
    },
    { timestamps: true }
);

bookingSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});

bookingSchema.virtual('provider', {
    ref: 'Provider',
    localField: 'providerId',
    foreignField: '_id',
    justOne: true
});

bookingSchema.virtual('child', {
    ref: 'Child',
    localField: 'childId',
    foreignField: '_id',
    justOne: true
});

bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ providerId: 1, status: 1 });
bookingSchema.index({ startDate: 1, endDate: 1 });

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);