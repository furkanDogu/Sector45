import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';

import { Customer } from '@entities';

export class AuthController {
    static register = async (req: Request, res: Response, next: NextFunction) => {
        validate(req.body);
    };

    static login = async (req: Request, res: Response, next: NextFunction) => {};
}
