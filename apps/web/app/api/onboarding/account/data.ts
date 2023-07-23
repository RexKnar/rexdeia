export const admissionForm = {
  title: 'Admission Form 2023-24',
  description: 'This is the admission form for the academic year 2023-24.',
  formSections: [
    {
      sectionTitle: 'Personal Information',
      sectionDescription: 'Please fill out your personal information.',
      sectionFields: [
        {
          id: '1',
          type: 'text',
          label: 'First Name',
          value: '',
          visible: true,
          placeholder: 'Enter your first name',
          validationRules: {
            required: true,
            minLength: 1,
            maxLength: 100,
          },
        },
        {
          id: '2',
          type: 'text',
          label: 'Last Name',
          value: '',
          visible: true,
          placeholder: 'Enter your last name',
          validationRules: {
            required: true,
            minLength: 1,
            maxLength: 100,
          },
        },
        {
          id: '3',
          type: 'email',
          label: 'Email',
          value: '',
          visible: true,
          placeholder: 'Enter your email',
          validationRules: {
            required: true,
            email: true,
          },
        },
      ],
    },
    {
      sectionTitle: 'Additional Information',
      sectionDescription: 'Please provide additional information.',
      sectionFields: [
        {
          id: '4',
          type: 'dropdown',
          label: 'Choose your favorite color',
          value: '',
          visible: true,
          placeholder: 'Select a color',
          options: [
            {
              label: 'Red',
              value: 'red',
            },
            {
              label: 'Green',
              value: 'green',
            },
            {
              label: 'Blue',
              value: 'blue',
            },
          ],
          validationRules: {
            required: true,
          },
        },
      ],
    },
  ],
};
