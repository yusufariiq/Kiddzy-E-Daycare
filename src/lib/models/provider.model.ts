import mongoose, { Schema, Document } from 'mongoose';

export interface IProvider extends Document {
    name: string;
    description: string;
    address: string;
    location: string;
    whatsapp: string;
    email: string;
    images: string[];
    price: number;
    features: string[];
    ageGroups: {
        min: number;
        max: number;
    }[];
    availability: boolean;
    isActive: boolean;
    capacity: number;
    operatingHours: {
        day: string;
        open: string;
        close: string;
    }[];
}

const providerSchema = new Schema<IProvider>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        address: { 
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        whatsapp: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        images: [
            { 
                type: String 
            }
        ],
        price: {
            type: Number,
            required: true,
        },
        features: [
            { 
                type: String 
            }
        ],
        ageGroups: [
            {
                min: Number,
                max: Number,
            },
        ],
        availability: {
            type: Boolean,
            default: true
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
        operatingHours: [
            {
            day: {
                type: String,
                enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                required: true,
            },
            open: {
                type: String,
                required: true,
            },
            close: {
                type: String,
                required: true,
            },
            },
        ],
    },
    { timestamps: true }
);

export const Provider = mongoose.models.Provider || mongoose.model<IProvider>('Provider', providerSchema);
