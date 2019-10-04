import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { Customer, Address } from '@entities';
import { JWT_SECRET } from '@config';

//Müşteri ve adres bilgilerini response objeleri içerisinden al.
// Objelerden dönen bilgileri validate ile kontrol et.
// Doğrulanan bilgiler veritabanına gönderilmek üzere obje halleri save edilecek.
// Veritabanı kayıt işlemleri  gerçekleştirdikten sonra kullanıcıya online kalabilmesi adına
//token döneceğiz.
export class CustomerController {
    static register = async (req: Request, res: Response, next: NextFunction) => {
        if (
            !req.body.address ||
            (await validate(Object.create(Address, req.body.address))).length > 0
        ) {
            res.status(403).json({ data: 'Address information is not valid' });
            return;
        }
        const address = await Address.create(req.body.address).save();
        delete req.body.address;

        if ((await validate(Object.create(Customer, req.body))).length > 0) {
            res.status(403).json({ data: 'Customer information is not valid' });
            return;
        }
        const { password, ...customer } = await Customer.create({
            ...req.body,
            address,
        }).save();

        res.status(200).json({
            token: jwt.sign(
                {
                    customerNo: customer.customerNo,
                },
                JWT_SECRET,
                { expiresIn: 36000000 }
            ),
            data: customer,
        });
    };

    //Müşteri TCKN ve şifre bilgilerini request obje içerisine al.
    //TCKN database üzerinde var ise mevcut TCKN'ye ait şifreyi eldeki şifre ile karşılaştır.
    //Mevcut bilgiler için bir token oluştur.
    static login = async (req: Request, res: Response, next: NextFunction) => {
        const customer = await Customer.findOne({
            where: { TCKN: req.body.TCKN },
        });

        if (!customer) {
            res.status(401).json({ data: 'Login Information is not valid' });
            return;
        }

        if (await bcrypt.compare(req.body.password, customer.password)) {
            res.status(200).json({
                token: jwt.sign(
                    {
                        customerNo: customer.customerNo,
                    },
                    JWT_SECRET,
                    { expiresIn: 36000000 }
                ),
                data: customer,
            });
            return;
        }

        res.status(401).json({ data: 'Login Information is not valid' });
    };
}
