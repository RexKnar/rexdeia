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
    sectionTitle: 'BASIC DETAILS',
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
          required: 'Last Name is Required',
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
          required: 'Mobile Number is Required',
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
          required: 'Please Select Blood Group',
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
          required: 'Please select your religion',
        },
      },
      {
        id: 9,
        type: 'dropdown',
        name: 'caste',
        placeholder: 'Caste',
        label: 'Caste',
        optionKey: 'value',
        optionValue: 'value',
        visible: true,
        options: [
          {
            value: 'BC',
            label: 'BC',
          },
          {
            value: 'ST',
            label: 'ST',
          },
          {
            value: 'MBC',
            label: 'MBC',
          },
        ],
        validationRules: {
          required: 'Please Select Caste',
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
          required: 'Please select Nationality',
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
          required: 'Please select Mother Tongue',
        },
      },
      {
        id: 12,
        type: 'text',
        name: 'aadharCardNumber',
        placeholder: 'Aadhar Number',
        label: 'Aadhar Number',
        visible: true,
        options: [],
        validationRules: {
          required: 'Please enter Adar Card number',
        },
      },
      {
        id: 13,
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
          required: 'Please select Differently Able',
        },
      },
      {
        id: 14,
        type: 'text',
        name: 'specialCategory',
        placeholder: 'special Category',
        label: 'special Category',
        visible: true,
        options: [],
        validationRules: {
          required: 'Please Enter  special category',
        },
      },
      {
        id: 15,
        type: 'text',
        name: 'epfNumber',
        placeholder: 'ESI/EPF NO',
        label: 'ESI/EPF NO',
        visible: true,
        options: [],
        validationRules: {
          required: 'Please enter ESI/EPF Number',
        },
      },
    ],
  },
  {
    id: 1,
    sectionTitle: 'PARENTS DETAILS',
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
          required: 'Father Name is Required',
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
          required: 'Mother Name is Required',
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
    sectionTitle: 'ADDRESS DETAILS',
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
          required: 'Current address line1 is Required',
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
          required: 'Current address1 is Required',
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
          required: 'Current pin code is Required',
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
          required: 'Current Country is Required',
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
          required: 'Current state is Required',
        },
      },
      {
        id: 5,
        type: 'dropdown',
        name: 'currentCity',
        placeholder: 'Current City',
        label: 'Current City',
        optionKey: 'name',
        optionValue: 'isoCode',
        visible: true,
        options: [],
        validationRules: {
          required: 'Current city is Required',
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
          required: 'Permanent Address1 is Required',
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
          required: 'Permanent Address2 is Required',
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
          required: 'Permanent Pincode is Required',
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
          required: 'Permanent Country is Required',
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
          required: 'Permanent State is Required',
        },
      },
      {
        id: 11,
        type: 'dropdown',
        name: 'permanentCity',
        placeholder: 'Permanent City',
        label: 'Permanent City',
        optionKey: 'name',
        optionValue: 'isoCode',
        visible: true,
        options: [],
        validationRules: {
          required: 'Permanent City is Required',
        },
      },
    ],
  },
  {
    id: 3,
    sectionTitle: 'WORK DETAILS',
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
          { value: 'Principal', label: 'Principal' },
          { value: 'HM', label: 'HM' },
          { value: 'AHM', label: 'AHM' },
          { value: 'PT', label: 'PT' },
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
          required: 'Detainment Date is Required',
        },
      },
      {
        id: 5,
        type: 'date',
        name: 'dateOfRegularization',
        placeholder: 'Date of regularization',
        label: 'Date of regularization',
        visible: true,
        options: [],
        validationRules: {
          required: 'Regularization date is Required',
        },
      },
      {
        id: 6,
        type: 'text',
        name: 'subjectHandling',
        placeholder: 'Subject Handling',
        label: 'Subject Handling',
        visible: true,
        options: [],
        validationRules: {
          required: 'Please provide subject handling details.',
        },
      },
    ],
  },
  {
    id: 3,
    sectionTitle: 'EDUCATION DETAILS',
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
          required: 'Please enter college name.',
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
          required: 'Please select pass out year.',
        },
      },
      {
        id: 2,
        type: 'text',
        name: 'marksObtained',
        placeholder: 'Marks Obtained',
        label: 'Marks Obtained',
        visible: true,
        options: [],
        validationRules: {
          required: 'Please enter marks obtained.',
        },
      },
    ],
  },
];
export default staffForm;
