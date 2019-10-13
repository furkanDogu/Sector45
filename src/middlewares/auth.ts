import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { JWT_SECRET } from '@config';

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const auth_token = req.headers['auth_token'];

    if (!auth_token) {
        return res.status(400).json({
            error: 'auth_token header is required',
        });
    }

    try {
        const customer = verify(auth_token as string, JWT_SECRET);
        res.locals.customerNo = (customer as { customerNo: string })['customerNo'];
        next();
    } catch (e) {
        return res.status(400).json({
            error: 'Invalid auth_token',
        });
    }
};
