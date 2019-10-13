import { Request, Response, NextFunction } from 'express';

export const bodyChecker = (fields: string[] = []) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.body || !fields.every(field => !!req.body[field])) {
        res.status(401).json({ error: 'Lack of body information in request' });
        return;
    }
    next();
};

export const urlParamChecker = (requiredParams: string[]) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (
        requiredParams.every(
            key => typeof req.params[key] !== 'undefined' && req.params[key] !== null
        )
    ) {
        next();
        return;
    }
    res.status(401).json({ error: 'Lack of url params information in request' });
    return;
};
