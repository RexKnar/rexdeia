import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';

import { GetLanguagesResponse } from '../../../../lib/domain/language';
import { languages } from './data';

/**
 * @swagger
 * /api/languages:
 *     get:
 *       summary: Retrieve languages list
 *       description: Gets a list of all languages.
 *       responses:
 *         '200':
 *           description: Successfully retrieved the list of languages.
 */
export async function GET() {
  try {
    return new NextResponse<GetLanguagesResponse>(JSON.stringify(languages), {
      status: StatusCodes.OK,
    });
  } catch (e) {
    captureException(e);
    return new NextResponse(e, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
