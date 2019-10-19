import {
    BaseEntity,
    Entity,
    Column,
    ManyToOne,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    BeforeInsert,
    getRepository,
} from 'typeorm';
import { IsNotEmpty, Min, IsNumber } from 'class-validator';

import { Account } from '@entities';
import { findEntityById, Lazy } from '@utils/ormHelpers';

@Entity()
export class Transaction extends BaseEntity {
    @PrimaryGeneratedColumn()
    transactionNo: number;

    @Min(1)
    @Column('money')
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @ManyToOne(() => Account, account => account.transactions, { lazy: true })
    senderAccount: Lazy<Account>;

    @IsNotEmpty()
    @ManyToOne(() => Account, account => account.transactions, { lazy: true })
    receiverAccount: Lazy<Account>;

    @CreateDateColumn()
    date: Date;

    @Column()
    isLocal: boolean;

    @BeforeInsert()
    async setIsLocal() {
        this.date = new Date();
        const sender = await findEntityById(
            getRepository(Account),
            (await this.senderAccount).accountNo
        );
        const receiver = await findEntityById(
            getRepository(Account),
            (await this.receiverAccount).accountNo
        );

        this.isLocal = (await sender.customer).customerNo === (await receiver.customer).customerNo;
    }
}
