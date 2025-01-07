import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  // 1. Récuperer le "refreshToken" de la requête
  const { refreshToken } = await request.json();

  // 2. S'il n'y a pas de "refreshToken", renvoyer une erreur
  if (!refreshToken) {
    return new NextResponse('No refresh token provided', { status: 401 });
  }
  try {
    // 3. Vérifier le refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // 4. Générer un nouveau token d'accès
    const accessToken = jwt.sign({ username: decoded.username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

    // 5. Renvoyer le nouveau token en réponse
    return NextResponse.json({ accessToken });

  } catch (error) {
    // 6. Renvoyer une erreur spécifiant que le "refreshToken" n'est pas valide.
    return new NextResponse('Invalid refresh token', { status: 403 });
  }
}
