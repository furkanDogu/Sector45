import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { Customer, Address } from '@entities';
import { JWT_SECRET } from '@config';
import { modifyErrMsg, findEntityById } from '@utils/ormHelpers';
import { AccountController } from './account';

//Müşteri ve adres bilgilerini response objeleri içerisinden al.
// Objelerden dönen bilgileri validate ile kontrol et.
// Doğrulanan bilgiler veritabanına gönderilmek üzere obje halleri save edilecek.
// Veritabanı kayıt işlemleri  gerçekleştirdikten sonra kullanıcıya online kalabilmesi adına
//token döneceğiz.
export class CustomerController {
    static register = async (req: Request, res: Response) => {
        let address, customer;
        try {
            await validateOrReject(plainToClass(Address, req.body.address));
            address = await Address.create(req.body.address).save();
            delete req.body.address;
        } catch (e) {
            res.status(400).json({ error: modifyErrMsg(e) });
            return;
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
            res.status(400).json({ error: modifyErrMsg(e) });
            return;
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

    //Müşteri TCKN ve şifre bilgilerini request obje içerisine al.
    //TCKN database üzerinde var ise mevcut TCKN'ye ait şifreyi eldeki şifre ile karşılaştır.
    //Mevcut bilgiler için bir token oluştur.
    static login = async (req: Request, res: Response) => {
        const error = 'Login Information is not valid';
        const customer = await Customer.findOne({
            where: { TCKN: req.body.TCKN },
        });

        if (!customer) {
            res.status(401).json({ error });
            return;
        }

        if (!(await bcrypt.compare(req.body.password, customer.password))) {
            res.status(401).json({ error });
            return;
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
