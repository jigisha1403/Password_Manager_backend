import { Injectable, Body, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthS } from 'src/schemas/auth.schema';
import { InjectModel } from '@nestjs/mongoose';
import { loginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from 'src/schemas/refresh-token.schema';
import {v4 as uuidv4} from 'uuid';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor (
    @InjectModel(AuthS.name) private authModel:Model<AuthS>,
    @InjectModel(RefreshToken.name) private RefreshTokenModel: Model<RefreshToken>,
    private jwtService: JwtService){}

  async signUp(@Body() body: CreateAuthDto){
    const {name, email, password} = body;

    const emailInUse = await this.authModel.findOne({
      email: email
    });

    if(emailInUse){
      return {
        message: `This email ${email} is already in use`
      }
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.authModel.create({
      name,
      email,
      password: hashedPassword
    });

    return {
      success: true,
      message: `User having name ${name} signed up successfully`
    };
  }

  async login(@Body() body: loginDto){
    //console.log('body ',body);
    const {email, password} = body;

    const user = await this.authModel.findOne({email});
    if(!user){
      return {
        message:'wrong credentials'
      }
    };

    const matchPassword = await bcrypt.compare(password, user.password);

    if(!matchPassword){
      return {
        message: 'wrong credentials'
      }
    };

    const {accessToken} = await this.generateUserToken(user._id)
    const {RefreshToken} = await this.generateUserToken(user._id);
    //console.log("token ", accessToken);
    return {
      success: true,
      accessToken,
      RefreshToken
    }
  }

  async generateUserToken(userId){
    const accessToken = this.jwtService.sign({userId}, {expiresIn: '1h'});
    const RefreshToken = uuidv4();

    await this.storeRefreshToken(RefreshToken,userId);

    return {
      accessToken,
      RefreshToken
    }
  };

  async refreshTokens(token: string){
    //console.log("token ",token);
    const my_token = await this.RefreshTokenModel.findOne({
      token: token,
      expiryDate: {$gte: new Date()} // greater than now date
    });

    if(!my_token){
      throw new UnauthorizedException("The token is either invalid or expired tbh!")
    };

    return this.generateUserToken(my_token.userId);
  }

  async storeRefreshToken(token: string, userId){
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    await this.RefreshTokenModel.updateOne(
      { userId },
      { $set: { expiryDate, token } },
      { upsert: true }
    );
  }
}
