const caste = [
  {
    label: 'No caste',
    value: 'noCaste',
  },
];
const religion = [
  {
    label: 'Hindu',
    value: 'hindu',
  },
  {
    label: ' Christian ',
    value: 'christian',
  },
  {
    label: 'Muslim',
    value: 'muslim',
  },
  {
    label: 'others',
    value: 'others',
  },
];
const noOfSiblings = [
  {
    label: '0',
    value: '0',
  },
  {
    label: '1',
    value: '1',
  },
  {
    label: '2',
    value: '2',
  },
  {
    label: '3',
    value: '3',
  },
  {
    label: '4',
    value: '4',
  },
  {
    label: '5',
    value: '5',
  },
];

export const admissionForm = {
  title: 'COLLEGE ADMISSION FORM',
  description:
    "If you'd like to apply to our college, please fill in this College Admission Form and we will contact you as soon as possible.",
  formSections: [
    {
      sectionTitle: 'Personal Details',
      sectionDescription: 'Please fill out your personal information.',
      sectionFields: [
        {
          id: '1',
          type: 'text',
          label: 'First Name',
          name: 'firstName',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: 'Enter your first name',
          validationRules: {
            required: { value: true, message: 'First Name is required' },
            minLength: {
              value: 1,
              message: 'First Name must be at least 1 character',
            },
            maxLength: {
              value: 999,
              message: 'First Name must be less than 999 characters',
            },
          },
        },
        {
          id: '2',
          type: 'text',
          label: 'Middle Name',
          name: 'middleName',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: 'Enter your middle name',
          validationRules: {
            required: { value: false },
            minLength: {
              value: 1,
              message: 'First Name must be at least 1 character',
            },
            maxLength: {
              value: 999,
              message: 'First Name must be less than 999 characters',
            },
          },
        },
        {
          id: '3',
          type: 'text',
          label: 'Last Name',
          name: 'lastName',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: 'Enter your last name',
          validationRules: {
            required: { value: false, message: 'Last Name is required' },
            minLength: {
              value: 1,
              message: 'First Name must be at least 1 character',
            },
            maxLength: {
              value: 999,
              message: 'First Name must be less than 999 characters',
            },
          },
        },
        {
          id: '4',
          type: 'date',
          label: 'Date of Birth',
          name: 'dob',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: 'Select your DOB',
          validationRules: {
            required: { value: true, message: 'Date of Birth is required' },
          },
        },
        {
          id: '5',
          type: 'text',
          label: 'Age',
          name: 'age',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: 'Enter your Age',
          validationRules: {
            required: { value: false, message: 'Age is required' },
          },
        },
        {
          id: '6',
          type: 'radio',
          label: 'Gender',
          name: 'gender',
          value: '',
          visible: true,
          isReadOnly: true,
          options: [
            {
              label: 'Male',
              value: 'male',
            },
            {
              label: 'Female',
              value: 'female',
            },
          ],
          validationRules: {
            required: {
              value: true,
              message: 'Gender is required',
            },
          },
        },
        {
          id: '7',
          type: 'text',
          label: 'Phone Number',
          name: 'phoneNumber',
          value: '',
          visible: true,
          placeholder: 'Enter your phone number',
          validationRules: {
            required: { value: false, message: 'phone Number is required' },
          },
        },
        {
          id: '8',
          type: 'email',
          label: 'Email',
          name: 'emailId',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: 'Enter your email',
          validationRules: {
            required: { value: true, message: 'Email is required' },
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: 'Invalid email format',
            },
          },
        },
        {
          id: '9',
          type: 'dropdown',
          label: 'Blood Group',
          name: 'bloodGroup',
          optionKey: 'bloodType',
          optionValue: 'bloodType',
          visible: true,
          options: [],
          validationRules: {
            required: {
              value: false,
              message: 'Blood Group is required',
            },
          },
        },
        {
          id: '10',
          type: 'text',
          label: 'Pickup Point(transport)',
          name: 'pickupPoint',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: 'Enter your Pickup Point',
          validationRules: {
            required: {
              value: false,
              message: 'Pickup Point is required',
            },
          },
        },
        {
          id: '11',
          type: 'text',
          label: 'EMIS Number',
          name: 'emisNumber',
          value: '',
          visible: true,
          placeholder: 'Enter your EMIS Number',
          validationRules: {
            required: {
              value: true,
              message: 'EMIS Number is required',
            },
          },
        },
        {
          id: '12',
          type: 'text',
          label: 'Admission Number',
          name: 'admissionNumber',
          value: '',
          visible: true,
          placeholder: 'Enter your Admission Number',
          validationRules: {
            required: {
              value: false,
              message: 'Admission Number is required',
            },
          },
        },
        {
          id: '13',
          type: 'date',
          label: 'Date Of Joining',
          name: 'dateOfJoining',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: 'Date Of Joining',
          validationRules: {
            required: { value: false, message: 'Joining Date is Required' },
          },
        },
        {
          id: '14',
          type: 'dropdown',
          label: 'Medium',
          name: 'joiningMedium',
          value: '',
          optionKey: 'name',
          optionValue: 'id',
          visible: true,
          options: [],
          validationRules: {
            required: {
              value: true,
              message: 'Medium is required',
            },
          },
        },
        {
          id: '15',
          type: 'dropdown',
          label: 'Class',
          name: 'joiningClass',
          value: '',
          optionKey: 'name',
          optionValue: 'id',
          visible: true,
          options: [],
          validationRules: {
            required: {
              value: true,
              message: 'Class is required',
            },
          },
        },
        {
          id: '16',
          type: 'dropdown',
          label: 'Group',
          name: 'joiningGroup',
          value: '',
          optionKey: 'name',
          optionValue: 'id',
          visible: true,
          options: [],
          validationRules: {
            required: {
              value: true,
              message: 'Group is required',
            },
          },
        },
        {
          id: '17',
          type: 'text',
          label: 'Enrollment ID',
          name: 'enrollmentId',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: 'Enter Enrollment ID',
          validationRules: {
            required: {
              value: false,
              message: 'Enrollment ID is required',
            },
          },
        },
      ],
    },

    {
      sectionTitle: 'Parent’s Details',
      sectionDescription: 'Please fill out your parents details.',
      sectionFields: [
        {
          id: '1',
          type: 'text',
          label: "Father's Name",
          name: 'fatherName',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: 'Enter your father name',
          validationRules: {
            required: {
              value: false,
              message: "Father's Name is required",
            },
          },
        },
        {
          id: '2',
          type: 'text',
          label: "Father's Occupation",
          name: 'fatherOccupation',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: 'Enter your father occupation',
          validationRules: {
            required: {
              value: false,
              message: "Father's Occupation is required",
            },
          },
        },
        {
          id: '3',
          type: 'text',
          label: "Father's Phone Number",
          name: 'fatherPhoneNumber',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: "Enter your Father's Phone Number",
          validationRules: {
            required: {
              value: false,
              message: "Father's Phone Number is required",
            },
          },
        },
        {
          id: '4',
          type: 'text',
          label: "Father's Email ID",
          name: 'fatherEmailId',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: "Enter your Father's Email ID",
          validationRules: {
            required: {
              value: false,
              message: "Father's Email ID is required",
            },
          },
        },
        {
          id: '5',
          type: 'text',
          label: "Father's Education",
          name: 'fatherEducation',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: "Enter your Father's Education",
          validationRules: {
            required: {
              value: false,
              message: "Father's Education is required",
            },
          },
        },
        {
          id: '6',
          type: 'text',
          label: " Father's Aadhar Card Number",
          name: 'fatherAadharCardNumber',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: "Enter your Father's aadhar card number",
          validationRules: {
            required: {
              value: false,
              message: "Father's Aadhar Card Number is required",
            },
          },
        },
        {
          id: '7',
          type: 'text',
          label: 'Fathers’s Annual Income',
          name: 'fatherAnnualIncome',
          value: '',
          visible: true,
          placeholder: 'Enter annual income',
          validationRules: {
            required: {
              value: false,
              message: 'Annual Income is required',
            },
          },
        },
        {
          id: '8',
          type: 'text',
          label: "Mother's Name",
          name: 'motherName',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: 'Enter your Mother name',
          validationRules: {
            required: {
              value: false,
              message: "Mother's Name is required",
            },
          },
        },
        {
          id: '9',
          type: 'text',
          label: "Mother's Occupation",
          name: 'motherOccupation',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: 'Enter your mother occupation',
          validationRules: {
            required: {
              value: false,
              message: "Mother's Occupation is required",
            },
          },
        },
        {
          id: '10',
          type: 'text',
          label: "Mother's Phone Number",
          name: 'motherPhoneNumber',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: "Enter your Mother's Phone Number",
          validationRules: {
            required: {
              value: false,
              message: "Mother's Phone Number is required",
            },
          },
        },
        {
          id: '11',
          type: 'text',
          label: "Mother's Email ID",
          name: 'motherEmailId',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: "Enter your Mother's Email ID",
          validationRules: {
            required: {
              value: false,
              message: "Mother's Email ID is required",
            },
          },
        },
        {
          id: '12',
          type: 'text',
          label: "Mother's Education",
          name: 'motherEducation',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: "Enter your Mother's Education",
          validationRules: {
            required: {
              value: false,
              message: "Mother's Education is required",
            },
          },
        },
        {
          id: '13',
          type: 'text',
          label: " Mother's Aadhar Card Number",
          name: 'motherAadharCardNumber',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: "Enter your Mother's aadhar card number",
          validationRules: {
            required: {
              value: false,
              message: "Mother's Aadhar Card Number is required",
            },
          },
        },
        {
          id: '14',
          type: 'text',
          label: 'Mother’s Annual Income',
          name: 'motherAnnualIncome',
          value: '',
          visible: true,
          placeholder: 'Enter annual income',
          validationRules: {
            required: {
              value: false,
              message: 'Annual Income is required',
            },
          },
        },
        {
          id: '15',
          type: 'radio',
          label: 'Parents Separated',
          name: 'parentsSeparated',
          value: '',
          visible: true,
          options: [
            {
              label: 'Yes',
              value: 'yes',
            },
            {
              label: 'No',
              value: 'no',
            },
          ],
          validationRules: {
            required: {
              value: false,
              message: 'Parents Separated is required',
            },
          },
        },
      ],
    },

    {
      sectionTitle: 'Information of Siblings',
      sectionDescription:
        'Please fill out the Information of Siblings studying in this institution.',
      sectionFields: [
        {
          id: '1',
          type: 'dropdown',
          label: 'No of Siblings',
          name: 'noOfSiblings',
          optionKey: 'value',
          optionValue: 'value',
          visible: true,
          options: [...noOfSiblings],
          validationRules: {
            required: {
              value: false,
              message: 'No of Siblings is required',
            },
          },
        },
        {
          id: '2',
          type: 'text',
          label: 'Sibling Name 1',
          name: 'siblingName1',
          value: '',
          visible: true,
          placeholder: 'Enter your sibling name1',
          validationRules: {
            required: {
              value: false,
              message: 'Sibling Name is required',
            },
          },
        },
        {
          id: '3',
          type: 'radio',
          label: 'Relation',
          name: 'siblingRelation1',
          value: '',
          visible: true,
          options: [
            {
              label: 'Brother',
              value: 'brother',
            },
            {
              label: 'Sister',
              value: 'sister',
            },
          ],
          validationRules: {
            required: {
              value: false,
              message: 'Sibling Relation is required',
            },
          },
        },
        {
          id: '4',
          type: 'text',
          label: 'Class for sibling1',
          name: 'siblingClass1',
          value: '',
          visible: true,
          placeholder: 'Enter your sibling1 class',
          validationRules: {
            required: {
              value: false,
              message: 'Sibling Class is required',
            },
          },
        },
        {
          id: '5',
          type: 'text',
          label: 'Sibling Name 2',
          name: 'siblingName2',
          value: '',
          visible: true,
          placeholder: 'Enter your sibling name2',
          validationRules: {
            required: {
              value: false,
              message: 'Sibling Name is required',
            },
          },
        },
        {
          id: '6',
          type: 'radio',
          label: 'Relation',
          name: 'siblingRelation2',
          value: '',
          visible: true,
          options: [
            {
              label: 'Brother',
              value: 'brother',
            },
            {
              label: 'Sister',
              value: 'sister',
            },
          ],
          validationRules: {
            required: {
              value: false,
              message: 'Sibling Relation is required',
            },
          },
        },
        {
          id: '7',
          type: 'text',
          label: 'Class for sibling2',
          name: 'siblingClass2',
          value: '',
          visible: true,
          placeholder: 'Enter your sibling2 class',
          validationRules: {
            required: {
              value: false,
              message: 'Sibling Class is required',
            },
          },
        },
      ],
    },

    {
      sectionTitle: 'Gurdian’s Details',
      sectionDescription: 'Please fill out the Gurdian’s Details',
      sectionFields: [
        {
          id: '1',
          type: 'text',
          label: "Guardian's Name",
          name: 'guardianName',
          value: '',
          visible: true,
          placeholder: 'Enter your guardian name',
          validationRules: {
            required: {
              value: false,
              message: "Guardian's Name is required",
            },
          },
        },
        {
          id: '2',
          type: 'text',
          label: "Guardian's Occupation",
          name: 'guardiansOccupation',
          value: '',
          visible: true,
          placeholder: 'Enter guardian oocupation',
          validationRules: {
            required: {
              value: false,
              message: "Guardian's Occupation is required",
            },
          },
        },
        {
          id: '3',
          type: 'text',
          label: 'Relationship Type',
          name: 'relationshipType',
          value: '',
          visible: true,
          placeholder: 'Enter relationship type',
          validationRules: {
            required: {
              value: false,
              message: 'Relationship Type is required',
            },
          },
        },
        {
          id: '4',
          type: 'text',
          label: "Guardian's Phone Number",
          name: 'guardianPhoneNumber',
          value: '',
          visible: true,
          placeholder: 'Enter guardian phone number',
          validationRules: {
            required: {
              value: false,
              message: "Guardian's Phone Number is required",
            },
          },
        },
        {
          id: '5',
          type: 'text',
          label: "Guardian's Email ID",
          name: 'guardianEmailId',
          value: '',
          visible: true,
          placeholder: 'Enter guardian Email ID',
          validationRules: {
            required: {
              value: false,
              message: "Guardian's Email ID is required",
            },
          },
        },
        {
          id: '6',
          type: 'text',
          label: "Guardian's Aadhar Card Number",
          name: 'guardianAadharCardNumber',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: "Enter Guardian's Aadhar Card Number",
          validationRules: {
            required: {
              value: false,
              message: "Enter Guardian's Aadhar Card Number",
            },
          },
        },
        {
          id: '7',
          type: 'text',
          label: ' Guardian’sAnnual Income',
          name: 'guardianAnnualIncome',
          value: '',
          visible: true,
          placeholder: 'Enter annual income',
          validationRules: {
            required: {
              value: false,
              message: 'Annual Income is required',
            },
          },
        },
      ],
    },

    {
      sectionTitle: 'Address Details',
      sectionDescription: 'Please fill out the Address Details',
      sectionFields: [
        {
          id: '1',
          type: 'textarea',
          label: 'Residential Address',
          name: 'residentialAddress',
          value: '',
          visible: true,
          placeholder: 'Enter residential address',
          validationRules: {
            required: {
              value: false,
              message: 'Residential Address is required',
            },
          },
        },
        {
          id: '2',
          type: 'dropdown',
          name: 'residentialCountry',
          placeholder: 'residential Country',
          label: 'residential Country',
          optionKey: 'name',
          optionValue: 'isoCode',
          visible: true,
          options: [],
          validationRules: {
            required: false,
          },
        },
        {
          id: '3',
          type: 'dropdown',
          name: 'residentialState',
          placeholder: 'Residential State',
          label: 'Residential State',
          optionKey: 'name',
          optionValue: 'isoCode',
          visible: true,
          options: [],
          validationRules: {
            required: false,
          },
        },
        {
          id: '4',
          type: 'dropdown',
          name: 'residentialCity',
          placeholder: 'Residential City',
          label: 'Residential City',
          optionKey: 'name',
          optionValue: 'name',
          visible: true,
          options: [],
          validationRules: {
            required: false,
          },
        },
        {
          id: '5',
          type: 'text',
          label: 'Postal / ZIP Code',
          name: 'residentialPostalCode',
          value: '',
          visible: true,
          placeholder: 'Enter postal code',
          validationRules: {
            required: {
              value: false,
              message: 'Postal / ZIP Code is required',
            },
          },
        },
        {
          id: '6',
          type: 'textarea',
          label: 'Permanent Address',
          name: 'permanentAddress',
          value: '',
          visible: true,
          placeholder: 'Enter Permanent address',
          validationRules: {
            required: {
              value: false,
              message: 'Permanent Address is required',
            },
          },
        },
        {
          id: '7',
          type: 'dropdown',
          name: 'permanentCountry',
          placeholder: 'Permanent Country',
          label: 'Permanent Country',
          optionKey: 'name',
          optionValue: 'isoCode',
          visible: true,
          options: [],
          validationRules: {
            required: false,
          },
        },
        {
          id: '8',
          type: 'dropdown',
          name: 'permanentState',
          placeholder: 'Permanent State',
          label: 'Permanent State',
          optionKey: 'name',
          optionValue: 'isoCode',
          visible: true,
          options: [],
          validationRules: {
            required: false,
          },
        },
        {
          id: '9',
          type: 'dropdown',
          name: 'permanentCity',
          placeholder: 'Permanent City',
          label: 'Permanent City',
          optionKey: 'name',
          optionValue: 'isoCode',
          visible: true,
          options: [],
          validationRules: {
            required: false,
          },
        },
        {
          id: '8',
          type: 'text',
          label: 'Postal / ZIP Code',
          name: 'permanentPostalCode',
          value: '',
          visible: true,
          placeholder: 'Enter postal code',
          validationRules: {
            required: {
              value: false,
              message: 'Postal / ZIP Code is required',
            },
          },
        },
      ],
    },

    {
      sectionTitle: 'Educational Details',
      sectionDescription: 'Please fill out the Educational Details',
      sectionFields: [
        {
          id: '1',
          type: 'text',
          label: 'School Name (10th std)',
          name: 'schoolName10th',
          value: '',
          visible: true,
          placeholder: 'Enter your school name',
          validationRules: {
            required: {
              value: false,
              message: 'School Name is required',
            },
          },
        },
        {
          id: '2',
          type: 'text',
          label: 'Year of Passing(10th)',
          name: 'yearOfPassing10th',
          value: '',
          visible: true,
          placeholder: 'Enter year of passing',
          validationRules: {
            required: {
              value: false,
              message: 'Year of Passing is required',
            },
          },
        },
        {
          id: '3',
          type: 'text',
          label: 'Obtained Mark/Percentage(10th)',
          name: 'obtainedMark10th',
          value: '',
          visible: true,
          placeholder: 'Enter your mark',
          validationRules: {
            required: {
              value: false,
              message: 'Obtained Mark is required',
            },
          },
        },
        {
          id: '4',
          type: 'text',
          label: 'Medium of Education(10th)',
          name: 'mediumOfEducation10th',
          value: '',
          visible: true,
          placeholder: 'Enter year medium of education',
          validationRules: {
            required: {
              value: false,
              message: 'Medium of Education is required',
            },
          },
        },
        {
          id: '5',
          type: 'text',
          label: 'Board of Education(10th)',
          name: 'boardOfEducation10th',
          value: '',
          visible: true,
          placeholder: 'Enter year Board of education',
          validationRules: {
            required: {
              value: false,
              message: 'Board of Education is required',
            },
          },
        },
        {
          id: '6',
          type: 'text',
          label: 'TC Number(10th)',
          name: 'tcNumber10th',
          value: '',
          visible: true,
          placeholder: 'Enter 10th TC Number',
          validationRules: {
            required: {
              value: false,
              message: 'TC Number is required',
            },
          },
        },
        {
          id: '7',
          type: 'text',
          label: 'School Name (11th std)',
          name: 'schoolName11th',
          value: '',
          visible: true,
          placeholder: 'Enter your school name',
          validationRules: {
            required: {
              value: false,
              message: 'School Name is required',
            },
          },
        },
        {
          id: '8',
          type: 'text',
          label: 'Year of Passing(11th)',
          name: 'yearOfPassing11th',
          value: '',
          visible: true,
          placeholder: 'Enter year of passing',
          validationRules: {
            required: {
              value: false,
              message: 'Year of Passing is required',
            },
          },
        },
        {
          id: '9',
          type: 'text',
          label: 'Obtained Mark/Percentage(11th)',
          name: 'obtainedMark11th',
          value: '',
          visible: true,
          placeholder: 'Enter your mark',
          validationRules: {
            required: {
              value: false,
              message: 'Obtained Mark is required',
            },
          },
        },
        {
          id: '10',
          type: 'text',
          label: 'Medium of Education(11th)',
          name: 'mediumOfEducation11th',
          value: '',
          visible: true,
          placeholder: 'Enter year medium of education',
          validationRules: {
            required: {
              value: false,
              message: 'Medium of Education is required',
            },
          },
        },
        {
          id: '11',
          type: 'text',
          label: 'Board of Education(11th)',
          name: 'boardOfEducation11th',
          value: '',
          visible: true,
          placeholder: 'Enter year Board of education',
          validationRules: {
            required: {
              value: false,
              message: 'Board of Education is required',
            },
          },
        },
        {
          id: '12',
          type: 'text',
          label: 'TC Number(11th)',
          name: 'tcNumber10th',
          value: '',
          visible: true,
          placeholder: 'Enter 11th TC Number',
          validationRules: {
            required: {
              value: false,
              message: 'TC Number is required',
            },
          },
        },
      ],
    },

    {
      sectionTitle: 'Other Details',
      sectionDescription: 'Please fill out the Educational Details',
      sectionFields: [
        {
          id: '1',
          type: 'dropdown',
          label: 'Academic Year',
          name: 'batchId',
          optionKey: 'name',
          optionValue: 'id',
          visible: true,
          options: [],
          validationRules: {
            required: {
              value: true,
              message: 'Academic Year is required',
            },
          },
        },
        {
          id: '2',
          type: 'radio',
          label: 'Scholarship',
          name: 'scholarship',
          value: '',
          visible: true,
          options: [
            {
              label: 'Yes',
              value: 'yes',
            },
            {
              label: 'No',
              value: 'no',
            },
          ],
          validationRules: {
            required: {
              value: false,
              message: 'Scholarship is required',
            },
          },
        },
        {
          id: '3',
          type: 'text',
          label: 'Aadhar Card Number',
          name: 'aadharCardNumber',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: 'Enter your aadhar card number',
          validationRules: {
            required: {
              value: true,
              message: 'Aadhar Card Number is required',
            },
          },
        },
        {
          id: '4',
          type: 'dropdown',
          label: 'Mother Tongue',
          name: 'motherTongueId',
          optionKey: 'name',
          optionValue: 'id',
          visible: true,
          options: [],
          validationRules: {
            required: {
              value: false,
              message: 'Mother Tongue is required',
            },
          },
        },
        {
          id: '5',
          type: 'dropdown',
          label: 'Religion',
          name: 'religion',
          optionKey: 'value',
          optionValue: 'value',
          visible: true,
          options: [...religion],
          validationRules: {
            required: {
              value: false,
              message: 'Religion is required',
            },
          },
        },
        {
          id: '6',
          type: 'dropdown',
          label: 'Community',
          name: 'communityId',
          optionKey: 'name',
          optionValue: 'id',
          visible: true,
          options: [],
          validationRules: {
            required: {
              value: false,
              message: 'Community is required',
            },
          },
        },
        {
          id: '7',
          type: 'dropdown',
          label: 'Caste',
          name: 'caste',
          optionKey: 'value',
          optionValue: 'value',
          visible: true,
          options: [...caste],
          validationRules: {
            required: {
              value: false,
              message: 'Caste is required',
            },
          },
        },
        {
          id: '8',
          type: 'text',
          label: 'Nationality',
          name: 'nationality',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: 'Enter nationality',
          validationRules: {
            required: {
              value: false,
              message: 'Nationality is required',
            },
          },
        },
        {
          id: '9',
          type: 'text',
          label: 'First Language',
          name: 'firstLanguage',
          value: '',
          visible: true,
          placeholder: 'Enter your first language',
          validationRules: {
            required: {
              value: false,
              message: 'First Language is required',
            },
          },
        },
        {
          id: '10',
          type: 'radio',
          label: 'Differently abled',
          name: 'differentlyAbled',
          value: '',
          visible: true,
          options: [
            {
              label: 'Yes',
              value: 'yes',
            },
            {
              label: 'No',
              value: 'no',
            },
          ],
          validationRules: {
            required: {
              value: false,
              message: 'Differently abled is required',
            },
          },
        },
        {
          id: '11',
          type: 'text',
          label: 'Type of Disability',
          name: 'typeOfDisability',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: 'Enter the data',
          validationRules: {
            required: {
              value: false,
              message: 'this is required',
            },
          },
        },
      ],
    },
  ],
};
