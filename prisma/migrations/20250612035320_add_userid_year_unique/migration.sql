/*
  Warnings:

  - A unique constraint covering the columns `[userId,year]` on the table `Questionnaire` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Questionnaire_userId_year_key" ON "Questionnaire"("userId", "year");
