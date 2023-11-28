export type Staff = {
  id: string;
  type: 'Teaching' | 'NonTeaching' | 'Principal' | 'Correspondent';
  status: 'Active' | 'InActive' | 'Resigned' | 'Suspended' | 'Fired';
  aadharCardNumber: string;
  annualIncome: string;
  bloodGroup: string;
  dob: string;
  address: string;
  dateOfJoining: string;
  name: string;
  email: string;
  phoneNumber: string;
};

export type AddStaffModel = Omit<Staff, 'id' | 'status'>;

export type UpdateStaffModel = Omit<
  Staff,
  'aadharCardNumber' | 'dob' | 'email' | 'name'
>;
