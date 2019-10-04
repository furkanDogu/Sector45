import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionMigration1569752457566 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "transaction" ("transactionNo" int NOT NULL IDENTITY(1,1), "amount" money NOT NULL, "date" datetime2 NOT NULL CONSTRAINT "DF_f74e18cc3832e2b39ea077a6c84" DEFAULT getdate(), "isLocal" bit NOT NULL, "senderAccountAccountNo" nvarchar(255), "receiverAccountAccountNo" nvarchar(255), CONSTRAINT "PK_ae45cc00d05499ff49b3c202f52" PRIMARY KEY ("transactionNo"))`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD CONSTRAINT "FK_000a77faa655cfcbc1ca010a714" FOREIGN KEY ("senderAccountAccountNo") REFERENCES "account"("accountNo") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" ADD CONSTRAINT "FK_cba32eb9727892214bd55bb5788" FOREIGN KEY ("receiverAccountAccountNo") REFERENCES "account"("accountNo") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP CONSTRAINT "FK_cba32eb9727892214bd55bb5788"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "transaction" DROP CONSTRAINT "FK_000a77faa655cfcbc1ca010a714"`,
            undefined
        );
        await queryRunner.query(`DROP TABLE "transaction"`, undefined);
    }
}
