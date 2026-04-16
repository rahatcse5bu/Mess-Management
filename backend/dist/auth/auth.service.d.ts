import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
export declare class AuthService {
    private readonly userModel;
    private readonly jwtService;
    private readonly configService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService, configService: ConfigService);
    seedDefaultUser(): Promise<void>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
}
