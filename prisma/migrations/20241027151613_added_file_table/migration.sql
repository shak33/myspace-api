-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "fileType" VARCHAR(50) NOT NULL,
    "size" INTEGER NOT NULL,
    "profileId" INTEGER,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_profileId_key" ON "File"("profileId");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
