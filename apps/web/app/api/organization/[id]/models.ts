export type CreateOrganizationRequestPayload = {
  name: string;
  description?: string;
  institute: 'school' | 'college' | 'other';
};

export type OrganizationModel = CreateOrganizationRequestPayload & {
  userId: string;
};
