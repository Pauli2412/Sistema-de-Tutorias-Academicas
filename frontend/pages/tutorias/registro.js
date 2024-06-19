import React from 'react'
import SideNavBar from "@/components/SideNavBar";
import styles from '../../styles/Home.module.css';
import Head from "next/head";
import Swal from 'sweetalert2';
import AuthRoute from "../authRoute";
import { useState, useEffect } from "react";
import { cargarAsignaturas, crearRegistroTutoria, obtenerExternal, obtenerRol } from '../api/api';
import { useRouter } from 'next/router';
export default function registro() {
    const router = useRouter();
    const [role, setRole] = useState('');
    const [data, setData] = useState({
        external_asignatura: "",
        periodo: '',
        paralelo: '',
        fechaEmision: new Date().toISOString().substr(0, 10),
        external_persona: obtenerExternal(),
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("------");
        if (!isValidParalelo(data.paralelo)) {
            Swal.fire({
                icon: 'warning',
                title: 'Paralelo inválido',
                text: 'Por favor, ingresa un paralelo válido.',
            });
            return;
        }

        if (!isValidPeriodo(data.periodo)) {
            Swal.fire({
                icon: 'warning',
                title: 'Periodo inválido',
                text: 'Por favor, ingresa un periodo válido (válidos desde el 2023).',
            });
            return;
        }
        console.log(data);
        crearRegistroTutoria(data).then((response) => {
            console.log(response);
            if (response.code != "200 OK") {
                alert("Contraseña Incorrecta");
                router.reload();
            } else {
                router.push("/tutorias");
            }
        });
        setData({
            external_asignatura: "",
            periodo: '',
            paralelo: '',
            fechaEmision: new Date().toISOString().substr(0, 10),
        });

    };


    const handleAsignaturaChange = (event) => {
        const selectedAsignatura = event.target.value;
        setData((prevData) => ({
            ...prevData,
            external_asignatura: asignaturas[event.target.selectedIndex].external_asignatura,
        }));
        obtenerExternal().then((data) => {
            setData((prevData) => ({
                ...prevData,
                external_persona: data,
            }));
        });
        console.log(asignaturas[event.target.selectedIndex].external_asignatura);
    };

    const isValidParalelo = (paralelo) => {
        return /^[A-Za-z]$/.test(paralelo);
    };

    const isValidPeriodo = (periodo) => {
        return periodo.length === 4 && parseInt(periodo) >= 2023;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const [asignaturas, setAsignaturas] = useState([]);
    useEffect(() => {
        obtenerRol().then(rol => {
            const userRole = rol;
            setRole(userRole);
            console.log(rol);
        });
        // Carga tutorias pendientes
        cargarAsignaturas().then((data) => {
            console.log(data.data);
            setAsignaturas(data.data);
        });

        // Lógica para obtener tutorías pendientes aquí
        // Actualiza el estado de tutoriasPendientes con los datos obtenidos
    }, []);

    return (
        <AuthRoute>
            <Head>
                <title>Registro de tutorías</title>
            </Head>

            {role === 'docente' ? (
                <div className={styles.general}>
                    <SideNavBar />
                    <form className={styles.container} onSubmit={handleSubmit}>
                        <h1 className={styles.tittle}>Registro Tutorías</h1>
                        <div className="w-full grid grid-cols-2 gap-4 mb-8">
                            <label className="block text-sm">
                                <span className="text-gray-700 dark:text-gray-400">Asignatura</span>
                                <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400 py-1">
                                    <select className="block w-full mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray " value={data.asignatura} onChange={handleAsignaturaChange}>
                                        {asignaturas.map((asignatura) => (
                                            <option key={asignatura.asignatura} value={asignatura.asignatura}>
                                                {asignatura.asignatura}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </label>

                            <label className="block text-sm">
                                <span className="text-gray-700 dark:text-gray-400">Periodo</span>
                                <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400 py-1">
                                    <input
                                        className="block w-full mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                                        placeholder="2023" name="periodo" value={data.periodo} onChange={handleInputChange}
                                        required
                                    />
                                    <div className="absolute inset-y-0 flex items-center ml-3 pointer-events-none">
                                    </div>
                                </div>
                            </label>

                            <label className="block text-sm">
                                <span className="text-gray-700 dark:text-gray-400">Paralelo</span>
                                <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400 py-1">
                                    <input
                                        className="block w-full mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                                        placeholder="A" name="paralelo" value={data.paralelo} onChange={handleInputChange}
                                        required
                                    />
                                    <div className="absolute inset-y-0 flex items-center ml-3 pointer-events-none">
                                    </div>
                                </div>
                            </label>

                            <label className="block text-sm">
                                <span className="text-gray-700 dark:text-gray-400">Fecha de Emisión (Actual)</span>
                                <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400 py-1">
                                    <input
                                        className="block w-full mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                                        placeholder="yyyy-mm-dd" name="fechaActual" value={data.fechaEmision} readOnly
                                    />
                                    <div className="absolute inset-y-0 flex items-center ml-3 pointer-events-none">
                                        {/* Icono u otra representación visual aquí */}
                                    </div>
                                </div>
                            </label>
                        </div>
                        <button
                            className="flex items-center justify-between px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple w-fit"
                            type="submit"
                        >
                            <span className=''>Crear Registro</span>
                        </button>
                    </form>
                </div>
            ) : (
                <div className={styles.general}>
                    <SideNavBar />
                    <div className={styles.container}>
                        <h1 className={styles.tittle}>ERROR - Recurso no autorizado</h1>
                    </div>
                </div>

            )}

        </AuthRoute>
    )
}
