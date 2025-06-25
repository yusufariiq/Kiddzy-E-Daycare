import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../models/user.model';

export class UserService {
    private userRepository: UserRepository;
    
    constructor() {
        this.userRepository = new UserRepository();
    }

    async getAllUsers(): Promise<IUser[] | null > {
        return await this.userRepository.findAll();
    }

    async getUserProfile(userId: string): Promise<IUser | null> {
        return await this.userRepository.findById(userId);
    }
    
    async getUserByEmail(email: string): Promise<IUser | null> {
        return await this.userRepository.findByEmail(email);
    }

    async getUsersByRole(role: string): Promise<IUser[]> {
        return await this.userRepository.findByRole(role);
    }

    async updateUserProfile(userId: string, userData: Partial<IUser>): Promise<IUser | null> {
        const { role, ...updatableData } = userData;
        return await this.userRepository.update(userId, updatableData);
    }
    
    async deleteUser(userId: string): Promise<boolean> {
        return await this.userRepository.delete(userId);
    }
}