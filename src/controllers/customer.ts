import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { Customer, Address } from '@entities';
import { JWT_SECRET } from '@config';
import { modifyErrMsg } from '@utils/ormHelpers';
import { RequestHandler } from '@appTypes';
import { AccountController } from './account';

export class CustomerController {
    static register: RequestHandler<Promise<any>> = async (req, res) => {
        let address, customer;
        try {
            await validateOrReject(plainToClass(Address, req.body.address));
            address = await Address.create(req.body.address).save();
            delete req.body.address;
        } catch (e) {
            return res.status(400).json({ error: modifyErrMsg(e) });
        }

        try {
            await validateOrReject(plainToClass(Customer, req.body));
            customer = await Customer.create({
                ...req.body,
                address,
            }).save();
            // create account to the customer with customerId
            if (!(await AccountController.newAccount(customer.customerNo))) {
                throw new Error();
            }
            await customer.accounts;
            delete customer.password;
        } catch (e) {
            return res.status(400).json({ error: modifyErrMsg(e) });
        }

        res.status(200).json({
            token: jwt.sign(
                {
                    customerNo: customer.customerNo,
                },
                JWT_SECRET,
                { expiresIn: 36000000 }
            ),
            data: customer,
            error: null,
        });
    };

    static login: RequestHandler<Promise<any>> = async (req, res) => {
        const error = 'Login Information is not valid';
        const customer = await Customer.findOne({
            where: { TCKN: req.body.TCKN },
        });

        if (!customer) {
            return res.status(401).json({ error });
        }

        if (!(await bcrypt.compare(req.body.password, customer.password))) {
            return res.status(401).json({ error });
        }

        delete customer.password;
        res.status(200).json({
            token: jwt.sign(
                {
                    customerNo: customer.customerNo,
                },
                JWT_SECRET,
                { expiresIn: 36000000 }
            ),
            data: customer,
            error: null,
        });
    };
}
