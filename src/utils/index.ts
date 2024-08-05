import fs from 'node:fs/promises';
import crypto from 'crypto';

const readFile = async (path: string) => {
    try {
        const data = await fs.readFile(path, { encoding: 'utf8' });
        return data;
    } catch (err) {
        console.log(err);
    }
}

const generateToken = () => crypto.randomUUID();


export {
    readFile,
    generateToken
}