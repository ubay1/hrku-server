import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async codeForgotpassword(data: User, dataReset: {otp: any, exp: any}) {

    await this.mailerService.sendMail({
      to: data.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: `${dataReset.otp} adalah kode otp anda`,
      template: './forgotPassword', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: data.fullname,
        otp: dataReset.otp,
        exp: dataReset.exp
      },
    });
  }
}
