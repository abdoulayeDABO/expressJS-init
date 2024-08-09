import { readFile, sendEmail } from '../utils';
import userService from './user.sevices';
import bcrypt from 'bcrypt';



const sendAccountValidationEmail = async ({name, email, token}: { name: string, email: string, token: string }) => {
      const body = await readFile('src/mails/activation.html');
      if (!body) throw new Error('Error reading mail template');
      const html = body?.replace('{{name}}', name).replace('{{token}}', token);
      await sendEmail({receiverEmail: [email, 'abdoulaye4.dabo@ucad.edu.sn'], subject: "Activation de compte", body: html});
}

const signin = async ({email, password}: { email: string, password: string }) => {
  const user = await userService.findUser(email);
  if (!user) throw new Error('User not found');
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new Error('Invalid password');
  return user;
}

const sendPasswordResetEmail = async ({email, token} : { email: string, token: string }) => {
    const body = await readFile('src/mails/resetPassword.html');
    if (!body) throw new Error('Error reading mail template');
    const html = body?.replace('{{email}}', email).replace('{{token}}', token);
    await sendEmail({receiverEmail: [email, 'abdoulaye4.dabo@ucad.edu.sn'], subject: "Réinitialisation du mot de passe", body: html});
}

const authService = {
  sendAccountValidationEmail,
  signin,
  sendPasswordResetEmail
};

export default authService;