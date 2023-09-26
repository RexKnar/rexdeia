export type AddDepartmentModel = {
  departmentName: string;
  noOfYears: string;
  departmentCode: string;
  isActive: boolean;
  description: string;
};

export type EditDepartmentModel = {
  id: string;
  departmentName: string;
  noOfYears: string;
  departmentCode: string;
  isActive: boolean;
  description: string;
};
