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
import { Min, IsNumber } from 'class-validator';

@Entity()
export class Operation extends BaseEntity {
    @PrimaryGeneratedColumn()
    operationId: number;

    @Min(1)
    @Column('money')
    @IsNumber()
    amount: number;

    @Column()
    isDeposit: boolean;

    @CreateDateColumn()
    date: Date;

    @ManyToOne(() => Account, account => account.operations, { lazy: true })
    account: Lazy<Account>;
}
