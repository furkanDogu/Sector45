import {
    Column,
    Entity,
    BeforeInsert,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    OneToMany,
    BaseEntity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Min, Length, IsNotEmpty } from 'class-validator';
import bcrypt from 'bcrypt';

import { Address, Account } from '@entities';
import { Lazy } from '@utils/ormHelpers';

@Entity()
export class Customer extends BaseEntity {
    @PrimaryGeneratedColumn()
    customerNo: number;

    @Length(11, 11)
    @Column('varchar', {
        length: 11,
        unique: true,
    })
    TCKN: string;

    @Length(8, 255)
    @Column('varchar', {
        length: 255,
    })
    password: string;

    @Min(0)
    @Column('money')
    salary: number;

    @Length(2, 255)
    @Column('varchar', { length: 255 })
    name: string;

    @Length(2, 255)
    @Column('varchar', { length: 255 })
    surname: string;

    @Column('datetime', { nullable: false })
    dateOfBirth: Date;

    @IsNotEmpty()
    @OneToOne(() => Address, address => address.customer, { lazy: true })
    @JoinColumn()
    address: Lazy<Address>;

    @OneToMany(() => Account, account => account.customer, { lazy: true })
    accounts: Lazy<Account[]>;

    @CreateDateColumn()
    dateCreated: Date;

    @UpdateDateColumn()
    dateUpdated: Date;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 8);
    }
}
