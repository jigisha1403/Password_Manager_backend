import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PasswordsService } from './passwords.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreatePasswordDto } from './dto/create-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('passwords')
export class PasswordsController {
  constructor(private readonly passwordsService: PasswordsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createPasswordDto: CreatePasswordDto) {
    return this.passwordsService.createPassword(createPasswordDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.passwordsService.getAllPasswords();
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
