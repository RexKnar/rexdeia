export type RegulationModel = {
  regulationName: string;
  announcedYear: string;
  endYear: string;
  isActive: boolean;
};

export type CreateRegulationModel = Pick<
  RegulationModel,
  'regulationName' | 'announcedYear' | 'isActive'
>;
