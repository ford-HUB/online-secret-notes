
export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.json({
                success: false,
                errors: error.details.map(detail => ({
                    message: detail.message,
                    path: detail.path.join('.')
                })),
            });
        }

        next();
    };
};
