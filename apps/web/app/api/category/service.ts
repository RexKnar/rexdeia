import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';
import {
  CategoryModel,
  UpdateCategoryModel,
} from '../../../lib/domain/category';

export async function getCategoryList(page: number, limit: number) {
  const session = await getServerSession(authOptions);
  const [categoryList, totalCategory] = await Promise.all([
    db.category.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        isDeleted: false,
        branchId: session.branchId,
      },
    }),
    db.category.count({
      where: {
        isDeleted: false,
        branchId: session.branchId,
      },
    }),
  ]);

  return {
    page,
    limit,
    data: categoryList,
    total: totalCategory,
  };
}

export async function getCategoryById(id: string) {
  return await db.category.findUnique({
    where: {
      id: id,
    },
  });
}

export async function addCategory(category: CategoryModel) {
  const session = await getServerSession(authOptions);
  return db.category.create({
    data: {
      name: category.name,
      isActive: category.isActive,
      parent: category.parent,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
  });
}

export async function updateCategoryById(
  categoryId: string,
  category: UpdateCategoryModel
) {
  const session = await getServerSession(authOptions);

  return await db.category.update({
    data: {
      name: category.name,
      isActive: category.isActive,
      parent: category.parent,
      branch: {
        connect: {
          id: session.branchId,
        },
      },
    },
    where: {
      id: categoryId,
    },
  });
}
export async function deleteCategory(categoryId: string) {
  return db.category.update({
    where: {
      id: categoryId,
    },
    data: {
      isDeleted: true,
    },
  });
}
