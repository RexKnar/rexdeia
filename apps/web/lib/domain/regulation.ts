export type RegulationModel = {
  id: string;
  endYear: string;
  isActive: boolean;
  announcedYear: string;
  regulationName: string;
};

export type CreateRegulationModel = Pick<
  RegulationModel,
  'regulationName' | 'announcedYear' | 'isActive'
>;
