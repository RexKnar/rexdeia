export type AddDepartmentModel = {
  organizationId: string;
  branchId: string;
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
