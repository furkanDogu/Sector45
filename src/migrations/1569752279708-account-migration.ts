import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccountMigration1569752279708 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "account" ("accountNo" nvarchar(255) NOT NULL, "balance" money NOT NULL, "isActive" bit NOT NULL, "customerCustomerNo" int, CONSTRAINT "PK_edfff9da7b1ffe443faeaf375b0" PRIMARY KEY ("accountNo"))`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "account" ADD CONSTRAINT "FK_97440483dff99209eee1404bcc7" FOREIGN KEY ("customerCustomerNo") REFERENCES "customer"("customerNo") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `ALTER TABLE "account" DROP CONSTRAINT "FK_97440483dff99209eee1404bcc7"`,
            undefined
        );
        await queryRunner.query(`DROP TABLE "account"`, undefined);
    }
}
