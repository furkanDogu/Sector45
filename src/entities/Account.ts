import {
    Entity,
    Column,
    PrimaryColumn,
    ManyToOne,
    BeforeInsert,
    BaseEntity,
    OneToMany,
    getManager,
} from 'typeorm';
import { Min, IsBoolean, IsNotEmpty, validateOrReject, IsNumber } from 'class-validator';
import { plainToClass } from 'class-transformer';
import _unset from 'lodash/unset';

import { Customer, Transaction, Operation } from '@entities';
import { Lazy } from '@utils/ormHelpers';

@Entity()
export class Account extends BaseEntity {
    @PrimaryColumn()
    accountNo: string;

    @Min(0)
    @Column('money')
    @IsNumber()
    balance: number = 0;

    @IsBoolean()
    @Column()
    isActive: boolean = true;

    @Column('varchar', { length: 255 })
    code: string;

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
        this.code = `${1000 + count}`;
        this.accountNo = `${customer.TCKN.slice(9)}${customer.customerNo}${this.code}`;
        this.isActive = true;
    }

    async withdraw(amount: number, description: string, source: string) {
        let account: Account | undefined;
        let operation = await getManager().transaction(async transaction => {
            this.balance -= amount;
            await validateOrReject(plainToClass(Account, this));
            account = await transaction.save(this);

            let tempOpr = Operation.create({
                account,
                description,
                amount,
                source,
                isDeposit: false,
            });
            await validateOrReject(tempOpr);

            return transaction.save(tempOpr);
        });
        _unset(operation, '__account__');

        return { ...operation, balance: (account as Account).balance };
    }

    async deposit(amount: number, source: string, description?: string) {
        let account: Account | undefined;
        let operation = await getManager().transaction(async transaction => {
            this.balance += amount;
            await validateOrReject(this);
            account = await transaction.save(this);

            let tempOpr = Operation.create({
                account,
                amount,
                source,
                isDeposit: true,
                description: description ? description : `${amount} Lira is added to the account.`,
            });
            await validateOrReject(tempOpr);

            return transaction.save(tempOpr);
        });
        _unset(operation, '__account__');

        return { ...operation, balance: (account as Account).balance };
    }
}
