import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    BaseEntity,
} from 'typeorm';

import { Account } from '@entities';

import { Lazy } from '@utils/ormHelpers';

@Entity()
export class Operation extends BaseEntity {
    @PrimaryGeneratedColumn()
    operationId: number;

    @Column('money')
    amount: number;

    @Column()
    isDeposit: boolean;

    @CreateDateColumn()
    date: Date;

    @ManyToOne(() => Account, account => account.operations, { lazy: true })
    account: Lazy<Account>;
}
