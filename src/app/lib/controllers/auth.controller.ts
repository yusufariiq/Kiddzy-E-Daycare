// controllers/auth.controller.ts
import { IUser } from '../models/user.model';
import { AuthService } from '../services/auth.service';

export class AuthController {
    private authService: AuthService;
    
    constructor() {
        this.authService = new AuthService();
    }

    async registerHandler(userData: Partial<IUser>): Promise<{ user: IUser, token: string }> {
        return await this.authService.register(userData);
    }

    async loginHandler(email: string, password: string): Promise<{ user: IUser, token: string }> {
        return await this.authService.login(email, password);
    }
}