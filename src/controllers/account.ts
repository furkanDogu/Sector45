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
        } catch (e) {
            return res.status(400).json({
                error: 'Account is not closed',
            });
        }
    };

    static accounts = async (req: Request, res: Response) => {
        let customer;
        customer = await findEntityById(getRepository(Customer), req.params.customerId);
        if (!customer) {
            return res.status(400).json({
                error: 'Customer is not found',
            });
        }

        return res.status(200).json({
            error: null,
            data: await customer.accounts,
        });
    };
}
