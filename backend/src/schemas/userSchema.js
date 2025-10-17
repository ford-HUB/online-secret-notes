import Joi from "joi";

export const registerBody = Joi.object({
    username: Joi.string().min(3).required()
        .messages({
            'string.min': 'username must be at least 3 characters',
            'any.required': 'username is required'
        }),

    email: Joi.string().email().required()
        .messages({
            'string.email': 'email must be valid',
            'any.required': 'email is required'
        }),

    password: Joi.string().min(6).required()
        .messages({
            'string.min': 'password must be above 6 digit or characters',
            'any.required': 'password is required'
        })

})

export const loginBody = Joi.object({
    email: Joi.string().required()
        .messages({
            'any.required': 'Email is required'
        }),

    password: Joi.string().required()
        .messages({
            'any.required': 'Password is required'
        })
});

