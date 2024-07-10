-- CreateTable
CREATE TABLE "SectionToGroups" (
    "sectionId" UUID NOT NULL,
    "groupId" UUID NOT NULL,

    CONSTRAINT "SectionToGroups_pkey" PRIMARY KEY ("sectionId","groupId")
);

-- AddForeignKey
ALTER TABLE "SectionToGroups" ADD CONSTRAINT "SectionToGroups_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionToGroups" ADD CONSTRAINT "SectionToGroups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
