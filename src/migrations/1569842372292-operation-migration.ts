import { MigrationInterface, QueryRunner } from 'typeorm';

export class OperationMigration1569842372292 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "operation" ("operationId" int NOT NULL IDENTITY(1,1), "amount" money NOT NULL, "isDeposit" bit NOT NULL, "date" datetime2 NOT NULL CONSTRAINT "DF_ca6a9fd231853c93e70471281c3" DEFAULT getdate(), "accountAccountNo" nvarchar(255), CONSTRAINT "PK_10583e3e1a51213835fa630e69a" PRIMARY KEY ("operationId"))`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "operation" ADD CONSTRAINT "FK_b970a098793aa09083a5246ce56" FOREIGN KEY ("accountAccountNo") REFERENCES "account"("accountNo") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `ALTER TABLE "operation" DROP CONSTRAINT "FK_b970a098793aa09083a5246ce56"`,
            undefined
        );
        await queryRunner.query(`DROP TABLE "operation"`, undefined);
    }
}
