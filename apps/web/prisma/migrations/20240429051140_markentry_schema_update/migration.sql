-- CreateTable
CREATE TABLE "_MarkEntryToSubject" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MarkEntryToSubject_AB_unique" ON "_MarkEntryToSubject"("A", "B");

-- CreateIndex
CREATE INDEX "_MarkEntryToSubject_B_index" ON "_MarkEntryToSubject"("B");

-- AddForeignKey
ALTER TABLE "_MarkEntryToSubject" ADD CONSTRAINT "_MarkEntryToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "MarkEntry"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MarkEntryToSubject" ADD CONSTRAINT "_MarkEntryToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
