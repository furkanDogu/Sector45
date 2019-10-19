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

    static operations = async (req: Request, res: Response) => {
        let account;
        try {
            account = await findEntityById(getRepository(Account), req.params.accountId);
            if (!account) throw new Error();

            return res.status(200).json({
                error: null,
                data: await account.operations,
            });
        } catch (e) {
            return res.status(400).json({
                error: 'Account is not found',
            });
        }
    };
}
