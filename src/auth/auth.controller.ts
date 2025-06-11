import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AdminAuthDto, AuthDto } from './dto/auth.dto';
import { AdminOnly } from './decorators/admin-only.decorator';
import { Auth } from './decorators/auth.decorator';
import { CurrentUser } from './decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(200)
  async register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @Post('admin/login')
  @HttpCode(200)
  async adminLogin(@Body() dto: AdminAuthDto) {
    return this.authService.adminLogin(dto);
  }

  @Post('admin/register')
  @HttpCode(200)
  async adminRegister(@Body() dto: AdminAuthDto) {
    return this.authService.adminRegister(dto);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() dto: { refreshToken: string }) {
    return this.authService.getNewTokens(dto.refreshToken);
  }

  @AdminOnly()
  @Post('admin/refresh')
  @HttpCode(200)
  async adminRefresh(@Body() dto: { refreshToken: string }) {
    return this.authService.getNewAdminTokens(dto.refreshToken);
  }

  @AdminOnly()
  @Auth()
  @Get('admin/info')
  @HttpCode(200)
  async adminInfo(@CurrentUser('id') id: string) {
    return this.authService.adminInfo(id);
  }

  @AdminOnly()
  @Auth()
  @Post('admin/logout')
  @HttpCode(200)
  async adminLogout() {
    return this.authService.adminLogout();
  }
}
