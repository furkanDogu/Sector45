import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustomerMigration1569751679703 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "customer" ("customerNo" int NOT NULL IDENTITY(1,1), "TCKN" varchar(11) NOT NULL, "password" varchar(255) NOT NULL, "salary" money NOT NULL, "name" varchar(255) NOT NULL, "surname" varchar(255) NOT NULL, "dateOfBirth" datetime NOT NULL, "dateCreated" datetime2 NOT NULL CONSTRAINT "DF_331bdfee3dd52f0663dc2496a52" DEFAULT getdate(), "dateUpdated" datetime2 NOT NULL CONSTRAINT "DF_565d7c6c067d561cf8d7ce38cf2" DEFAULT getdate(), CONSTRAINT "UQ_0e8d46038d0923e39e5ccc8ae05" UNIQUE ("TCKN"), CONSTRAINT "PK_9141b25849a87037c30fa291322" PRIMARY KEY ("customerNo"))`,
            undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "customer"`, undefined);
    }
}
