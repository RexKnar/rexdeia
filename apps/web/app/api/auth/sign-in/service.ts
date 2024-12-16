// // ./app/pages/api/signin.ts
// import type { NextApiRequest, NextApiResponse } from 'next';

// import { db } from '../../../../lib/db';
// import bcrypt from 'bcrypt';

// export default async function signin(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === 'POST') {
//     try {
//       const { email, password } = req.body;

//       // Validate the email and password
//       if (!email || !password) {
//         return res.status(400).json({ error: 'Email and password are required' });
//       }

//       // Fetch the user from the database
//       const user = await db.user.findUnique({
//         where: {
//           email,
//         },
//       });

//       // Check if the user exists and the password is correct
//       if (!user || !(await bcrypt.compare(password, user.password))) {
//         return res.status(401).json({ error: 'Invalid email or password' });
//       }

//       // Generate a JWT token
//       const token = jwt.sign(
//         {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           role: user.role,
//         },
//         process.env.JWT_SECRET,
//         {
//           expiresIn: '24h',
//         }
//       );

//       // Return the token in the response
//       return res.status(200).json({ token });
//     } catch (error) {
//       console.error('Error signing in:', error);
//       return res.status(500).json({ error: 'An unexpected error occurred' });
//     }
//   } else {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }
// }