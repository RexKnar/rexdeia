import { languages } from '../../app/api/(utils)/languages/data';

type Language = (typeof languages)[number];
export type GetLanguagesResponse = Language[];
