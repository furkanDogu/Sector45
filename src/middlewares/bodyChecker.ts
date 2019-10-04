import { Request, Response, NextFunction } from 'express';

export const bodyChecker = (fields: string[] = []) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.body || !fields.every(field => !!req.body[field])) {
        res.status(401).json('Lack of information');
        return;
    }
    next();
};
