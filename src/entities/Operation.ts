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

    @Min(0.1)
    @Column('money')
    @IsNumber()
    amount: number;

    @Column()
    isDeposit: boolean;

    @CreateDateColumn()
    date: Date;

    @Column('varchar', { length: 255 })
    description: string;

    @ManyToOne(() => Account, account => account.operations, { lazy: true })
    account: Lazy<Account>;
}
