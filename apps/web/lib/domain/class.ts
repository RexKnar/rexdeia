export type ClassModel = {
  name: string;
  isActive: boolean;
};

export type CreateClassModel = Pick<ClassModel, 'name' | 'isActive'>;
