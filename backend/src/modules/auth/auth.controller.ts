import { Controller, Post, Body, UseGuards, Req, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtGuard } from '../../guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  private setAuthCookie(res: Response, token: string) {
    res.cookie('accessToken', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto, @Res({ passthrough: true }) res: Response): Promise<AuthResponseDto> {
    const authResponse = await this.authService.signup(signupDto);
    this.setAuthCookie(res, authResponse.accessToken);
    return authResponse;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response): Promise<AuthResponseDto> {
    const authResponse = await this.authService.login(loginDto);
    this.setAuthCookie(res, authResponse.accessToken);
    return authResponse;
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async getMe(@Req() req: any): Promise<AuthResponseDto> {
    return this.authService.getCurrentUser(req.user.userId);
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return this.authService.logout();
  }
}
