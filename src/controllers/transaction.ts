import { Request, Response } from 'express';
import { getRepository, getManager } from 'typeorm';
import { validateOrReject } from 'class-validator';
import _unset from 'lodash/unset';

import { Transaction, Account } from '@entities';
import { findEntityById } from '@utils/ormHelpers';

export class TransactionController {
    static makeTransaction = async (req: Request, res: Response) => {
        try {
            // check if the account ids are same

            const { senderAccountId, receiverAccountId, amount } = req.body;

            if (senderAccountId === receiverAccountId) throw new Error();

            let senderAccount = await findEntityById(getRepository(Account), senderAccountId);
            let receiverAccount = await findEntityById(getRepository(Account), receiverAccountId);

            senderAccount.balance -= amount;
            receiverAccount.balance += amount;

            await validateOrReject(senderAccount);
            await validateOrReject(receiverAccount);

            const tempTransaction = Transaction.create({
                amount,
                receiverAccount,
                senderAccount,
            });

            await validateOrReject(tempTransaction);

            const transactionRes = await getManager().transaction(async transactionManager => {
                return transactionManager.save([tempTransaction, senderAccount, receiverAccount]);
            });

            _unset(transactionRes[0], '__senderAccount__');
            _unset(transactionRes[0], '__receiverAccount__');

            return res.status(200).json({
                error: null,
                data: transactionRes[0],
            });
        } catch (e) {
            console.log(e);
            return res.status(400).json({ error: "Transaction wasn't successfull" });
        }
    };

    static transactions = async (req: Request, res: Response) => {
        try {
            const account = await findEntityById(getRepository(Account), req.params.accountId);
            const transactions = await Transaction.find({
                where: [{ senderAccount: account }, { receiverAccount: account }],
            });

            const updatedTransactions = await Promise.all(
                transactions.map(async transaction => {
                    const senderAccount = await transaction.senderAccount;
                    _unset(transaction, '__senderAccount__');
                    _unset(transaction, '__has_senderAccount__');
                    return {
                        ...transaction,
                        isSent: req.params.accountId === senderAccount.accountNo,
                    };
                })
            );

            return res.status(200).json({
                error: null,
                data: updatedTransactions,
            });
        } catch (e) {
            return res.status(400).json({ error: "Transactions wasn't shown" });
        }
    };
}
