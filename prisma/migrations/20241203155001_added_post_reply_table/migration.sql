-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "content" SET DATA TYPE VARCHAR(6400);

-- CreateTable
CREATE TABLE "PostReply" (
    "id" SERIAL NOT NULL,
    "postReplyId" TEXT NOT NULL,
    "content" VARCHAR(800) NOT NULL,
    "postId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostReply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostReply_postReplyId_key" ON "PostReply"("postReplyId");

-- CreateIndex
CREATE UNIQUE INDEX "PostReply_postId_key" ON "PostReply"("postId");

-- AddForeignKey
ALTER TABLE "PostReply" ADD CONSTRAINT "PostReply_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
