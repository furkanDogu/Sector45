import { Request, Response } from 'express';
import { findEntityById } from '@utils/ormHelpers';
import { getRepository } from 'typeorm';
import { Account } from '@entities';

export class OperationController {
    static withdraw = async (req: Request, res: Response) => {
        try {
            const accountFound = await findEntityById(getRepository(Account), req.body.accountId);
            let [operation, account] = await accountFound.withdraw(req.body.amount);
            if (!operation) throw new Error();
            await (account as Account).save();

            return res.status(200).json({
                error: null,
                data: { ...operation, balance: (account as Account).balance },
            });
        } catch {
            return res.status(400).json({ error: "Withdraw wasn't successfull" });
        }
    };
    static deposit = async (req: Request, res: Response) => {
        try {
            const accountFound = await findEntityById(getRepository(Account), req.body.accountId);

            let [operation, account] = await accountFound.deposit(req.body.amount);
            if (!operation) throw new Error();
            await (account as Account).save();

            return res.status(200).json({
                error: null,
                data: { ...operation, balance: (account as Account).balance },
            });
        } catch {
            return res.status(400).json({ error: "Deposit wasn't successfull" });
        }
    };
}
