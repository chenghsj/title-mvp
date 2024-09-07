import { NextResponse } from 'next/server';
import { dummyReviews as data } from './dummy-review';

export async function GET() {
  const randomIndex = Math.floor(Math.random() * data.length);
  const randomItem = data[randomIndex];
  return NextResponse.json(randomItem);
}
