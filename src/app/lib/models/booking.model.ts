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
    paymentStatus: 'pending' | 'paid' ;
    paymentMethod?: string;
    paymentId?: string;
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
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid'],
            default: 'pending',
        },
        paymentMethod: String,
        paymentId: String,
        notes: String,
    },
    { timestamps: true }
);

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);