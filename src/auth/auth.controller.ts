import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AdminAuthDto, AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @Post('admin/login')
  async adminLogin(@Body() dto: AdminAuthDto) {
    return this.authService.adminLogin(dto);
  }
}
