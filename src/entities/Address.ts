import { Entity, Column, OneToOne, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

import { Customer } from '@entities';
import { Lazy } from '@utils/ormHelpers';

@Entity()
export class Address extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column('varchar', { length: 255 })
    city: string;

    @IsNotEmpty()
    @Column('varchar', { length: 255 })
    street: string;

    @IsNotEmpty()
    @Column('varchar', { length: 255 })
    district: string;

    @IsNotEmpty()
    @Column('varchar', { length: 255 })
    no: number;

    @OneToOne(() => Customer, customer => customer.address, { lazy: true })
    customer: Lazy<Customer>;
}
