import path from 'path';
import type { ContactUsFormInput } from '../../pages/ContactUsPage';
import { userData } from './users';
export const contactUsFormInput: ContactUsFormInput = {
    name: userData.accountInfo.name,
    email: userData.accountInfo.email,
    subject: 'Test Subject',
    message: 'This is a contact message for testing.',
    absoluteFilePath: path.resolve(process.cwd(), 'tests', 'assets', 'bird.jpg'),
    expectedFileName: 'bird.jpg',
};