export type staffFormSectionType = {
  id: number;
  sectionTitle: string;
  sectionFields: sectionFieldsType[];
};

export type sectionFieldsType = {
  id: number;
  type: string;
  name: string;
  value?: string;
  placeholder: string;
  optionKey?: string;
  optionValue?: string;
  label: string;
  visible: boolean;
  options: Record<string, string>[];
  validationRules: Record<string, string | boolean | number>;
};

const staffForm: staffFormSectionType[] = [
  {
    id: 0,
    sectionTitle: 'Basic Details',
    sectionFields: [
      {
        id: 0,
        type: 'text',
        name: 'firstName',
        placeholder: 'First Name',
        label: 'First Name',
        visible: true,
        options: [],
        validationRules: {
          required: 'First Name is Required',
        },
      },
      {
        id: 1,
        type: 'text',
        name: 'middleName',
        placeholder: 'Middle Name',
        label: 'Middle Name',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 2,
        type: 'text',
        name: 'lastName',
        placeholder: 'Last Name',
        label: 'Last Name',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 3,
        type: 'date',
        name: 'dateOfBirth',
        placeholder: 'Date of Birth',
        label: 'Date of Birth',
        visible: true,
        options: [],
        validationRules: {
          required: 'Date of Birth is Required',
        },
      },
      {
        id: 2,
        type: 'text',
        name: 'age',
        placeholder: 'Age',
        label: 'Age',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 4,
        type: 'radio',
        name: 'gender',
        placeholder: 'Gender',
        label: 'Gender',
        visible: true,
        options: [
          {
            value: 'male',
            label: 'Male',
          },
          {
            value: 'female',
            label: 'Female',
          },
        ],
        validationRules: {
          required: 'Please select an option of Gender',
        },
      },
      {
        id: 5,
        type: 'text',
        name: 'mobile',
        placeholder: 'Mobile Number',
        label: 'Mobile Number',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 6,
        type: 'email',
        name: 'email',
        placeholder: 'Email',
        label: 'Email',
        visible: true,
        options: [],
        validationRules: {
          required: 'Email is Required',
        },
      },
      {
        id: 7,
        type: 'dropdown',
        name: 'bloodGroup',
        placeholder: 'Blood Group',
        label: 'Blood Group',
        optionKey: 'bloodType',
        optionValue: 'bloodType',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 8,
        type: 'dropdown',
        name: 'religion',
        placeholder: 'Religion',
        label: 'Religion',
        optionKey: 'value',
        optionValue: 'value',
        visible: true,
        options: [
          {
            value: 'hindu',
            label: 'Hindu',
          },
          {
            value: 'christian',
            label: 'Christian',
          },
          {
            value: 'muslim',
            label: 'Muslim',
          },
        ],
        validationRules: {
          required: false,
        },
      },
      {
        id: 9,
        type: 'dropdown',
        name: 'communityId',
        placeholder: 'Community',
        label: 'Community',
        optionKey: 'value',
        optionValue: 'value',
        visible: true,
        options: [
          {
            value: '',
            label: 'BC',
          },
          {
            value: '',
            label: 'ST',
          },
          {
            value: '',
            label: 'MBC',
          },
        ],
        validationRules: {
          required: false,
        },
      },
      {
        id: 10,
        type: 'dropdown',
        name: 'nationality',
        placeholder: 'Nationality',
        label: 'Nationality',
        optionKey: 'value',
        optionValue: 'value',
        visible: true,
        options: [
          {
            value: 'indian',
            label: 'Indian',
          },
          {
            value: 'USA',
            label: 'USA',
          },
          {
            value: 'british',
            label: 'British',
          },
        ],
        validationRules: {
          required: false,
        },
      },
      {
        id: 11,
        type: 'dropdown',
        name: 'motherTongue',
        placeholder: 'Mother Tongue',
        label: 'Mother Tongue',
        optionKey: 'value',
        optionValue: 'value',
        visible: true,
        options: [
          {
            value: 'tamil',
            label: 'Tamil',
          },
          {
            value: 'english',
            label: 'English',
          },
          {
            value: 'hindi',
            label: 'Hindi',
          },
        ],
        validationRules: {
          required: false,
        },
      },
      {
        id: 12,
        type: 'text',
        name: 'enrollmentId',
        placeholder: 'Enrollment ID',
        label: 'Enrollment ID',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 13,
        type: 'text',
        name: 'aadharCardNumber',
        placeholder: 'Aadhar Number',
        label: 'Aadhar Number',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 14,
        type: 'radio',
        name: 'differentlyAbled',
        placeholder: 'Differently Abled',
        label: 'Differently Abled',
        visible: true,
        options: [
          {
            value: 'true',
            label: 'Yes',
          },
          {
            value: 'false',
            label: 'No',
          },
        ],
        validationRules: {
          required: false,
        },
      },
      {
        id: 15,
        type: 'text',
        name: 'specialCategory',
        placeholder: 'special Category',
        label: 'special Category',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 16,
        type: 'text',
        name: 'epfNumber',
        placeholder: 'ESI/EPF NO',
        label: 'ESI/EPF NO',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
    ],
  },
  {
    id: 1,
    sectionTitle: 'Parents Details',
    sectionFields: [
      {
        id: 0,
        type: 'text',
        name: 'fatherName',
        placeholder: 'Father Name',
        label: 'Father Name',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 1,
        type: 'text',
        name: 'motherName',
        placeholder: 'Mother Name',
        label: 'Mother Name',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 2,
        type: 'text',
        name: 'spouseName',
        placeholder: 'spouse Name',
        label: 'spouse Name',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
    ],
  },
  {
    id: 2,
    sectionTitle: 'Address Details',
    sectionFields: [
      {
        id: 0,
        type: 'textarea',
        name: 'currentAddressLine1',
        placeholder: 'Current Address1',
        label: 'Current Address1',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 1,
        type: 'textarea',
        name: 'currentAddressLine2',
        placeholder: 'Current Address2',
        label: 'Current Address2',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 2,
        type: 'text',
        name: 'currentPincode',
        placeholder: 'Current Pincode',
        label: 'Current Pincode',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 3,
        type: 'dropdown',
        name: 'currentCountry',
        placeholder: 'Current Country',
        label: 'Current Country',
        optionKey: 'name',
        optionValue: 'isoCode',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 4,
        type: 'dropdown',
        name: 'currentState',
        placeholder: 'Current State',
        label: 'Current State',
        optionKey: 'name',
        optionValue: 'isoCode',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 5,
        type: 'dropdown',
        name: 'currentCity',
        placeholder: 'Current City',
        label: 'Current City',
        optionKey: 'name',
        optionValue: 'name',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 6,
        type: 'textarea',
        name: 'permanentAddress1',
        placeholder: 'Permanent Address1',
        label: 'Permanent Address1',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 7,
        type: 'textarea',
        name: 'permanentAddress2',
        placeholder: 'Permanent Address2',
        label: 'Permanent Address2',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 8,
        type: 'text',
        name: 'permanentPincode',
        placeholder: 'Permanent Pincode',
        label: 'Permanent Pincode',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 9,
        type: 'dropdown',
        name: 'permanentCountry',
        placeholder: 'Permanent Country',
        optionKey: 'name',
        optionValue: 'isoCode',
        label: 'Permanent Country',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 10,
        type: 'dropdown',
        name: 'permanentState',
        placeholder: 'Permanent State',
        label: 'Permanent State',
        visible: true,
        optionKey: 'name',
        optionValue: 'isoCode',
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 11,
        type: 'dropdown',
        name: 'permanentCity',
        placeholder: 'Permanent City',
        label: 'Permanent City',
        optionKey: 'name',
        optionValue: 'name',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
    ],
  },
  {
    id: 3,
    sectionTitle: 'Work Details',
    sectionFields: [
      {
        id: 0,
        type: 'dropdown',
        name: 'category',
        placeholder: 'category',
        label: 'Category',
        optionKey: 'value',
        optionValue: 'value',
        visible: true,
        options: [
          { value: 'Teaching', label: 'Teaching' },
          { value: 'NonTeaching', label: 'NonTeaching' },
        ],
        validationRules: {
          required: 'Category is Required',
        },
      },
      {
        id: 1,
        type: 'dropdown',
        name: 'employmentType',
        placeholder: 'Employment Type',
        label: 'Employment Type',
        optionKey: 'value',
        optionValue: 'value',
        visible: true,
        options: [
          { value: 'Management', label: 'Management' },
          { value: 'Aided', label: 'Aided' },
        ],
        validationRules: {
          required: 'Employment Type is Required',
        },
      },
      {
        id: 2,
        type: 'dropdown',
        name: 'designation',
        placeholder: 'Designation',
        label: 'Designation',
        optionKey: 'value',
        optionValue: 'value',
        visible: true,
        options: [
          { value: 'HM', label: 'HM' },
          { value: 'AHM', label: 'AHM' },
          { value: 'PG', label: 'PG' },
          { value: 'BT', label: 'BT' },
          { value: '2ndGrade', label: "2'nd Grade" },
          {
            value: 'Special-Teacher',
            label: 'Special-Teacher',
          },
          { value: 'Library', label: 'Library' },
        ],
        validationRules: {
          required: 'Designation is Required',
        },
      },
      {
        id: 3,
        type: 'date',
        name: 'dateOfJoining',
        placeholder: 'Date Of Joining',
        label: 'Date Of Joining',
        visible: true,
        options: [],
        validationRules: {
          required: 'joining Date is Required',
        },
      },
      {
        id: 4,
        type: 'date',
        name: 'dateOfDetainment',
        placeholder: 'Date of detainment',
        label: 'Date of detainment',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 5,
        type: 'date',
        name: 'dateOfRegularization',
        placeholder: 'Date of regularisation',
        label: 'Date of regularisation',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 6,
        type: 'date',
        name: 'dateOfRetirement',
        placeholder: 'Date of Retirement',
        label: 'Date of Retirement',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 7,
        type: 'text',
        name: 'subjectHandling',
        placeholder: 'Subject Handling',
        label: 'Subject Handling',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 8,
        type: 'dropdown',
        name: 'natureOfPosting',
        placeholder: 'Nature Of Posting',
        label: 'Nature Of Posting',
        visible: true,
        optionKey: 'label',
        optionValue: 'value',
        options: [
          { value: 'government', label: 'Government' },
          { value: 'management', label: 'Management' },
        ],
        validationRules: {
          required: false,
        },
      },
      {
        id: 9,
        type: 'text',
        name: 'employeeId',
        placeholder: 'Employee Id',
        label: 'Employee Id',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 10,
        type: 'text',
        name: 'cps',
        placeholder: 'CPS',
        label: 'CPS',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 11,
        type: 'text',
        name: 'tpf',
        placeholder: 'TPF',
        label: 'TPF',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
    ],
  },
  {
    id: 4,
    sectionTitle: 'Education Details',
    sectionFields: [
      {
        id: 0,
        type: 'text',
        name: 'collegeName',
        placeholder: 'College Name',
        label: 'College Name',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 1,
        type: 'date',
        name: 'passOutYear',
        placeholder: 'Pass Out Year',
        label: 'Pass Out Year',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 2,
        type: 'text',
        name: 'marksObtained',
        placeholder: 'Marks Obtained',
        label: 'Marks/Percentage Obtained',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
    ],
  },
  {
    id: 5,
    sectionTitle: 'Bank Details',
    sectionFields: [
      {
        id: 0,
        type: 'text',
        name: 'accountHolderName',
        placeholder: 'Account Holder Name',
        label: 'Account Holder Name',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 1,
        type: 'text',
        name: 'accountNumber',
        placeholder: 'Account Number ',
        label: 'Account Number',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 2,
        type: 'text',
        name: 'branchName',
        placeholder: 'Branch Name ',
        label: 'Branch Name',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
      {
        id: 3,
        type: 'text',
        name: 'IFSC_Code',
        placeholder: 'IFSC Code ',
        label: 'IFSC Code',
        visible: true,
        options: [],
        validationRules: {
          required: false,
        },
      },
    ],
  },
];
export default staffForm;
