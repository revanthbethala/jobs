/*
  Warnings:

  - You are about to drop the column `level` on the `Education` table. All the data in the column will be lost.
  - Added the required column `educationLevel` to the `Education` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Education" DROP COLUMN "level",
ADD COLUMN     "educationLevel" VARCHAR(50) NOT NULL;
