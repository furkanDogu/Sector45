import {
    Entity,
    Column,
    PrimaryColumn,
    ManyToOne,
    BeforeInsert,
    BaseEntity,
    OneToMany,
} from 'typeorm';
import { Min, IsBoolean, IsNotEmpty } from 'class-validator';

import { Customer, Transaction, Operation } from '@entities';
import { Lazy } from '@utils/ormHelpers';

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
        console.log('address', await customer.address);
        const [accounts, count] = await Account.findAndCount({
            where: { customer: { customerNo: customer.customerNo } },
        });
        this.accountNo = `${customer.TCKN.slice(9)}${customer.customerNo}${1000 + count}`;
        this.isActive = true;
    }
}
