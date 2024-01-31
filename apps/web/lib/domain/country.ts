import { ICity, ICountry, IState } from 'country-state-city/lib/interface';

export type GetCountriesResponseModel = ICountry[];
export type GetCitiesByStateResponseModel = ICity[];
export type GetStatesByCountryResponseModel = IState[];
