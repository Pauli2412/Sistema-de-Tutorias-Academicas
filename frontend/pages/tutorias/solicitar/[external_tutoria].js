import SideNavBar from '@/components/SideNavBar'
import AuthRoute from '@/pages/authRoute'
import Head from 'next/head'
import React, { useEffect } from 'react'
import styles from '../../../styles/Home.module.css'
import { useState } from 'react'
import { guardarTutoria, obtenerExternal, obtenerRegistroTutoria } from '@/pages/api/api'
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import Swal from 'sweetalert2'

export default function solicitar() {
    const ModalidadOptions = ['Presencial', 'Virtual'];
    const router = useRouter();
    const external_tutoria = router.query.external_tutoria;
    const [external_estudiante, setExternal_estudiante] = useState(null);
    const [tutoriaData, setTutoriaData] = useState({
        external_estudiante: external_estudiante,
        external_registroTutorias: external_tutoria,
        fechaSolicitada: '',
        horas: '',
        modalidad: '',
        tema: '',
        fechaAceptada: '',
        observacion: '',
        estado: 'Solicitada'
    });
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setTutoriaData({
            ...tutoriaData,
            [name]: value
        });
        ;
        event.preventDefault();
    };
    const handleSubmit = (event) => {
        event.preventDefault();

        const targetTimeZone = 'America/Guayaquil';

        const originalDate = new Date(tutoriaData.fechaSolicitada);
        const zonedDate = utcToZonedTime(originalDate, targetTimeZone);

        const formattedDateString = format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        tutoriaData.fechaSolicitada = formattedDateString;
        console.log(`Fecha original ${originalDate}`);
        console.log(`Fecha formateada: ${formattedDateString}`);
        console.log("DAT", tutoriaData);
        console.log("fecha cambiada", tutoriaData);

        guardarTutoria(tutoriaData).then((response) => {
            console.log(response);
            if (response.code != "200 OK") {
                Swal.fire({
                    icon: 'Error',
                    title: 'Oops...',
                    text: 'Ocurrió un error, revisa los campos!',
                })
                router.reload();
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Completado!',
                    text: 'Tutoría solicitada con exito!',
                })
                router.push("/tutorias");
            }
        })
        console.log(tutoriaData);
    };



    useEffect(() => {

        if (external_tutoria) {

            obtenerRegistroTutoria(external_tutoria).then((data) => {
                console.log(data);
                setTutoriaData(
                    {
                        external_estudiante: external_estudiante,
                        external_registroTutorias: external_tutoria,
                        fechaSolicitada: '',
                        horas: '',
                        modalidad: '',
                        tema: '',
                        fechaAceptada: '',
                        estado: 'Solicitada'
                    }
                )
            })
        }
    }, [external_tutoria, external_estudiante]);

    return (
        <AuthRoute>
            <div className={styles.general}>
                <Head>
                    <title>Solicitar tutoría</title>
                </Head>
                <SideNavBar />
                <form className={styles.container} onSubmit={handleSubmit}>
                    <div>
                        <h1 className={styles.tittle}>Solicitar tutoría</h1>
                        <h1 style={{ paddingBottom: '13px' }} className={styles.minimalistsubtitleWhite}>DATOS DE LA TUTORÍA</h1>
                    </div>
                    <div className="w-full grid grid-cols-2 gap-4 mb-8">
                        <label className="block text-sm">
                            <span className="text-gray-700 dark:text-gray-400">Tema</span>
                            <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400 py-1">
                                <input
                                    className="block w-full pl-10 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                                    placeholder="Tema de la tutoría"
                                    name="tema"
                                    value={tutoriaData.tema}
                                    onChange={handleInputChange}
                                />
                                <div className="absolute inset-y-0 flex items-center ml-3 pointer-events-none">
                                    <div
                                        className="absolute"
                                        style={{
                                            opacity: "0.7",
                                            backgroundSize: "cover",
                                            width: "20px",
                                            height: "20px",
                                            backgroundImage: `url("/images/icon_credentials_user.png")`
                                        }}
                                    />
                                </div>
                            </div>
                        </label>
                        <label className="block text-sm">
                            <span className="text-gray-700 dark:text-gray-400">Modalidad</span>
                            <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400 py-1">
                                <select
                                    className="mt-1 block w-full text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                                    name="modalidad"
                                    value={tutoriaData.modalidad}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Seleccione una modalidad</option>
                                    {ModalidadOptions.map((modalidad) => (
                                        <option key={modalidad} value={modalidad}>
                                            {modalidad}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </label>
                        <label className="block text-sm">
                            <span className="text-gray-700 dark:text-gray-400">Horas Solicitadas</span>
                            <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400 py-1">
                                <input
                                    className="block w-full pl-10 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                                    type="number"
                                    placeholder="2"
                                    name="horas"
                                    value={tutoriaData.horas}
                                    onChange={handleInputChange}
                                />
                                <div className="absolute inset-y-0 flex items-center ml-3 pointer-events-none">
                                    <div
                                        className="absolute"
                                        style={{
                                            opacity: "0.7",
                                            backgroundSize: "cover",
                                            width: "20px",
                                            height: "20px",
                                            backgroundImage: `url("/images/icon_credentials_user.png")`
                                        }}
                                    />
                                </div>

                            </div>
                        </label>
                        <label className="block text-sm">
                            <span className="text-gray-700 dark:text-gray-400">Fecha y hora de la tutoría</span>
                            <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400 py-1">
                                <input
                                    className="block w-full pl-10 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                                    type="datetime-local" // Cambiado a "datetime-local"
                                    name="fechaSolicitada" // Cambiado el nombre
                                    value={tutoriaData.fechaSolicitada} // Cambiado el valor
                                    onChange={handleInputChange}
                                />
                                <div className="absolute inset-y-0 flex items-center ml-3 pointer-events-none">
                                    <div
                                        className="absolute"
                                        style={{
                                            opacity: "0.7",
                                            backgroundSize: "cover",
                                            width: "20px",
                                            height: "20px",
                                            backgroundImage: `url("/images/icon_credentials_user.png")`
                                        }}
                                    />
                                </div>
                            </div>
                        </label>


                        <button
                            className="mt-6 h-fit flex items-center justify-between px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple w-fit"
                            type="submit"
                        >

                            <span className=''>Solicitar Tutoría</span>
                        </button>

                    </div>
                </form>
            </div>
        </AuthRoute>
    )
}
