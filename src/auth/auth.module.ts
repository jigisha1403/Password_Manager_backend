import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthS, AuthSchema } from 'src/schemas/auth.schema';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RefreshToken, RefreshTokenSchema } from 'src/schemas/refresh-token.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
    {
      name: AuthS.name,
      schema: AuthSchema,
    },
    {
      name: RefreshToken.name,
      schema: RefreshTokenSchema
    }
  ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
