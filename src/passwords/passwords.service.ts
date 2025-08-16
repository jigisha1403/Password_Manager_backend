import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Passwords } from '../schemas/passwords.schema';
import { CreatePasswordDto } from './dto/create-password.dto';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Model } from 'mongoose';

const password = 'Password used to generate key';

@Injectable()
export class PasswordsService {

  constructor(@InjectModel(Passwords.name) private passwordModel: Model<Passwords>)
  {}

  async encrypt(text: string){
    const iv = randomBytes(16);

    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const textToEncrypt = text;
    const encryptedText = Buffer.concat([
      cipher.update(textToEncrypt),
      cipher.final(),
    ]);
    return iv.toString('hex') + ':' + encryptedText.toString('hex');
  }

  async decrypt(text: string){
    const [ivHex, encryptedHex] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');

    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    
    const decryptedText = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);

    return decryptedText.toString('utf8');
  }

  async createPassword(userId: string, createPasswordDto: CreatePasswordDto){
    const {websiteUrl, userName, password} = createPasswordDto;

    const checkWebsiteUrl = await this.passwordModel.findOne({
      websiteUrl: websiteUrl,
      userId: userId
    });

    if(checkWebsiteUrl){
      return {
        message: 'The password for this website already exists'
      }
    };

    const encryptedPassword = await this.encrypt(password);

    await this.passwordModel.create({
      websiteUrl,
      userName,
      password: encryptedPassword,
      userId,
    });

    return {
      success: true,
      message: 'Password created successfully'
    };
  };

  async getAllPasswords(userId: string){
    const all_passwords = await this.passwordModel.find({userId});

    const payload =  await Promise.all(
      all_passwords.map(async (data)=>{
      const decryptedPassword = await this.decrypt(data.password);
      return {
        id: data._id,
        websiteUrl: data.websiteUrl,
        userName: data.userName,
        password: decryptedPassword
      }
    })
    ) ;

    return{
      success: true,
      message: "All passwords retrieved",
      payload,
    };
  }

  async getPasswordById(id: string){
    console.log('Fetching password with ID:', id);

    const my_password = await this.passwordModel.findOne({
      _id: id
    });

    if(!my_password){ 
      return{
        message: 'This URL does not exist',
      };
    }

    my_password.password = await this.decrypt(my_password.password);

    return{
      success: true,
      message: "Password retrieved",
      password: my_password
    };
  }

  async deletePassword(id: string){
    const my_password = await this.passwordModel.deleteMany({
      _id: id
    });

    if(!my_password){
      return{
        message: 'The website URL or password does not exist'
      }
    }

    return {
      success: true,
      message: 'Password deleted successfully!'
    }
  }

  async updatePassword(@Body() body: UpdatePasswordDto, id: string){
    const {userName, password} = body;

    const encryptedPassword = await this.encrypt(password);

    const data = await this.passwordModel.findByIdAndUpdate(
      id,
      {
        userName,
        password: encryptedPassword
      },
      {new: true}
    );

    if(!data){
      return {
        message: 'WebsiteUrl or password does not exist'
      }
    }

    return {
      success: true,
      message: "Password updated successfully"
    };
  }
  

/*   create(createPasswordDto: CreatePasswordDto) {
    return 'This action adds a new password';
  }

  findAll() {
    return `This action returns all passwords`;
  }

  findOne(id: number) {
    return `This action returns a #${id} password`;
  }

  update(id: number, updatePasswordDto: UpdatePasswordDto) {
    return `This action updates a #${id} password`;
  }

  remove(id: number) {
    return `This action removes a #${id} password`;
  } */
}
