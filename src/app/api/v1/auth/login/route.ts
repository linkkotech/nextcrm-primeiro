import { NextResponse } from 'next/server';
import { authenticateWithCredentials } from '@/services/auth.service';
import { loginSchema } from '@/schemas/auth.schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validação dos dados de entrada
    const validatedFields = loginSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { message: "Email e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const { email, password } = validatedFields.data;

    // A API chama a função de serviço reutilizável
    const result = await authenticateWithCredentials(email, password);

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: result.message },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erro no endpoint de login:', error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}

