import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { compare, hash } from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async seedDefaultUser(): Promise<void> {
    const shouldSeed =
      this.configService.get<string>('SEED_DEFAULT_USER') === 'true';

    if (!shouldSeed) {
      return;
    }

    const email = this.configService.getOrThrow<string>('DEFAULT_ADMIN_EMAIL');
    const password = this.configService.getOrThrow<string>(
      'DEFAULT_ADMIN_PASSWORD',
    );
    const name = this.configService.get<string>('DEFAULT_ADMIN_NAME') || 'Admin';
    const existing = await this.userModel.findOne({ email }).exec();
    if (existing) {
      return;
    }

    const passwordHash = await hash(password, 10);
    await this.userModel.create({
      email,
      passwordHash,
      name,
    });
  }

  async login(email: string, password: string) {
    const user = await this.userModel
      .findOne({ email: email.toLowerCase() })
      .exec();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const matched = await compare(password, user.passwordHash);
    if (!matched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
