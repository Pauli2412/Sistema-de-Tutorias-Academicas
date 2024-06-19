import React from 'react'
import SideNavBar from "@/components/SideNavBar";
import styles from '../../styles/Home.module.css';
import Head from "next/head";
import AuthRoute from "../authRoute";
import Image from "next/image";
import { useState, useEffect } from "react";
import { obtenerRol, obtenerExternal, listarTutoriasIndividuales } from '../api/api';
import Link from 'next/link';
import moment from 'moment';

export default function pendientes() {
    const [role, setRole] = useState('');
    const [data, setData] = useState([]); // Estado para almacenar todas las tutorías
    const [external_id, setExternal_id] = useState(null);
    useEffect(() => {
        obtenerExternal().then((data) => {
            console.log('asdadsad' + data);
            setExternal_id(data);
        });
        obtenerRol().then(rol => {
            const userRole = rol;
            setRole(userRole);
            console.log(rol);
        });
        // Lógica para obtener todas las tutorías aquí
        listarTutoriasIndividuales().then((data) => {
            console.log(data);
            setData(data.data);
        });
        // Cambia esto por tu lógica real

        // Lógica para obtener tutorías pendientes aquí
        // Actualiza el estado de tutoriasPendientes con los datos obtenidos
    }, []);
    const tutoriasPendientes = data.filter(tutoria => tutoria.estado == 'Solicitada' && tutoria.external_docente === external_id);


    return (
        <AuthRoute>
            <Head>
                <title>Tutorias</title>
            </Head>

            {role === 'docente' ? (
                <div className={styles.general}>
                    <SideNavBar />
                    <div className={styles.container}>
                        <h1 className={styles.tittle}>Tutorías Pendientes</h1>
                        <table className="h-full w-full whitespace-no-wrap">
                            <thead>
                                <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                    <th class="px-4 py-3">Materia</th>
                                    <th class="px-4 py-3">Estudiante</th>
                                    <th class="px-4 py-3">Tema</th>
                                    <th class="px-4 py-3">Estado</th>
                                    <th class="px-4 py-3">Fecha</th>
                                    <th class="px-4 py-3">Acción</th>

                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                                {tutoriasPendientes.map((tutoria, index) => (
                                    <tr key={index} className="text-gray-700 dark:text-gray-400">

                                        <td className="px-4 py-3">
                                            <div className="flex items-center text-sm">
                                                <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                                                    <Image
                                                        className="object-cover w-full h-full rounded-full"
                                                        src="/images/logo_unl.png"
                                                        alt=""
                                                        width={32}  // Ancho de la imagen en píxeles
                                                        height={32} // Altura de la imagen en píxeles
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{tutoria.materia}</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{tutoria.docente}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{tutoria.estudiante_nombre} {tutoria.estudiante_apellido}</td>
                                        <td className="px-4 py-3 text-sm">{tutoria.tema}</td>
                                        <td className="px-4 py-3 text-xs">
                                            <span className={`px-2 py-1 font-semibold leading-tight ${tutoria.estado === 'Aprobada' ? 'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100 rounded-full' : tutoria.estado === 'Negada' ? 'rounded-full text-red-700 bg-red-100 dark:bg-red-700 dark:text-red-100' : tutoria.estado === 'Pendiente' ? 'rounded-full text-orange-700 bg-orange-100 dark:text-white dark:bg-orange-600' : ' rounded-full text-gray-700 bg-gray-100 dark:text-gray-100 dark:bg-gray-700'}`}>
                                                {tutoria.estado}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {moment(tutoria.fecha_solicitada).format('YYYY-MM-DD')}
                                            <p className="text-xs text-gray-600 dark:text-gray-400">{moment(tutoria.fecha_solicitada).format('HH-mm')} - {tutoria.horas} hora(s)</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center space-x-4 text-sm">
                                                <Link href={`/tutorias/gestionar/${tutoria.external_id_tutoria}`}>
                                                    <button className="items-center justify-between px-4 py-2 text-sm text-white transition-colors duration-1000 bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 w-fit">
                                                        Gestionar
                                                    </button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>

                                ))}

                            </tbody>
                        </table>
                    </div>
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
