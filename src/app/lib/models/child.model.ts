import mongoose, { Document, Schema } from 'mongoose';

export interface IChild extends Document {
    userId: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other';
    specialNeeds?: string;
    allergies?: string[];
}

const childSchema = new Schema<IChild>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
            required: true,
        },
        specialNeeds: String,
        allergies: [String],
    },
    { timestamps: true }
);

export const Child = mongoose.models.Child || mongoose.model<IChild>('Child', childSchema);