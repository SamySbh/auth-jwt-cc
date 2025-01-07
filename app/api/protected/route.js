import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  // 1. Récupérer "authorization" dans les "headers" et le stocker dans un variable "authHeader"
  const authHeader = request.headers.get('authorization');
  // 2. Récupérer le token dans le "authHeader"
  const token = authHeader && authHeader.split(' ')[1];

  // 3. S'il n'y a pas de token alors renvoyer une erreur
  if (!token) {
    return new NextResponse('No token provided', { status: 401 });
  }
  try {
    // 4. Vérifier le JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 5. Renvoyer la réponse avec le "decoded"
    return NextResponse.json(decoded);
  } catch (error) {
    // 6. Renvoyer une erreur
    return new NextResponse('Invalid token', { status: 403 });
  }
}
