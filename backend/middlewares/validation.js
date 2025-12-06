import { ZodError } from "zod";

export const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync(req.body || {});
        next();
    } catch (error) {
        if (error instanceof ZodError && error.errors && Array.isArray(error.errors)) {
            const errorMessages = error.errors
                .map(err => {
                    const path = err.path.join('.');
                    return `${path ? path + ': ' : ''}${err.message}`;
                })
                .join(', ');
            return res.status(400).json({ 
                success: false, 
                message: errorMessages || 'Validation failed' 
            });
        }
        
        return res.status(400).json({ 
            success: false, 
            message: error?.message || 'Validation failed' 
        });
    }
}