import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { listarPersonas, registro } from './api/api';
export default function Register() {
    const [persona, setPersona] = useState([]);
    const [apellidos, setApellidos] = useState('');
    const [nombres, setNombres] = useState('');
    const [identificacion, setIdentificacion] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        listarPersonas().then((data) => {
            console.log("***PERSONA", data);
            setPersona(data.data);
        })
    }, []);

    const isValidName = (name) => /^[a-zA-Z\s]+$/.test(name);
    const isValidIdentificacion = (identificacion) => /^\d{10}$/.test(identificacion);
    const isValidDireccion = (direccion) => direccion.length >= 4;
    const isValidTelefono = (telefono) => /^\d{10}$/.test(telefono);
    const isValidCorreo = (correo) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(correo);
    const isValidClave = (clave) => clave.length >= 6;

    const handleRegister = async () => {
        if (!apellidos || !nombres || !identificacion || !direccion || !telefono || !email || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos vacíos',
                text: 'Por favor, completa todos los campos.',
            });
            return;
        }

        if (!isValidName(nombres) || !isValidName(apellidos)) {
            Swal.fire({
                icon: 'warning',
                title: 'Error de validación',
                text: 'Por favor ingresa nombres y apellidos válidos.',
            });
            return;
        }

        if (!isValidIdentificacion(identificacion)) {
            Swal.fire({
                icon: 'warning',
                title: 'Error de validación',
                text: 'Por favor ingresa una identificación válida.',
            });
            return;
        }

        if (!isValidDireccion(direccion)) {
            Swal.fire({
                icon: 'warning',
                title: 'Error de validación',
                text: 'Por favor ingresa una dirección válida.',
            });
            return;
        }

        if (!isValidTelefono(telefono)) {
            Swal.fire({
                icon: 'warning',
                title: 'Error de validación',
                text: 'Por favor ingresa un teléfono válido.',
            });
            return;
        }

        if (!isValidCorreo(email)) {
            Swal.fire({
                icon: 'warning',
                title: 'Error de validación',
                text: 'Por favor ingresa un correo válido.',
            });
            return;
        }

        if (!isValidClave(password)) {
            Swal.fire({
                icon: 'warning',
                title: 'Error de validación',
                text: 'Por favor ingresa una contraseña de más de 6 carácteres.',
            });
            return;
        }

        const identificacionExists = persona.some((item) => item.identificacion === identificacion);
        const correoExists = persona.some((item) => item.correo === email);

        if (identificacionExists) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'La identificación ya se encuentra registrada!',
            });
            return;
        } else if (correoExists) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El Correo ya se encuentra registrado!',
            });
            return;
        }

        try {
            const registroData = {
                apellidos,
                nombres,
                identificacion,
                direccion,
                telefono,
                tipo_persona: "estudiante",
                cuenta: {
                    correo: email,
                    clave: password,
                },
            };

            const response = await registro(registroData);

            if (response.code === "200 OK") {
                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    text: '¡Cuenta creada con éxito!',
                });
                router.push('/login2');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error al crear la cuenta!',
                });
            }

            // Limpiar los campos después del registro exitoso
            setApellidos('');
            setNombres('');
            setIdentificacion('');
            setDireccion('');
            setTelefono('');
            setEmail('');
            setPassword('');
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de registro',
                text: 'Hubo un problema al registrar el usuario.',
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200">
            <Head>
                <title>Registro</title>
            </Head>
            <header className="w-full text-center">
                <Image
                    src="/images/logo_sac_unl.jpg"
                    alt="Logo"
                    layout="responsive"
                    width={1171}
                    height={205}
                />
            </header>

            <div className="bg-white p-8 rounded shadow-md w-96 mt-4">
                <h1 className="text-2xl font-semibold text-center mb-4">
                    Entorno Virtual de Gestión de Tutorías - EVGT
                </h1>
                <div>
                    <div className="mb-4">
                        <label htmlFor="apellidos" className="block text-sm font-medium">
                            Apellidos:
                        </label>
                        <input
                            id="apellidos"
                            value={apellidos}
                            onChange={(e) => setApellidos(e.target.value)}
                            type="text"
                            className="w-full border-gray-300 rounded-sm p-2"
                            placeholder="Apellidos"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="nombres" className="block text-sm font-medium">
                            Nombres:
                        </label>
                        <input
                            id="nombres"
                            value={nombres}
                            onChange={(e) => setNombres(e.target.value)}
                            type="text"
                            className="w-full border-gray-300 rounded-sm p-2"
                            placeholder="Nombres"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="identificacion" className="block text-sm font-medium">
                            Identificación:
                        </label>
                        <input
                            id="identificacion"
                            value={identificacion}
                            onChange={(e) => setIdentificacion(e.target.value)}
                            type="text"
                            className="w-full border-gray-300 rounded-sm p-2"
                            placeholder="Identificación"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="direccion" className="block text-sm font-medium">
                            Dirección:
                        </label>
                        <input
                            id="direccion"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            type="text"
                            className="w-full border-gray-300 rounded-sm p-2"
                            placeholder="Dirección"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="telefono" className="block text-sm font-medium">
                            Teléfono:
                        </label>
                        <input
                            id="telefono"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            type="text"
                            className="w-full border-gray-300 rounded-sm p-2"
                            placeholder="Teléfono"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium">
                            Correo Electrónico:
                        </label>
                        <input
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="text"
                            className="w-full border-gray-300 rounded-sm p-2"
                            placeholder="Correo Electrónico"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium">
                            Contraseña:
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-gray-300 rounded-sm p-2"
                            placeholder="Contraseña"
                        />
                    </div>
                    <button
                        onClick={handleRegister}
                        className="w-full bg-blue-500 text-white py-2 rounded-sm hover:bg-blue-600 transition"
                    >
                        Registrarse
                    </button>
                </div>
            </div>
        </div>
    );
}
