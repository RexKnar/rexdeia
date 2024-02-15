import { getServerSession } from 'next-auth';

import { authOptions } from '../../../lib/auth';
import { db } from '../../../lib/db';
import {
  CreateCategoryModel,
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
      include: {
        parentCategory: true,
        childCategories: true,
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
  return db.category.findUnique({
    where: {
      id: id,
      isActive: true,
    },
    include: {
      childCategories: true,
    },
  });
}

export async function addCategory(
  parentId: string | null | undefined,
  category: CreateCategoryModel
) {
  const session = await getServerSession(authOptions);
  const data = {
    name: category.name,
    isActive: category.isActive,
    branch: {
      connect: {
        id: session.branchId,
      },
    },
  };

  if (parentId !== null && parentId !== undefined) {
    data['parentCategory'] = {
      connect: {
        id: parentId,
      },
    };
  }

  return db.category.create({
    data,
  });
}

export async function updateCategoryById(
  categoryId: string,
  category: UpdateCategoryModel
) {
  const session = await getServerSession(authOptions);

  return db.category.update({
    data: {
      name: category.name,
      isActive: category.isActive,
      parentCategory: {
        connect: {
          id: category.parentId,
        },
      },
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
