import jwt from 'jsonwebtoken';
const privateKey: any =  process.env.PRIVATE_KEY ;

const validateAccessToken = (req: any, res: any, next: any) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({message: 'Unauthorized'});
  const tokenParts = token.split(' ');
  if (tokenParts.length !== 2) return res.status(401).json({message: 'Unauthorized'});
  const [scheme, credentials] = tokenParts;
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({message: 'Unauthorized'});
  jwt.verify(credentials, privateKey, (err: any, decoded: any) => {
    if (err) return res.status(401).json({message: 'Unauthorized'});
    req.user = decoded;
    return next();
  });
  return res.status(401).json({message: 'Unauthorized'});
};

// async function validateCookies (req, res, next) {
//   await cookieValidator(req.cookies)
//   next()
// }

export default validateAccessToken;