import Link from 'next/link';
import React from 'react'
import Head from 'next/head';
import { useState } from 'react';
import { loginUser, obtener } from './api/api';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

import Image from 'next/image';
export default function login2() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const isValidEmail = (email) => {
        // Simple email validation using a regular expression
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(email);
    };
    const handleLogin = async () => {
        if (!email || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos vacíos',
                text: 'Por favor, completa todos los campos.',
            });
            return;
        }

        if (!isValidEmail(email)) {
            Swal.fire({
                icon: 'warning',
                title: 'Formato de correo inválido',
                text: 'Por favor, ingresa un correo electrónico válido.',
            });
            return;
        }
        try {
            loginUser(email, password)
                .then((response) => {
                    console.log("iniciando sesion");
                    console.log(response.data.data.external); // Aquí puedes acceder a los datos de la respuesta
                    if (response.data.code == "200 OK") {
                        router.push('/home');
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error de inicio de sesión',
                            text: 'Las credenciales de inicio de sesión son inválidas.',
                        });
                    }
                })
                .catch((error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de inicio de sesión',
                        text: 'Las credenciales de inicio de sesión son inválidas.',
                    });
                    console.error('Error al iniciar sesión:', error);
                });
        } catch (error) {
            console.log("error: " + error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200">
            <Head>
                <title>Inicio de sesión </title>
            </Head>
            <header className="w-full text-center">
                <Image
                    src="/images/logo_sac_unl.jpg" // Ruta relativa a la imagen
                    alt="Logo"
                    layout="responsive"
                    width={1171} // Ancho en píxeles
                    height={205} // Alto en píxeles
                />
            </header>

            {/* Form */}
            <div className="bg-white p-8 rounded shadow-md w-96 mt-4">
                <h1 className="text-2xl font-semibold text-center mb-4">
                    Entorno Virtual de Gestión de Tutorías - EVGT
                </h1>
                <div>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium">
                            Nombre de usuario:
                        </label>
                        <input
                            id='email' value={email} onChange={(e) => setEmail(e.target.value)}
                            type="text"
                            className="w-full border-gray-300 rounded-sm p-2"
                            placeholder="Nombre de usuario"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium">
                            Contraseña:
                        </label>
                        <input
                            type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-gray-300 rounded-sm p-2"
                            placeholder="Contraseña"
                        />
                    </div>
                    <button
                        onClick={handleLogin}
                        className="w-full bg-blue-500 text-white py-2 rounded-sm hover:bg-blue-600 transition"
                    >
                        Iniciar Sesión
                    </button>
                    <h1 style={{ paddingTop: '13px', paddingBottom: '13px'}} className='text-sm' >¿Aún no tienes cuenta? 
                    <Link style={{ color: '#1e7fd6' }} href="/register2" passHref>
                        Regístrate Aquí
                    </Link>
                </h1>
                </div>
            </div>
        </div>
    );
}
