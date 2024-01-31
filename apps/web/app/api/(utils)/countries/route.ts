import { captureException } from '@sentry/nextjs';
import { Country } from 'country-state-city';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/countries:
 *     get:
 *       summary: Retrieve countries list
 *       description: Gets a list of all countries.
 *       responses:
 *         '200':
 *           description: Successfully retrieved the list of countries.
 */
export async function GET() {
  try {
    const countriesList = Country.getAllCountries();

    return new Response(JSON.stringify(countriesList), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
