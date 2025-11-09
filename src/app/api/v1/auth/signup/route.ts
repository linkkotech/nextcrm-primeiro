import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // TODO: Implementar lógica de signup
  return NextResponse.json(
    { message: "Endpoint de signup será implementado em breve." },
    { status: 501 }
  );
}

