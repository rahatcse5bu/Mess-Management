import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    me(req: {
        user: {
            sub: string;
            email: string;
            name: string;
        };
    }): {
        sub: string;
        email: string;
        name: string;
    };
}
