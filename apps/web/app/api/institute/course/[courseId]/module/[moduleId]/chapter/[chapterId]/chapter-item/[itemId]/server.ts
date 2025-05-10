import { db } from 'lib/db';

export const updateChapterItem = async (chapterItemId, payload) => {
  // const { name, icon, description, itemType } = payload;
  let payloadData = {};
  if (payload?.youtubeUrl) {
    payloadData['youtubeUrl'] = payload.youtubeUrl;
  }
  if (payload?.vimeoUrl) {
    payloadData['vimeoUrl'] = payload.vimeoUrl;
  }
  if (payload?.videoUrl) {
    payloadData['videoUrl'] = payload.videoUrl;
  }
  if (payload?.pdfUrl) {
    payloadData['pdfUrl'] = payload.pdfUrl;
  }
  if (payload?.textContent) {
    payloadData['textContent'] = payload.textContent;
  }
  if (payload?.imageUrl) {
    payloadData['imageUrl'] = payload.imageUrl;
  }
  if (payload?.name) {
    payloadData['name'] = payload.name;
  }
  if (payload?.icon) {
    payloadData['icon'] = payload.icon;
  }
  if (payload?.description) {
    payloadData['description'] = payload.description;
  }
  if (payload?.itemType) {
    payloadData['itemType'] = payload.itemType;
  }

  return db.instituteCourseChapterItem.update({
    where: {
      id: chapterItemId,
    },
    data: payloadData,
  });
};

export const getChapterItemById = async (chapterItemId) => {
  return await db.instituteCourseChapterItem.findUnique({
    where: {
      id: chapterItemId,
    },
    select: {
      id: true,
      name: true,
      icon: true,
      description: true,
      itemType: true,
      youtubeUrl: true,
      vimeoUrl: true,
      imageUrl: true,
      pdfUrl: true,
      textContent: true,
      videoUrl: true,
      languageId: true,
      language: {
        select: {
          id: true,
          name: true,
          isActive: true,
        },
      },
    },
  });
};
