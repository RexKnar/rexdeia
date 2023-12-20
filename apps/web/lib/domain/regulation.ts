export type RegulationModel = {
  id: string;
  endYear: string;
  isActive: boolean;
  isDeleting?: boolean;
  announcedYear: string;
  isNewlyAdded?: boolean;
  regulationName: string;
};

export type CreateRegulationModel = Pick<
  RegulationModel,
  'regulationName' | 'announcedYear' | 'isActive'
>;

export type UpdateRegulationModel = Pick<
  RegulationModel,
  'regulationName' | 'announcedYear' | 'isActive'
>;
