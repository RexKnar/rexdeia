import { authOptions } from 'lib/auth';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { updateUserPassword } from '../service';

/**
 * @swagger
 * /api/user/password:
 *   put:
 *     summary: Change user password
 *     description: Allows logged-in users to change their password by providing the current password.
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: The user's current password.
 *               newPassword:
 *                 type: string
 *                 description: The new password to be set.
 *     responses:
 *       '200':
 *         description: Password changed successfully.
 *       '400':
 *         description: Current and new passwords are required.
 *       '401':
 *         description: Unauthorized access or invalid current password.
 *       '500':
 *         description: Internal server error.
 */

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

  try {
    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword)
      return NextResponse.json({ error: 'MISSING_FIELDS' }, { status: 400 });

    await updateUserPassword(session.user.id, currentPassword, newPassword);
    return NextResponse.json(
      { message: 'Password changed successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === 'INVALID_CREDENTIALS' ? 401 : 500 }
    );
  }
}
