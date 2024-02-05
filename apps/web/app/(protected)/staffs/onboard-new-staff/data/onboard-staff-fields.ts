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
          required: true,
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
          required: true,
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
          required: true,
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
          required: true,
        },
      },
      {
        id: 5,
        type: 'text',
        name: 'gender',
        placeholder: 'Gender',
        label: 'Gender',
        visible: true,
        options: [],
        validationRules: {
          required: true,
        },
      },
      {
        id: 6,
        type: 'text',
        name: 'mobile',
        placeholder: 'Mobile Number',
        label: 'Mobile Number',
        visible: true,
        options: [],
        validationRules: {
          required: true,
        },
      },
      {
        id: 7,
        type: 'email',
        name: 'email',
        placeholder: 'Email',
        label: 'Email',
        visible: true,
        options: [],
        validationRules: {
          required: true,
        },
      },
      {
        id: 8,
        type: 'dropdown',
        name: 'bloodGroup',
        placeholder: 'Blood Group',
        label: 'Blood Group',
        optionKey: 'bloodType',
        optionValue: 'bloodType',
        visible: true,
        options: [],
        validationRules: {
          required: true,
        },
      },
      {
        id: 9,
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
          required: true,
        },
      },
      {
        id: 10,
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
          required: true,
        },
      },
      {
        id: 11,
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
          required: true,
        },
      },
      {
        id: 12,
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
          required: true,
        },
      },
      {
        id: 14,
        type: 'text',
        name: 'aadharCardNumber',
        placeholder: 'Aadhar Number',
        label: 'Aadhar Number',
        visible: true,
        options: [],
        validationRules: {
          required: true,
        },
      },
      {
        id: 15,
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
          required: true,
        },
      },
      {
        id: 16,
        type: 'text',
        name: 'specialCategory',
        placeholder: 'special Category',
        label: 'special Category',
        visible: true,
        options: [],
        validationRules: {
          required: true,
        },
      },
      {
        id: 17,
        type: 'text',
        name: 'epfNumber',
        placeholder: 'ESI/EPF NO',
        label: 'ESI/EPF NO',
        visible: true,
        options: [],
        validationRules: {
          required: true,
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
          required: true,
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
          required: true,
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
          required: true,
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
          required: true,
        },
      },
      {
        id: 1,
        type: 'textarea',
        name: 'currentAddressLine1',
        placeholder: 'Current Address2',
        label: 'Current Address2',
        visible: true,
        options: [],
        validationRules: {
          required: true,
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
          required: true,
        },
      },
      {
        id: 5,
        type: 'dropdown',
        name: 'currentCountry',
        placeholder: 'Current Country',
        label: 'Current Country',
        optionKey: 'name',
        optionValue: 'isoCode',
        visible: true,
        options: [],
        validationRules: {
          required: true,
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
          required: true,
        },
      },
      {
        id: 3,
        type: 'dropdown',
        name: 'currentCity',
        placeholder: 'Current City',
        label: 'Current City',
        optionKey: 'name',
        optionValue: 'isoCode',
        visible: true,
        options: [],
        validationRules: {
          required: true,
        },
      },
      {
        id: 0,
        type: 'textarea',
        name: 'permanentAddress1',
        placeholder: 'Permanent Address1',
        label: 'Permanent Address1',
        visible: true,
        options: [],
        validationRules: {
          required: true,
        },
      },
      {
        id: 1,
        type: 'textarea',
        name: 'permanentAddress1',
        placeholder: 'Permanent Address',
        label: 'Permanent Address',
        visible: true,
        options: [],
        validationRules: {
          required: true,
        },
      },
      {
        id: 2,
        type: 'text',
        name: 'permanentPincode',
        placeholder: 'Permanent Pincode',
        label: 'Permanent Pincode',
        visible: true,
        options: [],
        validationRules: {
          required: true,
        },
      },
      {
        id: 5,
        type: 'dropdown',
        name: 'permanentCountry',
        placeholder: 'Permanent Country',
        optionKey: 'name',
        optionValue: 'isoCode',
        label: 'Permanent Country',
        visible: true,
        options: [],
        validationRules: {
          required: true,
        },
      },
      {
        id: 4,
        type: 'dropdown',
        name: 'permanentState',
        placeholder: 'Permanent State',
        label: 'Permanent State',
        visible: true,
        optionKey: 'name',
        optionValue: 'isoCode',
        options: [],
        validationRules: {
          required: true,
        },
      },
      {
        id: 3,
        type: 'dropdown',
        name: 'permanentCity',
        placeholder: 'Permanent City',
        label: 'Permanent City',
        optionKey: 'name',
        optionValue: 'isoCode',
        visible: true,
        options: [],
        validationRules: {
          required: true,
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
        name: 'type',
        placeholder: 'type',
        label: 'type',
        optionKey: 'value',
        optionValue: 'value',
        visible: true,
        options: [
          { value: 'Teaching', label: 'Teaching' },
          { value: 'NonTeaching', label: 'NonTeaching' },
          { value: 'Principal', label: 'Principal' },
        ],
        validationRules: {
          required: true,
        },
      },
      {
        id: 2,
        type: 'date',
        name: 'dateOfJoining',
        placeholder: 'Date Of Joining',
        label: 'Date Of Joining',
        visible: true,
        options: [],
        validationRules: {
          required: true,
        },
      },
    ],
  },
];
export default staffForm;
