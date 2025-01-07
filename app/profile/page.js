'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  // 1. Définir un état pour le "user" (null au départ)
  const [user, setUser] = useState(null);
  
  // 2. Définir un état pour le "isRefreshing" (false au départ)
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // 3. Définir le "router"
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    const fetchProfile = async () => {
      try {    
        // 4. Récupérer le "token" du localStorage
        // 5. Faire la requête vers "/api/protected"
        const response = await fetch('/api/protected', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        // 6. Si la réponse n'est pas bonne, a un status 401, que "isRefreshing" est "false" et qu'on a bien un "refreshToken"
        if (!response.ok && !isRefreshing && refreshToken) {
          // 7. Passer isRefreshing à "true"
          setIsRefreshing(true);

          // 8. Faire la requête vers "/api/refresh"
          const refreshResponse = await fetch('/api/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });

          // 9. Si la réponse est bonne
          if (refreshResponse.ok) {
            // 10. Récupérer le token dans la réponse
            const { accessToken: newAccessToken } = await refreshResponse.json();
            
            // 11. Stocker ce token dans le localStorage
            localStorage.setItem('accessToken', newAccessToken);

            // 12. Passer isRefreshing à "false"
            setIsRefreshing(false);

            // 13. Appeler la fonction "fetchProfile"
            fetchProfile();
          } else {
            // 14. Passer isRefreshing à "false"
            setIsRefreshing(false);

            // 15. Déconnecter l'utilisateur
            handleLogout();
          }
        } else if (response.ok) {
          // 16. Récupérer les données de la réponse
          const data = await response.json();

          // 17. Utiliser "setUser" pour mettre à jour l'utilisateur avec les données récupérées.
          setUser(data);
        }
      } catch (error) {
        // 18. Rediriger vers la page "/login"
        router.push('/login'); 
      }
    };

    // 20. Rediriger vers la page "/login" si aucun token
    if (!accessToken) {
      router.push('/login');
    } else {
      // 21. Appeler la fonction "fetchProfile"
      fetchProfile();
    }
  }, [router]);

  const handleLogout = () => {
    // 22. Supprimer le "token" et le "refreshToken" du localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // 23. Rediriger vers la page "/login"
    router.push('/login');
  };

  return (
    <div>
      <h1>Profile Page</h1>
      {user ? <p>Welcome, {user.username}!</p> : <p>Loading...</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}