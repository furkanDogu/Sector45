import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddressMigration1569751974757 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "address" ("id" int NOT NULL IDENTITY(1,1), "city" varchar(255) NOT NULL, "street" varchar(255) NOT NULL, "district" varchar(255) NOT NULL, "no" varchar(255) NOT NULL, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(`ALTER TABLE "customer" ADD "addressId" int`, undefined);
        await queryRunner.query(
            `CREATE UNIQUE INDEX "REL_7697a356e1f4b79ab3819839e9" ON "customer" ("addressId") WHERE "addressId" IS NOT NULL`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "customer" ADD CONSTRAINT "FK_7697a356e1f4b79ab3819839e95" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `ALTER TABLE "customer" DROP CONSTRAINT "FK_7697a356e1f4b79ab3819839e95"`,
            undefined
        );
        await queryRunner.query(
            `DROP INDEX "REL_7697a356e1f4b79ab3819839e9" ON "customer"`,
            undefined
        );
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "addressId"`, undefined);
        await queryRunner.query(`DROP TABLE "address"`, undefined);
    }
}
