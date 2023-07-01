export type CreateOrganizationRequestPayload = {
  name: string;
  institute: 'school' | 'college' | 'other';
};

export type OrganizationModel = CreateOrganizationRequestPayload & {
  userId: string;
};
