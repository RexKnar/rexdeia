-- AlterTable
ALTER TABLE "InstituteCourseChapterItem" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "itemType" TEXT NOT NULL DEFAULT 'text',
ADD COLUMN     "pdfUrl" TEXT,
ADD COLUMN     "textContent" TEXT,
ADD COLUMN     "videoUrl" TEXT,
ADD COLUMN     "vimeoUrl" TEXT,
ADD COLUMN     "youtubeUrl" TEXT;

-- CreateTable
CREATE TABLE "Quiz" (
    "_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "instruction" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "QuizChapterItemMapping" (
    "chapterItemId" UUID NOT NULL,
    "quizId" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "_id" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "explanation" TEXT,
    "maxTime" INTEGER,
    "minTime" INTEGER,
    "points" INTEGER,
    "negativePoints" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "QuizOptions" (
    "_id" UUID NOT NULL,
    "option" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "explanation" TEXT,
    "quizQuestionId" UUID NOT NULL,

    CONSTRAINT "QuizOptions_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuizChapterItemMapping_chapterItemId_quizId_key" ON "QuizChapterItemMapping"("chapterItemId", "quizId");

-- AddForeignKey
ALTER TABLE "QuizChapterItemMapping" ADD CONSTRAINT "QuizChapterItemMapping_chapterItemId_fkey" FOREIGN KEY ("chapterItemId") REFERENCES "InstituteCourseChapterItem"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizChapterItemMapping" ADD CONSTRAINT "QuizChapterItemMapping_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizOptions" ADD CONSTRAINT "QuizOptions_quizQuestionId_fkey" FOREIGN KEY ("quizQuestionId") REFERENCES "QuizQuestion"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
