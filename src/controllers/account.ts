import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import _unset from 'lodash/unset';

import { findEntityById } from '@utils/ormHelpers';
import { Customer, Account } from '@entities';

export class AccountController {
    static newAccount = async (customerId: number) => {
        let account;
        try {
            account = await Account.create({
                customer: await findEntityById(getRepository(Customer), customerId),
            }).save();
            _unset(account, '__customer__');
        } catch {}

        return account;
    };
    static getNewAccount = async (req: Request, res: Response) => {
        if (!req.params.customerId) {
            return res.status(400).json({
                error: `Customer id wasn't provided`,
            });
        }
        const acc = await AccountController.newAccount(parseInt(req.params.customerId));
        if (!acc) {
            return res.status(400).json({
                error: 'Account is not created',
            });
        }

        res.status(200).json({
            data: acc,
            error: null,
        });
    };
    static closeAccount = async (req: Request, res: Response) => {
        let account;
        try {
            account = await findEntityById(getRepository(Account), req.params.accountId);
            // if ((await account.customer).customerNo !== parseInt(res.locals['customerNo']))
            //     throw new Error();
            if (account.balance > 0) throw new Error();
            account.isActive = false;
            await account.save();

            return res.status(200).json({
                error: null,
                data: account,
            });
        } catch {
            return res.status(400).json({
                error: 'Account is not closed',
            });
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
