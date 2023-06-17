import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

interface Tokens {
  token: string;
  id: string;
  date: Date;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  private jwtTokenTwoFactor: Tokens[] = [];
  async generateJwtToken(user: User): Promise<string> {
    const payload = { id: user.id, name: user.name };
    const token = this.jwtService.signAsync(payload);
    return token;
  }

  addRequireTwoFactor(token: string, id: string) {
    if (this.isTokenRequireTwoFactor(token)) {
      return;
    }
    this.jwtTokenTwoFactor.push({ token, id, date: new Date() });
    return token;
  }
  removeTokenRequireTwoFactor(token: string) {
    this.jwtTokenTwoFactor = this.jwtTokenTwoFactor.filter(
      (t) => t.token !== token,
    );
  }
  isTokenRequireTwoFactor(token: string) {
    return this.jwtTokenTwoFactor.some((t) => t.token === token);
  }
  removeIdRequireTwoFactor(id: string) {
    this.jwtTokenTwoFactor = this.jwtTokenTwoFactor.filter((t) => t.id !== id);
  }
  isIdRequireTwoFactor(id: string) {
    return this.jwtTokenTwoFactor.some((t) => t.id === id);
  }
}
