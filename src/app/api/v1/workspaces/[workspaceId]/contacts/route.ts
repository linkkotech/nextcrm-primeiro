import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await context.params;
  // TODO: Implementar listagem de contatos do workspace
  return NextResponse.json(
    { message: `Endpoint de listagem de contatos do workspace ${workspaceId} será implementado em breve.` },
    { status: 501 }
  );
}

export async function POST(
  request: Request,
  context: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await context.params;
  // TODO: Implementar criação de contato no workspace
  return NextResponse.json(
    { message: `Endpoint de criação de contato no workspace ${workspaceId} será implementado em breve.` },
    { status: 501 }
  );
}

