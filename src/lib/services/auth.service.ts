import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../models/user.model';
import * as jwt from 'jsonwebtoken';

export class AuthService {
  private userRepository: UserRepository;
  
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData: Partial<IUser>): Promise<{ user: IUser, token: string }> {
    if (!userData.email || !userData.password || !userData.firstName || 
        !userData.lastName || !userData.phoneNumber) {
      throw new Error('All fields are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(userData.password)) {
      throw new Error('Password must be at least 8 characters with at least one letter and one number');
    }

    const existingUser = await this.userRepository.findByEmail(userData.email as string);
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const user = await this.userRepository.create(userData);
    const token = this.generateToken(user);
    
    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: IUser, token: string }> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    
    const token = this.generateToken(user);
    
    return { user, token };
  }

  private generateToken(user: IUser): string {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role
    };
    
    const secret = process.env.JWT_SECRET || 'defaultsecret';
    
    return jwt.sign(payload, secret, {
      expiresIn: '1d'
    });
  }
}