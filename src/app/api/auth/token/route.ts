import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { getToken } = await auth();
    const token = await getToken();
    console.log('token:', token);

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error getting token:', error);
    return NextResponse.json({ token: null }, { status: 401 });
  }
}
