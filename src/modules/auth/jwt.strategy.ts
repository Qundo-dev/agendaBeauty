import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'BEAUTY_FLOW_SECRET_KEY',
    });
  }

  async validate(payload: {
    sub: number;
    email: string;
    rol: string;
    businessId?: number | null;
  }) {
    return {
      userId: payload.sub,
      email: payload.email,
      rol: payload.rol,
      businessId: payload.businessId ?? null,
    };
  }
}