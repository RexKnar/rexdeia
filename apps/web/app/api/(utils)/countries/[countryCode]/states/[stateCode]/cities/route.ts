import { captureException } from '@sentry/nextjs';
import { City } from 'country-state-city';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/countries/{countryCode}/states/{stateCode}/cities:
 *     get:
 *       summary: Retrieve cities list for a state
 *       description: Gets a list of cities for a state.
 *       parameters:
 *         - name: countryCode
 *           in: path
 *           required: true
 *           description: Unique identifier of the country.
 *           schema:
 *             type: string
 *         - name: stateCode
 *           in: path
 *           required: true
 *           description: Unique identifier of the state.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Successfully retrieved the list of cities.
 */
export async function GET(_: Request, { params: { stateCode, countryCode } }) {
  try {
    const citiesList = City.getCitiesOfState(countryCode, stateCode);

    return new NextResponse(JSON.stringify(citiesList), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
