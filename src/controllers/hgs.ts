import axios from 'axios';

import { Account } from '@entities';

import { RequestHandler } from '@appTypes';
import { HGS_API_URL } from '@config';

export class HGSController {
    static deposit: RequestHandler<Promise<any>> = async (req, res) => {
        const { accountNo, amount, cardId, source } = req.body;
        let account;
        try {
            account = await Account.findOneOrFail({ accountNo });

            await account.withdraw(
                amount,
                `${amount} is paid for HGS Card with ID ${cardId}`,
                source
            );

            const responseFromHSGApi = await axios.post(`${HGS_API_URL}/operation`, {
                cardId,
                amount,
            });

            return res.send(responseFromHSGApi.data);
        } catch (error) {
            if (account && error.config && error.config.url === `${HGS_API_URL}/operation`) {
                await account.deposit(
                    amount,
                    source,
                    `${amount} Lira is added back to the account because of failed hgs deposit`
                );
                res.status(400).send({ error: 'hgs operation failed' });
            }
            res.status(400).send({ error });
        }
    };

    static registerNewCard: RequestHandler<Promise<any>> = async (req, res) => {
        let TCKN, account;
        const { amount, accountNo, source } = req.body;
        try {
            account = await Account.findOneOrFail({ accountNo });
            TCKN = (await account.customer).TCKN;
        } catch (error) {
            return res.status(400).send({ error });
        }

        try {
            await account.withdraw(amount, `${amount} Lira is paid for new HGS Card`, source);
        } catch (error) {
            return res.status(400).send({ error });
        }

        try {
            await axios.get(`${HGS_API_URL}/card/${TCKN}`);

            const responseFromHSGApi = await axios.post(`${HGS_API_URL}/card`, {
                TCKN,
                amount,
            });

            return res.status(200).send(responseFromHSGApi.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                try {
                    const responseFromHSGApi = await axios.post(`${HGS_API_URL}/subscriber`, {
                        TCKN,
                        amount,
                    });

                    return res.send(responseFromHSGApi.data);
                } catch (error) {
                    await account.deposit(
                        amount,
                        source,
                        `${amount} is added back to the account because of failed new hgs card operation`
                    );

                    return res.status(400).send({ error });
                }
            }
            await account.deposit(
                amount,
                source,
                `${amount} is added back to the account because of failed new hgs card operation`
            );
            return res.status(400).send({ error });
        }
    };
}
