import { Request, Response } from 'express';
import { NextFunction } from 'connect';

export type RequestHandler<T> = (req: Request, res: Response, next: NextFunction) => T;
