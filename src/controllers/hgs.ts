import axios from 'axios';

import { Customer, Account } from '@entities';

import { RequestHandler } from '@appTypes';
import { HGS_API_URL } from '@config';

export class HGSController {
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

    static registerNewCard: RequestHandler<Promise<any>> = async (req, res) => {
        let TCKN, account;
        const { amount, accountNo } = req.body;
        try {
            account = await Account.findOneOrFail({ accountNo });
            TCKN = (await account.customer).TCKN;
        } catch (error) {
            return res.status(400).send({ error });
        }

        try {
            await axios.get(`${HGS_API_URL}/card/${TCKN}`);

            const responseFromHSGApi = await axios.post(`${HGS_API_URL}/card`, {
                TCKN,
                amount,
            });
            if (responseFromHSGApi.status === 200) {
                await account.withdraw(amount);
                return res.status(200).send(responseFromHSGApi.data);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log('buraya geldim');
                try {
                    const responseFromHSGApi = await axios.post(`${HGS_API_URL}/subscriber`, {
                        TCKN,
                        amount,
                    });
                    if (responseFromHSGApi.status === 200) {
                        await account.withdraw(amount);
                        return res.send(responseFromHSGApi.data);
                    }
                } catch (error) {
                    return res.status(400).send({ error });
                }
            }
            return res.status(400).send({ error });
        }
    };
}
