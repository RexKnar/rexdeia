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
            required: { value: true, message: 'Last Name is required' },
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
          label: 'Phone Number',
          name: 'phoneNumber',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: 'Enter your phone number',
          validationRules: {
            required: { value: true, message: 'Phone Number is required' },
          },
        },
        {
          id: '6',
          type: 'text',
          label: 'Mobile Number',
          name: 'mobileNumber',
          value: '',
          visible: true,
          placeholder: 'Enter your mobile number',
          validationRules: {
            required: { value: true, message: 'Mobile Number is required' },
          },
        },
        {
          id: '7',
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
          id: '8',
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
          id: '9',
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
          id: '10',
          type: 'text',
          label: 'Mother Tongue',
          name: 'motherTongue',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: 'Enter your mother tongue',
          validationRules: {
            required: {
              value: true,
              message: 'Mother Tongue is required',
            },
          },
        },
        {
          id: '11',
          type: 'text',
          label: 'Blood Group',
          name: 'bloodGroup',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: 'Enter your blood group',
          validationRules: {
            required: {
              value: true,
              message: 'Blood Group is required',
            },
          },
        },
        {
          id: '12',
          type: 'text',
          label: 'Religion',
          name: 'religion',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: 'Enter your religion',
          validationRules: {
            required: {
              value: true,
              message: 'Religion is required',
            },
          },
        },
        {
          id: '13',
          type: 'text',
          label: 'Community',
          name: 'community',
          value: '',
          visible: true,
          placeholder: 'Enter your community',
          validationRules: {
            required: {
              value: true,
              message: 'Community is required',
            },
          },
        },
        {
          id: '14',
          type: 'text',
          label: 'Caste',
          name: 'caste',
          value: '',
          visible: true,
          placeholder: 'Enter your caste',
          validationRules: {
            required: {
              value: true,
              message: 'Caste is required',
            },
          },
        },
        {
          id: '15',
          type: 'radio',
          label: 'Marital Status',
          name: 'maritalStatus',
          value: '',
          visible: true,
          options: [
            {
              label: 'Married',
              value: 'married',
            },
            {
              label: 'Single',
              value: 'single',
            },
          ],
          validationRules: {
            required: {
              value: true,
              message: 'Marital Status is required',
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
              value: true,
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
              value: true,
              message: "Father's Occupation is required",
            },
          },
        },
        {
          id: '3',
          type: 'text',
          label: "Mother's Name",
          name: 'motherName',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: 'Enter your mother name',
          validationRules: {
            required: {
              value: true,
              message: "Mother's Name is required",
            },
          },
        },
        {
          id: '4',
          type: 'text',
          label: "Mother's Occupation",
          name: 'motherOccupation',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: 'Enter your mother occupation',
          validationRules: {
            required: {
              value: true,
              message: "Mother's Occupation is required",
            },
          },
        },
        {
          id: '5',
          type: 'text',
          label: 'Annual Income',
          name: 'annualIncome',
          value: '',
          visible: true,
          placeholder: 'Enter annual income',
          validationRules: {
            required: {
              value: true,
              message: 'Annual Income is required',
            },
          },
        },
        {
          id: '6',
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
              value: true,
              message: 'Parents Separated is required',
            },
          },
        },
        {
          id: '7',
          type: 'dropdown',
          label: 'No of Siblings',
          name: 'noOfSiblings',
          value: '',
          visible: true,
          options: [
            {
              label: '1',
              value: '1',
            },
            {
              label: '2',
              value: '2',
            },
          ],
          validationRules: {
            required: {
              value: true,
              message: 'No of Siblings is required',
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
          type: 'text',
          label: 'Sibling Name 1',
          name: 'siblingName1',
          value: '',
          visible: true,
          placeholder: 'Enter your sibling name',
          validationRules: {
            required: {
              value: true,
              message: 'Sibling Name is required',
            },
          },
        },
        {
          id: '2',
          type: 'text',
          label: 'Sibling Name 2',
          name: 'siblingName2',
          value: '',
          visible: true,
          placeholder: 'Enter your sibling name',
          validationRules: {
            required: {
              value: true,
              message: 'Sibling Name is required',
            },
          },
        },
        {
          id: '3',
          type: 'text',
          label: 'Class',
          name: 'siblingClass1',
          value: '',
          visible: true,
          placeholder: 'Enter your sibling class',
          validationRules: {
            required: {
              value: true,
              message: 'Sibling Class is required',
            },
          },
        },
        {
          id: '4',
          type: 'text',
          label: 'Class',
          name: 'siblingClass2',
          value: '',
          visible: true,
          placeholder: 'Enter your sibling name',
          validationRules: {
            required: {
              value: true,
              message: 'Sibling Class is required',
            },
          },
        },
        {
          id: '5',
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
              value: true,
              message: 'Sibling Relation is required',
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
              value: true,
              message: 'Sibling Relation is required',
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
              value: true,
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
              value: true,
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
              value: true,
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
              value: true,
              message: "Guardian's Phone Number is required",
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
              value: true,
              message: 'Residential Address is required',
            },
          },
        },
        {
          id: '2',
          type: 'text',
          label: 'District',
          name: 'residentialDistrict',
          value: '',
          visible: true,
          placeholder: 'Enter district',
          validationRules: {
            required: {
              value: true,
              message: 'District is required',
            },
          },
        },
        {
          id: '3',
          type: 'text',
          label: 'State',
          name: 'residentialState',
          value: '',
          visible: true,
          placeholder: 'Enter state',
          validationRules: {
            required: {
              value: true,
              message: 'State is required',
            },
          },
        },
        {
          id: '4',
          type: 'text',
          label: 'Postal / ZIP Code',
          name: 'residentialPostalCode',
          value: '',
          visible: true,
          placeholder: 'Enter postal code',
          validationRules: {
            required: {
              value: true,
              message: 'Postal / ZIP Code is required',
            },
          },
        },
        {
          id: '5',
          type: 'textarea',
          label: 'Permanent Address',
          name: 'permanentAddress',
          value: '',
          visible: true,
          placeholder: 'Enter permonent address',
          validationRules: {
            required: {
              value: true,
              message: 'Permanent Address is required',
            },
          },
        },
        {
          id: '6',
          type: 'text',
          label: 'District',
          name: 'permanentDistrict',
          value: '',
          visible: true,
          placeholder: 'Enter district',
          validationRules: {
            required: {
              value: true,
              message: 'District is required',
            },
          },
        },
        {
          id: '7',
          type: 'text',
          label: 'State',
          name: 'permanentState',
          value: '',
          visible: true,
          placeholder: 'Enter state',
          validationRules: {
            required: {
              value: true,
              message: 'State is required',
            },
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
              value: true,
              message: 'Postal / ZIP Code is required',
            },
          },
        },
        {
          id: '9',
          type: 'text',
          label: 'Nationality',
          name: 'nationality',
          value: '',
          visible: true,
          isReadOnly: true,
          placeholder: 'Enter nationality',
          validationRules: {
            required: {
              value: true,
              message: 'Nationality is required',
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
              value: true,
              message: 'School Name is required',
            },
          },
        },
        {
          id: '2',
          type: 'text',
          label: 'Year of Passing',
          name: 'yearOfPassing10th',
          value: '',
          visible: true,
          placeholder: 'Enter year of passing',
          validationRules: {
            required: {
              value: true,
              message: 'Year of Passing is required',
            },
          },
        },
        {
          id: '3',
          type: 'text',
          label: 'Obtained Mark',
          name: 'obtainedMark10th',
          value: '',
          visible: true,
          placeholder: 'Enter your mark',
          validationRules: {
            required: {
              value: true,
              message: 'Obtained Mark is required',
            },
          },
        },
        {
          id: '4',
          type: 'text',
          label: 'Medium of Education',
          name: 'mediumOfEducation10th',
          value: '',
          visible: true,
          placeholder: 'Enter year medium of education',
          validationRules: {
            required: {
              value: true,
              message: 'Medium of Education is required',
            },
          },
        },
        {
          id: '5',
          type: 'text',
          label: 'School Name (12th std)',
          name: 'schoolName12th',
          value: '',
          visible: true,
          placeholder: 'Enter your school name',
          validationRules: {
            required: {
              value: true,
              message: 'School Name is required',
            },
          },
        },
        {
          id: '6',
          type: 'text',
          label: 'Year of Passing',
          name: 'yearOfPassing12th',
          value: '',
          visible: true,
          placeholder: 'Enter year of passing',
          validationRules: {
            required: {
              value: true,
              message: 'Year of Passing is required',
            },
          },
        },
        {
          id: '7',
          type: 'text',
          label: 'Obtained Mark',
          name: 'obtainedMark12th',
          value: '',
          visible: true,
          placeholder: 'Enter your mark',
          validationRules: {
            required: {
              value: true,
              message: 'Obtained Mark is required',
            },
          },
        },
        {
          id: '8',
          type: 'text',
          label: 'Medium of Education',
          name: 'mediumOfEducation12th',
          value: '',
          visible: true,
          placeholder: 'Enter year medium of education',
          validationRules: {
            required: {
              value: true,
              message: 'Medium of Education is required',
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
          label: 'Deapartment',
          name: 'courseOption1',
          value: '',
          visible: true,
          options: [
            {
              label: 'CSE',
              value: 'cse',
            },
            {
              label: 'EEE',
              value: 'eee',
            },
          ],
          validationRules: {
            required: {
              value: true,
              message: 'Deapartment is required',
            },
          },
        },
        {
          id: '2',
          type: 'dropdown',
          label: 'Deapartment',
          name: 'courseOption2',
          value: '',
          visible: true,
          options: [
            {
              label: 'CSE',
              value: 'cse',
            },
            {
              label: 'EEE',
              value: 'eee',
            },
          ],
          validationRules: {
            required: {
              value: true,
              message: 'Deapartment is required',
            },
          },
        },
        {
          id: '3',
          type: 'radio',
          label: 'Admission Type',
          name: 'admissionType',
          value: '',
          visible: true,
          options: [
            {
              label: 'New',
              value: 'new',
            },
            {
              label: 'Lateral Entry',
              value: 'lateralEntry',
            },
          ],
          validationRules: {
            required: {
              value: true,
              message: 'Admission Type is required',
            },
          },
        },
        {
          id: '4',
          type: 'radio',
          label: 'Admission Mode',
          name: 'admissionMode',
          value: '',
          visible: true,
          options: [
            {
              label: 'Counselling',
              value: 'counselling',
            },
            {
              label: 'Management',
              value: 'management',
            },
          ],
          validationRules: {
            required: {
              value: true,
              message: 'Admission Mode is required',
            },
          },
        },
        {
          id: '5',
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
              value: true,
              message: 'Scholarship is required',
            },
          },
        },
        {
          id: '6',
          type: 'text',
          label: 'First Language',
          name: 'firstLanguage',
          value: '',
          visible: true,
          placeholder: 'Enter your first language',
          validationRules: {
            required: {
              value: true,
              message: 'First Language is required',
            },
          },
        },
      ],
    },
  ],
};

export const EnquiryForm = {
  title: 'COLLEGE ENQUIRY FORM',
  description:
    "If you'd like to apply to our college, please fill in this College Enquiry Form and we will contact you as soon as possible.",
  formSections: [
    {
      sectionTitle: 'Personal Information',
      sectionDescription: 'Please fill out your personal information.',
      sectionFields: [
        {
          id: '1',
          type: 'text',
          label: 'Name',
          name: 'name',
          value: '',
          visible: true,
          placeholder: 'Enter your name',
          validationRules: {
            required: true,
            minLength: 1,
            maxLength: 100,
          },
        },
        {
          id: '2',
          type: 'date',
          label: 'Date',
          name: 'date',
          value: '',
          visible: true,
          placeholder: 'Select todays date',
          validationRules: {
            required: true,
          },
        },
        {
          id: '3',
          type: 'email',
          label: 'Email',
          name: 'emailId',
          value: '',
          visible: true,
          placeholder: 'Enter your email',
          validationRules: {
            required: true,
            email: true,
          },
        },
        {
          id: '4',
          type: 'text',
          label: 'Contact Number',
          name: 'contactNumber',
          value: '',
          visible: true,
          placeholder: 'Enter your contact number',
          validationRules: {
            required: true,
          },
        },
        {
          id: '5',
          type: 'date',
          label: 'Date of Birth',
          name: 'dob',
          value: '',
          visible: true,
          placeholder: 'Select your DOB',
          validationRules: {
            required: true,
          },
        },
        {
          id: '6',
          type: 'text',
          label: 'Age',
          name: 'age',
          value: '',
          visible: true,
          placeholder: 'Enter your age',
          validationRules: {
            required: true,
          },
        },
        {
          id: '7',
          type: 'radio',
          label: 'Gender',
          name: 'gender',
          value: '',
          visible: true,
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
            required: true,
          },
        },
        {
          id: '8',
          type: 'radio',
          label: 'Marital Status',
          name: 'maritalStatus',
          value: '',
          visible: true,
          options: [
            {
              label: 'Married',
              value: 'married',
            },
            {
              label: 'Single',
              value: 'single',
            },
          ],
          validationRules: {
            required: true,
          },
        },
        {
          id: '9',
          type: 'text',
          label: "Father's Name",
          name: 'fatherName',
          value: '',
          visible: true,
          placeholder: 'Enter your father name',
          validationRules: {
            required: true,
          },
        },
        {
          id: '10',
          type: 'text',
          label: "Father's Occupation",
          name: 'fatherOccupation',
          value: '',
          visible: true,
          placeholder: 'Enter your father name',
          validationRules: {
            required: true,
          },
        },
        {
          id: '10-1',
          type: 'text',
          label: "Father's Phone Number",
          name: 'fatherPhoneNumber',
          value: '',
          visible: true,
          placeholder: 'Enter your father phone number',
          validationRules: {
            required: true,
          },
        },
        {
          id: '10-2',
          type: 'text',
          label: "Father's Email",
          name: 'fatherEmailId',
          value: '',
          visible: true,
          placeholder: 'Enter your father email',
          validationRules: {
            required: true,
          },
        },
        {
          id: '11',
          type: 'text',
          label: "Mother's Name",
          name: 'motherName',
          value: '',
          visible: true,
          placeholder: 'Enter your father occupation',
          validationRules: {
            required: true,
          },
        },
        {
          id: '12',
          type: 'text',
          label: "Mother's Occupation",
          name: 'motherOccupation',
          value: '',
          visible: true,
          placeholder: 'Enter your mother occupation',
          validationRules: {
            required: true,
          },
        },
        {
          id: '10-1',
          type: 'text',
          label: "Mother's Phone Number",
          name: 'motherPhoneNumber',
          value: '',
          visible: true,
          placeholder: 'Enter your father phone number',
          validationRules: {
            required: true,
          },
        },
        {
          id: '10-2',
          type: 'text',
          label: "Mother's Email",
          name: 'motherEmailId',
          value: '',
          visible: true,
          placeholder: 'Enter your mother email',
          validationRules: {
            required: true,
          },
        },
        {
          id: '13',
          type: 'text',
          label: "Guardian's Name",
          name: 'guardianName',
          value: '',
          visible: true,
          placeholder: 'Enter your mother name',
          validationRules: {
            required: true,
          },
        },
        {
          id: '14',
          type: 'text',
          label: "Guardian's Occupation",
          name: 'guardianOccupation',
          value: '',
          visible: true,
          placeholder: 'Enter your guardian occupation',
          validationRules: {
            required: true,
          },
        },
        {
          id: '14-1',
          type: 'text',
          label: "Guardian's Phone Number",
          name: 'guardianPhoneNumber',
          value: '',
          visible: true,
          placeholder: 'Enter your Guardian phone number',
          validationRules: {
            required: true,
          },
        },
        {
          id: '14-2',
          type: 'text',
          label: "Guardian's Email",
          name: 'guardianEmailId',
          value: '',
          visible: true,
          placeholder: 'Enter your Guardian email',
          validationRules: {
            required: true,
          },
        },
        {
          id: '15',
          type: 'text',
          label: 'Address Line 1',
          name: 'addressLine1',
          value: '',
          visible: true,
          placeholder: 'address line 1',
          validationRules: {
            required: true,
          },
        },
        {
          id: '16',
          type: 'text',
          label: 'Address Line 2',
          name: 'addressLine2',
          value: '',
          visible: true,
          placeholder: 'address line 2',
          validationRules: {
            required: true,
          },
        },
        {
          id: '17',
          type: 'text',
          label: 'Nationality',
          name: 'nationality',
          value: '',
          visible: true,
          placeholder: 'Enter nationality',
          validationRules: {
            required: true,
          },
        },
        {
          id: '18',
          type: 'text',
          label: 'State',
          name: 'state',
          value: '',
          visible: true,
          placeholder: 'Enter state',
          validationRules: {
            required: true,
          },
        },
        {
          id: '19',
          type: 'text',
          label: 'District',
          name: 'district',
          value: '',
          visible: true,
          placeholder: 'Enter district',
          validationRules: {
            required: true,
          },
        },
        {
          id: '20',
          type: 'text',
          label: 'Postal / ZIP Code',
          name: 'postalCode',
          value: '',
          visible: true,
          placeholder: 'Enter postal/zip code',
          validationRules: {
            required: true,
          },
        },
        {
          id: '21',
          type: 'text',
          label: 'School Name (10th std)',
          name: 'schoolName10th',
          value: '',
          visible: true,
          placeholder: 'Enter your school name',
          validationRules: {
            required: true,
          },
        },
        {
          id: '22',
          type: 'text',
          label: 'Year of Passing',
          name: 'yearOfPassing10th',
          value: '',
          visible: true,
          placeholder: 'Enter year of passing',
          validationRules: {
            required: true,
          },
        },
        {
          id: '23',
          type: 'text',
          label: 'Obtained Mark',
          name: 'obtainedMark10th',
          value: '',
          visible: true,
          placeholder: 'Enter your mark',
          validationRules: {
            required: true,
          },
        },
        {
          id: '24',
          type: 'text',
          label: 'Medium of Education',
          name: 'mediumOfEducation10th',
          value: '',
          visible: true,
          placeholder: 'Enter year medium of education',
          validationRules: {
            required: true,
          },
        },
        {
          id: '25',
          type: 'text',
          label: 'School Name (12th std)',
          name: 'schoolName12th',
          value: '',
          visible: true,
          placeholder: 'Enter your school name',
          validationRules: {
            required: true,
          },
        },
        {
          id: '26',
          type: 'text',
          label: 'Year of Passing',
          name: 'yearOfPassing12th',
          value: '',
          visible: true,
          placeholder: 'Enter year of passing',
          validationRules: {
            required: true,
          },
        },
        {
          id: '27',
          type: 'text',
          label: 'Obtained Mark',
          name: 'obtainedMark12th',
          value: '',
          visible: true,
          placeholder: 'Enter your mark',
          validationRules: {
            required: true,
          },
        },
        {
          id: '28',
          type: 'text',
          label: 'Medium of Education',
          name: 'mediumOfEducation12th',
          value: '',
          visible: true,
          placeholder: 'Enter year medium of education',
          validationRules: {
            required: true,
          },
        },
      ],
    },
  ],
};
