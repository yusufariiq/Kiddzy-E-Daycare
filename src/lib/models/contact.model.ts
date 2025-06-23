import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
    name: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    isArchived: boolean;
}

const contactSchema = new Schema<IContact>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        isRead: { 
            type: Boolean, 
            default: false 
        },
        isArchived: 
        { 
            type: Boolean, 
            default: false 
        },
    },
    { timestamps: true }
  );
  
export const Contact = mongoose.models.Contact || mongoose.model<IContact>('Contact', contactSchema);