import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { workspaceId: string } }
) {
  // TODO: Implementar listagem de contatos do workspace
  return NextResponse.json(
    { message: `Endpoint de listagem de contatos do workspace ${params.workspaceId} será implementado em breve.` },
    { status: 501 }
  );
}

export async function POST(
  request: Request,
  { params }: { params: { workspaceId: string } }
) {
  // TODO: Implementar criação de contato no workspace
  return NextResponse.json(
    { message: `Endpoint de criação de contato no workspace ${params.workspaceId} será implementado em breve.` },
    { status: 501 }
  );
}

