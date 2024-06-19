import Head from "next/head";
import AuthRoute from "./authRoute";
import SideNavBar from "@/components/SideNavBar";
import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { listarTutorias, obtenerExternal, obtenerRol, reg_tutoriasDoc } from "./api/api";

export default function asignaturas() {
    const [llamada, setLlamada] = useState(false);
    const [external_id, setExternal_id] = useState(null);
    const [rol, setRol] = useState(null); // Agrega el estado del rol
    const [asignaturas, setAsignaturas] = useState([]); // Estado para almacenar las asignaturas

    useEffect(() => {
        obtenerExternal().then((data) => {
            console.log(data);
            setExternal_id(data.external_id);
        });
        obtenerRol().then(rol => {
            const userRol = rol;
            setRol(userRol);
            console.log(rol);
        });

        listarTutorias().then((data) => {
            console.log(data);
            setData(data.data);
        })
    }, [external_id]);
    const [data, setData] = useState([{
        asignatura: '',
        periodo: '',
        paralelo: '',
        carrera: '',
        facultad: '',
        ciclo: "",
        fechaEmision: '',
        external_persona: ''
    }]);
    useEffect(() => {
        if (rol === 'docente') {
            // Filtrar las asignaturas por external_persona en docente
            const asignaturasDocente = data.filter(item => item.external_persona === external_id);
            reg_tutoriasDoc().then((data) => {
                setAsignaturas(data);
            })
        } else {
            // Mostrar todas las asignaturas para otros roles
            setAsignaturas(data);
        }
    }, [data, rol]);
    return (
        <AuthRoute>
            <div className={styles.general}>
                <Head>
                    <title>Asignaturas</title>
                </Head>
                <SideNavBar />
                <div className={styles.container}>
                    <h1 className={styles.tittle}>Asignaturas</h1>
                    <table className="h-full w-full whitespace-no-wrap">
                        <thead>
                            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                <th className="px-4 py-3">Materia</th>
                                <th className="text-center px-4 py-3">Ciclo</th>
                                <th className="text-center px-4 py-3">Carrera</th>
                                <th className="text-center px-4 py-3">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                            {asignaturas.map((item, index) => (
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
                                                <p className="font-semibold">{item.asignatura}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">{item.facultad}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-center">{item.ciclo}</td>
                                    <td className="px-4 py-3 text-xs text-center">
                                        <span className={`px-2 py-1 font-semibold leading-tight`}>
                                            {item.carrera}
                                        </span>
                                    </td>
                                    {rol == 'docente' && (
                                        <td className="px-4 py-3 text-sm text-center">
                                            <div>
                                                <Link href={`/tutorias`}>
                                                    <button className="items-center justify-between px-4 py-2 text-sm text-white transition-colors duration-1000 bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 w-fit"
                                                    >Tutorias</button>
                                                </Link>
                                            </div>
                                        </td>
                                    )}
                                    {(rol == 'gestor' || rol == 'estudiante') && (
                                        <td className="px-4 py-3 text-sm text-center">
                                            <div>
                                                <Link href={`/tutorias/solicitar/${item.external_registro}`}>
                                                    <button className="items-center justify-between px-4 py-2 text-sm text-white transition-colors duration-1000 bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 w-fit"
                                                    >Solicitar Tutoría</button>
                                                </Link>
                                            </div>
                                        </td>
                                    )}

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthRoute>
    )
}