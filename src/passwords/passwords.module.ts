import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Passwords, passwordsSchema } from '../schemas/passwords.schema';
import { PasswordsService } from './passwords.service';
import { PasswordsController } from './passwords.controller';

@Module({
    imports:[
      MongooseModule.forFeature([
      {
        name: Passwords.name,
        schema: passwordsSchema,
      },
    ]),
    ],
  controllers: [PasswordsController],
  providers: [PasswordsService],
})
export class PasswordsModule {}
