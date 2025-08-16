import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PasswordsService } from './passwords.service';
import { AuthGuard } from '../guards/auth.guard';
import { CreatePasswordDto } from './dto/create-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Request } from '@nestjs/common';

@Controller('passwords')
export class PasswordsController {
  constructor(private readonly passwordsService: PasswordsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() req,  @Body() createPasswordDto: CreatePasswordDto) {
    return this.passwordsService.createPassword(req.userId, createPasswordDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Request() req) {
    const userId = req.userId;
    return this.passwordsService.getAllPasswords(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.passwordsService.getPasswordById(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.passwordsService.deletePassword(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.passwordsService.updatePassword(updatePasswordDto, id);
  }

}
