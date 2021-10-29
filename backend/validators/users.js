const { check, validationResult } = require('express-validator');
exports.validateAddUserRequest = [
    check('firstname')
    .isLength({ min: 3 })
    .withMessage('First Name must be of minimum 3 character')
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage('Only letters and spaces accepted in Name'),
    check('lastname')
    .isLength({ min: 3 })
    .withMessage('Last Name must be of minimum 3 character')
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage('Only letters and spaces accepted in Name'),
    check('contact')
    .notEmpty()
    .isLength({min:10, max:10})
    .withMessage('Contact is Required'),
    check('email')
    .isEmail()
    .withMessage('Valid Email is Required'),
     check('password')
     .isLength({ min: 8,})
     .withMessage('Password Must be atleast 8 character long')
     .matches(/\d/)
     .withMessage('Password Must be atleast 1 digit')
     .matches(/[A-Z]/)
     .withMessage('Password Must be atleast 1 Uppercase Character')
     .matches(/[a-z]/)
     .withMessage('Password Must be atleast 1 Lowercase Character')     
     .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password Must be atleast 1 special character')
]

exports.isRequestValidated = (req,res,next) => {
    const errors = validationResult(req);
    if(errors.array().length > 0){
        return res.status(201).json({errors: errors.array()[0].msg})
    }
    next();
}