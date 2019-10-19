import { Request, Response } from 'express';
import { findEntityById } from '@utils/ormHelpers';
import { getRepository } from 'typeorm';
import { Account } from '@entities';

export class OperationController {
    static withdraw = async (req: Request, res: Response) => {
        try {
            let operation = await (await findEntityById(
                getRepository(Account),
                req.body.accountId
            )).withdraw(req.body.amount);

            return res.status(200).json({
                error: null,
                data: operation,
            });
        } catch {
            return res.status(400).json({ error: "Withdraw wasn't successfull" });
        }
    };
    static deposit = async (req: Request, res: Response) => {
        try {
            let operation = await (await findEntityById(
                getRepository(Account),
                req.body.accountId
            )).deposit(req.body.amount);

            return res.status(200).json({
                error: null,
                data: operation,
            });
        } catch {
            return res.status(400).json({ error: "Deposit wasn't successfull" });
        }
    };
}
