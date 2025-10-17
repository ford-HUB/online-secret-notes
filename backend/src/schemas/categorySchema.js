import Joi from "joi"

export const catSchema = Joi.object({
    category_name: Joi.string().required()
        .messages({
            'any.required': 'Category Name is required'
        })
})