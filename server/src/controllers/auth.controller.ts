import { Body, Controller, HttpCode, Post, Request, Res} from "@nestjs/common";
import Token from "src/models/Token";
import { AuthService } from "src/services/auth/auth.service";



@Controller('auth')
export default class AuthController {


    constructor(
        private readonly authService: AuthService
    ) { }


    @Post('login')
    public async login(@Request() req, @Res() res){
        
        const tokens: { accessToken: string, refreshToken: string, token: Token } = 
        await this.authService.login(req.body.login, req.body.password, req.headers['user-agent']);
    
        res.setCookie(
            'refreshToken', 
            tokens.refreshToken,
            { 
                maxAge  : tokens.token.get('expiredIn'), 
                httpOnly: true, 
                sameSite: 'none', 
                secure  : true 
            }
        )

        console.log('login', tokens.refreshToken);
        
        res.code(200).send({
            accessToken: tokens.accessToken
        })
    }


    @Post('create-tokens')
    public async createTokens(@Request() req, @Res() res): Promise<any> {

        const result = await this.authService.updateToken(req.headers['user-agent'], req.cookies['refreshToken'])

        res.setCookie(
            'refreshToken', 
            result.refreshToken,
            { 
                maxAge  : result.refreshTokenExpiredIn, 
                httpOnly: true, 
                sameSite: 'none', 
                secure  : true 
            }
        )

        console.log('update', result.refreshToken);
        
        res.code(200).send({
            accessToken: result.accessToken,
            msg        : result.msg,
        })
    }
}