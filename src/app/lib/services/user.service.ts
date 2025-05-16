import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../models/user.model';

export class UserService {
    private userRepository: UserRepository;
    
    constructor() {
        this.userRepository = new UserRepository();
    }

    async getUserProfile(userId: string): Promise<IUser | null> {
        return await this.userRepository.findById(userId);
    }

    async updateUserProfile(userId: string, userData: Partial<IUser>): Promise<IUser | null> {
        const { role, ...updatableData } = userData;
        return await this.userRepository.update(userId, updatableData);
    }
}