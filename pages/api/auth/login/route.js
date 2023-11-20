'use server';

import { serialize } from 'cookie';
import { sign } from 'jsonwebtoken';
import { client } from '../../../../sanity/utils/client';
// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse } from 'next/server';

const MAX_AGE = 60 * 60 * 24 * 30;

export async function POST(req) {
  const body = req.json();

  const { email, password } = body;

  const query = '*[ _type == "user"]';

  const users = await client.fetch(query); // err: users lar bulunamadi hatasi

  if (!users) {
    return NextResponse.json({ message: 'Kullanicilara ulasilamiyor', status: 401 });
  }

  const user = users.find((x) => x.email === email);

  if (!user) {
    return NextResponse.json({ message: 'Kullanici bulunamadi', status: 401 });
  } // user buunamadi hatasi

  if (user.email !== email && user.password && password) {
    return NextResponse.json({ message: 'Giris icin yetkilendirilemediniz', status: 401 });
  }

  const secret = process.env.JWT_SECRET || '';

  const token = sign({ user }, secret, { expiresIn: MAX_AGE });

  const serialized = serialize('OutsiteJWT', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: MAX_AGE,
    path: '/',
  });

  const response = {
    message: 'Authenticated!',
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { 'Set-Cookie': serialized },
  });
}
