import Joi from "joi"

export const noteSchema = Joi.object({
    title: Joi.string().required()
        .messages({
            'any.required': 'Category Name is required'
        }),
    content_container: Joi.string().required()
        .messages({
            'any.required': 'Category Name is required'
        }),
})