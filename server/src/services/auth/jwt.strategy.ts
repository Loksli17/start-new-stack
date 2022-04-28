import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import authConst from './auth.const';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    
    constructor() {
        super({
            jwtFromRequest  : ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey     : authConst.secret,
        });
    }

    async validate(payload: any) {
        return { id: payload.id, login: payload.login };
    }
}