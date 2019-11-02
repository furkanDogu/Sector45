import axios from 'axios';

import { Customer, Account } from '@entities';

import { RequestHandler } from '@appTypes';
import { HGS_API_URL } from '@config';

export class HGSController {
    static register: RequestHandler<Promise<any>> = async (req, res) => {
        try {
            const { accountNo, amount } = req.body;

            const account = await Account.findOneOrFail({ accountNo });
            const TCKN = (await account.customer).TCKN;

            const responseFromHSGApi = await axios.post(`${HGS_API_URL}/subscriber`, {
                TCKN,
                amount,
            });
            if (responseFromHSGApi.status === 200) {
                await account.withdraw(amount);
                return res.send(responseFromHSGApi.data);
            }
            throw new Error('An error occured in HGS API');
        } catch (error) {
            res.status(400).send({ error });
        }
    };

    static deposit: RequestHandler<Promise<any>> = async (req, res) => {
        try {
            const { accountNo, amount, cardId } = req.body;

            const account = await Account.findOneOrFail({ accountNo });

            const responseFromHSGApi = await axios.post(`${HGS_API_URL}/operation`, {
                cardId,
                amount,
            });
            if (responseFromHSGApi.status === 200) {
                await account.withdraw(amount);
                return res.send(responseFromHSGApi.data);
            }
            throw new Error('An error occured in HGS API');
        } catch (error) {
            res.status(400).send({ error });
        }
    };

    static newCard: RequestHandler<Promise<any>> = async (req, res) => {
        try {
            const { amount, accountNo } = req.body;

            const account = await Account.findOneOrFail({ accountNo });
            const TCKN = (await account.customer).TCKN;

            const responseFromHSGApi = await axios.post(`${HGS_API_URL}/card`, {
                TCKN,
                amount,
            });

            if (responseFromHSGApi.status === 200) {
                await account.withdraw(amount);
                return res.status(200).send(responseFromHSGApi.data);
            }
            throw new Error('An error occured in HGS API');
        } catch (error) {
            res.status(400).send({ error });
        }
    };
}
