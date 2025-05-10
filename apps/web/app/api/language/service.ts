import { LanguageModel } from 'lib/domain/language';

import { db } from '../../../lib/db';

export async function addLanguage(payload: LanguageModel) {
  const { name, isActive } = payload;

  return await db.language.create({
    data: {
      name,
      isActive,
    },
  });
}

export async function getAllLanguage() {
  return await db.language.findMany({
    where: {
      isDeleted: false,
    },
  });
}

export async function getLanguageById(id: string) {
  return await db.language.findMany({
    where: {
      id: id,
      isDeleted: false,
    },
  });
}

export async function updateLanguageById(id: string, payload: LanguageModel) {
  const { name, isActive } = payload;

  return await db.language.update({
    where: {
      id: id,
    },
    data: {
      name: name,
      isActive: isActive,
    },
  });
}

export async function deleteLanguageById(id: string) {
  return await db.language.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
      updatedAt: new Date(),
    },
  });
}
