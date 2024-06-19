import React from 'react';
import AuthRoute from './authRoute';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import SideNavBar from '@/components/SideNavBar';
import { listarPersonas, obtenerRol } from './api/api';
import Link from 'next/link';
export default function admin() {
    const [role, setRole] = useState('');
    const [llamada, setLlamada] = useState(false);
    useEffect(() => {
        obtenerRol().then(rol => {
            const userRole = rol;
            setRole(userRole);
            console.log(rol);
        });
    }, []);
    const [usuarios, setUsuarios] = useState([]);

    if (!llamada) {
        try {
            listarPersonas().then((data) => {
                console.log(data.data);
                setUsuarios(data.data);
                setLlamada(true);
            });
        } catch (error) {
            console.log("Error fetching data:", error);
        }
    }
    return (
        <AuthRoute>
            <Head>
                <title>Administración</title>
            </Head>
            {role === 'admin' ? (
                <div className={styles.general}>
                    <SideNavBar />
                    <div className={styles.container}>
                        <h1 className={styles.tittle}>Administración de usuarios</h1>
                        <table className="h-full w-full whitespace-no-wrap">
                            <thead>
                                <tr class="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                    <th class="px-4 py-3">Identificación</th>
                                    <th class="px-4 py-3">Nombres</th>
                                    <th class="px-4 py-3">Apellidos</th>
                                    <th class="px-4 py-3">Rol</th>
                                    <th class="px-4 py-3 text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                                {usuarios.map((usuario, index) => (
                                    <tr key={index} className="text-gray-700 dark:text-gray-400">
                                        <td className="px-4 py-3 text-sm">{usuario.identificacion}</td>
                                        <td className="px-4 py-3 text-sm">{usuario.nombres}</td>
                                        <td className="px-4 py-3 text-sm">{usuario.apellidos}</td>
                                        <td className="px-4 py-3 text-sm">{usuario.rol}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <div className="text-center space-x-4 text-sm">
                                                <Link href={`/cuenta/${usuario.external_persona}`}>
                                                    <button className="px-4 py-2 text-sm text-white transition-colors duration-1000 bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 w-fit">
                                                        Editar
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
