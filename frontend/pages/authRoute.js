import { useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthRoute = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    // Aquí puedes agregar la lógica para verificar si el usuario tiene un token válido en el Local Storage o las Cookies
    const token = localStorage.getItem('token'); // Obtener el token almacenado en el Local Storage

    if (!token) {
      // Si el usuario no tiene un token válido, redirige a la página de inicio de sesión
      router.push('/login');
    }
  }, []);

  return children;
};

export default AuthRoute;