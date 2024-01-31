import { captureException } from '@sentry/nextjs';
import { State } from 'country-state-city';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/countries/{countryCode}/states:
 *     get:
 *       summary: Retrieve states list for a country
 *       description: Gets a list of states for a country.
 *       parameters:
 *         - name: countryCode
 *           in: path
 *           required: true
 *           description: Unique identifier of the country.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Successfully retrieved the list of states.
 */
export async function GET(_: Request, { params: { countryCode } }) {
  try {
    const statesList = State.getStatesOfCountry(countryCode);

    return new Response(JSON.stringify(statesList), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
