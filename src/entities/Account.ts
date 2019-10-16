import {
    Entity,
    Column,
    PrimaryColumn,
    ManyToOne,
    BeforeInsert,
    BaseEntity,
    OneToMany,
    getRepository,
} from 'typeorm';
import { Min, IsBoolean, IsNotEmpty } from 'class-validator';
import _unset from 'lodash/unset';

import { Customer, Transaction, Operation } from '@entities';
import { Lazy, findEntityById } from '@utils/ormHelpers';

@Entity()
export class Account extends BaseEntity {
    @PrimaryColumn()
    accountNo: string;

    @Min(0)
    @Column('money')
    balance: number = 0;

    @IsBoolean()
    @Column()
    isActive: boolean = true;

    @IsNotEmpty()
    @ManyToOne(() => Customer, customer => customer.accounts, { lazy: true })
    customer: Lazy<Customer>;

    @OneToMany(() => Transaction, transaction => transaction.receiverAccount, { lazy: true })
    transactions: Lazy<Transaction[]>;

    @OneToMany(() => Operation, operation => operation.account, { lazy: true })
    operations: Lazy<Operation[]>;

    @BeforeInsert()
    async setAccountNo() {
        const customer = await this.customer;
        const [accounts, count] = await Account.findAndCount({
            where: { customer: { customerNo: customer.customerNo } },
        });
        this.accountNo = `${customer.TCKN.slice(9)}${customer.customerNo}${1000 + count}`;
        this.isActive = true;
    }

    async withdraw(amount: number) {
        if (amount < 1 || amount > this.balance || typeof amount !== 'number') {
            return [null, null];
        }
        let operation;

        try {
            this.balance = this.balance - amount;
            operation = await Operation.create({
                amount: amount,
                account: await findEntityById(getRepository(Account), this.accountNo),
                isDeposit: false,
            }).save();
            _unset(operation, '__account__');
        } catch (e) {}
        return [operation, this];
    }

    async deposit(amount: number) {
        let operation;
        if (amount <= 0 || typeof amount !== 'number') {
            return [null, null];
        }

        try {
            this.balance += amount;
            operation = await Operation.create({
                amount: amount,
                account: await findEntityById(getRepository(Account), this.accountNo),
                isDeposit: true,
            }).save();
            _unset(operation, '__account__');
        } catch (e) {}
        return [operation, this];
    }
}
