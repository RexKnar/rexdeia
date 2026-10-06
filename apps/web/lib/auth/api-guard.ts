import { captureException } from '@sentry/nextjs';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Permission, Session } from 'types/auth';

import { authOptions } from '../auth';
import {
  resolveUserSecurityContext,
  UserAcademicSecurityContext,
} from './scope-resolver';

export interface RouteSecurityContext {
  session: any;
  security: UserAcademicSecurityContext;
  params: Record<string, string>;
}

export type ProtectedApiHandler = (
  req: Request,
  ctx: RouteSecurityContext
) => Promise<Response>;

/**
 * Route Guard wrapper for Next.js Route Handlers.
 * Enforces authenticated session, Layer 1 functional module permissions,
 * and passes resolved academic security context (Layer 2) to the handler.
 */
export function withPermission(
  moduleKey: string,
  requiredAction: Permission,
  handler: ProtectedApiHandler
) {
  return async (req: Request, routeCtx: { params?: Record<string, string> }) => {
    try {
      const session = await getServerSession(authOptions);

      if (!session || !session.branchId || !session.organizationId) {
        return new NextResponse(
          JSON.stringify({ error: 'UNAUTHORIZED' }),
          { status: StatusCodes.UNAUTHORIZED }
        );
      }

      const security = await resolveUserSecurityContext(session);

      // Check Layer 1 Functional Permission (unless Admin or BranchManager)
      if (!security.isBranchWide) {
        const moduleAccessList = session.user?.organizationRole?.moduleAccess;

        if (Array.isArray(moduleAccessList)) {
          const moduleAccess = moduleAccessList.find(
            (m) => m.module?.toLowerCase() === moduleKey.toLowerCase()
          );

          if (!moduleAccess || !moduleAccess[requiredAction]) {
            return new NextResponse(
              JSON.stringify({
                error: 'FORBIDDEN',
                message: `You do not have ${requiredAction} permission on the ${moduleKey} module.`,
              }),
              { status: StatusCodes.FORBIDDEN }
            );
          }
        }
      }

      // Execute the route handler with the security context
      return await handler(req, {
        session,
        security,
        params: routeCtx?.params || {},
      });
    } catch (error: any) {
      captureException(error);
      console.error(`Error in API route [${moduleKey}:${requiredAction}]:`, error);
      return new NextResponse(
        JSON.stringify({ error: error.message || 'INTERNAL_SERVER_ERROR' }),
        { status: StatusCodes.INTERNAL_SERVER_ERROR }
      );
    }
  };
}
