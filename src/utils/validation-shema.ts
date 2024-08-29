import Joi from 'joi';

const loginSchema = Joi.object({
  //   username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

  repeat_password: Joi.ref('password'),

  email: Joi.string().email({
    // minDomainSegments: 2,
    // tlds: { allow: ['com', 'sn'] },
  }),
});

const registerShema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

const profileShema = Joi.object();

export { loginSchema, registerShema, profileShema };
