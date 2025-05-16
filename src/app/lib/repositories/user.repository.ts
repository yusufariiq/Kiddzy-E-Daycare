import { IUser, User } from "../models/user.model";

export class UserRepository {
    async create(userData: Partial<IUser>): Promise<IUser> {
        return await User.create(userData);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email });
    }

    async findById(id: string): Promise<IUser | null> {
        return await User.findById(id);
    }

    async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
        return await User.findByIdAndUpdate(id, userData, { new: true });
    }
    
    async findAll(): Promise<IUser[]> {
        return await User.find().select('-password');
    }
}