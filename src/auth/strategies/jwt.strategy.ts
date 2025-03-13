import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigType } from "@nestjs/config";
import { Strategy, ExtractJwt } from 'passport-jwt'
import config from '../../../config'
import { Token } from "../models/token.interface";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt'){
    constructor(
       @Inject(config.KEY) configService: ConfigType<typeof config>
    ){  
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.jwtSecret ?? 'JWT_SECRET'
        });
    }

    async validate(token: Token){
        return token;
    }
}