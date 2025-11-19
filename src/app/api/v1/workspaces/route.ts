import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Implementar listagem de workspaces
  return NextResponse.json(
    { message: "Endpoint de listagem de workspaces será implementado em breve." },
    { status: 501 }
  );
}

export async function POST() {
  // TODO: Implementar criação de workspace
  return NextResponse.json(
    { message: "Endpoint de criação de workspace será implementado em breve." },
    { status: 501 }
  );
}

