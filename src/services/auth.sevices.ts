import { PrismaClient} from '@prisma/client'
const prisma = new PrismaClient();
import nodemailer from "nodemailer";
import { readFile } from '../utils';
import HttpException from '../utils/http/exceptions';
import userService from './user.sevices';
import bcrypt from 'bcrypt';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "abdoulayeleom10@gmail.com",
    pass: process.env.APP_KEY,
  },
});


const sendAccountValidationEmail = async ({name, email, token}: { name: string, email: string, token: string }) => {
      const body = await readFile('src/mails/activation.html');
      if (!body) throw new HttpException('Error reading mail template');
      const html = body?.replace('{{name}}', name).replace('{{token}}', token);
      await transporter.sendMail({
        from: 'abdoulayleom10@gmail.com', // sender address
        to:[ email, 'abdoulaye4.dabo@ucad.edu.sn'], // list of receivers
        subject: "Activation de compte", // Subject line
        text: "Hello world?", // plain text body
        html:  html, // html body
      });
}

const signin = async ({email, password}: { email: string, password: string }) => {
  const user = await userService.findUser(email);
  if (!user) throw new HttpException('User not found');
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new HttpException('Invalid password');
  return user;
}

const authService = {
  sendAccountValidationEmail,
  signin
};

export default authService;