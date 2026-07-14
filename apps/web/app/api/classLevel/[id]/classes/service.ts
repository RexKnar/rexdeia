import { authOptions } from 'lib/auth';
import { db } from 'lib/db';
import { getServerSession } from 'next-auth';

function romanToDecimal(roman: string): number {
  const romanMap: Record<string, number> = {
    I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000
  };
  
  let total = 0;
  let prevValue = 0;
  
  for (let i = roman.length - 1; i >= 0; i--) {
    const char = roman[i].toUpperCase();
    const currentValue = romanMap[char];
    if (!currentValue) continue;
    
    if (currentValue < prevValue) {
      total -= currentValue;
    } else {
      total += currentValue;
    }
    prevValue = currentValue;
  }
  
  return total;
}

const prePrimaryMap: Record<string, number> = {
  'NURSERY': -4,
  'PREKG': -3,
  'PRE-KG': -3,
  'LKG': -2,
  'UKG': -1,
  'KG': -1
};

function getClassSortOrder(className: string): number {
  const upperName = className.trim().toUpperCase();
  for (const [key, val] of Object.entries(prePrimaryMap)) {
    if (upperName.includes(key)) {
      return val;
    }
  }
  
  const romanRegex = /^[IVXLCDM]+$/i;
  const words = className.split(/[\s-]+/);
  for (const word of words) {
    const cleanWord = word.trim().toUpperCase();
    if (romanRegex.test(cleanWord)) {
      const val = romanToDecimal(cleanWord);
      if (val > 0) return val;
    }
  }
  
  const matchDigits = className.match(/\d+/);
  if (matchDigits) {
    return parseInt(matchDigits[0], 10);
  }
  
  return 999;
}

function sortClasses(classes: any[]) {
  return [...classes].sort((a, b) => {
    const orderA = getClassSortOrder(a.name);
    const orderB = getClassSortOrder(b.name);
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return a.name.localeCompare(b.name);
  });
}

export async function getClassListByClassLevelId(classLevelId: string) {
  const session = await getServerSession(authOptions);

  const { branchId } = session;

  const classes = await db.class.findMany({
    where: {
      classLevelId,
      branchId,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      isActive: true,
      Section: {
        select: {
          id: true,
          name: true,
          isActive: true,
        },
      },
    },
  });

  return sortClasses(classes);
}
