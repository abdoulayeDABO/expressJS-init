import {body, matchedData, validationResult, check} from 'express-validator';


export const validateData = (req:any, res:any, next:any) => {
    const errors = validationResult(req)
    console.log(errors.array());
    if (errors.isEmpty()) {
        req.matchedData = matchedData(req);
        console.log(req.matchedData);
        return next()
    }
    // const extractedErrors: any = [];
    // errors.array().map((err:any) => extractedErrors.push({ [err.path]: err.msg }))

    return res.status(422).json({message: "Invalid data"})
}


const userValidationRules = () => {
  return [
    body('email').trim().isEmail().notEmpty().escape(),
    body('password').trim().escape(),
    body('name').trim().escape(),
  ]
}

module.exports = {
  userValidationRules,
  validateData,
}