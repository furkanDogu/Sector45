import { getRepository } from 'typeorm';

import { Account } from '@entities';

import { RequestHandler } from '@appTypes';
import { findEntityById } from '@utils/ormHelpers';

export class OperationController {
    static withdraw: RequestHandler<Promise<any>> = async (req, res) => {
        try {
            const account = await findEntityById(getRepository(Account), req.body.accountNo);
            if (!account.isActive) throw new Error();

            let operation = await account.withdraw(req.body.amount);

            return res.status(200).json({
                error: null,
                data: operation,
            });
        } catch {
            return res.status(400).json({ error: "Withdraw wasn't successfull" });
        }
    };
    static deposit: RequestHandler<Promise<any>> = async (req, res) => {
        try {
            const account = await findEntityById(getRepository(Account), req.body.accountNo);
            if (!account.isActive) throw new Error();

            let operation = await account.deposit(req.body.amount);

            return res.status(200).json({
                error: null,
                data: operation,
            });
        } catch {
            return res.status(400).json({ error: "Deposit wasn't successfull" });
        }
    };

    static operations: RequestHandler<Promise<any>> = async (req, res) => {
        let account;
        try {
            account = await findEntityById(getRepository(Account), req.params.accountNo);
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
