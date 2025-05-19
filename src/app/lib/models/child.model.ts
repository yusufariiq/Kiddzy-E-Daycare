import mongoose, { Document, Schema } from 'mongoose';

export interface IChild extends Document {
    userId: mongoose.Types.ObjectId;
    fullname: string;
    nickname: string;
    age: number;
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
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        nickname: {
            type: String,
            required: true,
            trim: true,
        },
        age: {
            type: Number,
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