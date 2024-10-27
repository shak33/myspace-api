/*
  Warnings:

  - Added the required column `key` to the `ProfilePicture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProfilePicture" ADD COLUMN     "key" VARCHAR(255) NOT NULL;
