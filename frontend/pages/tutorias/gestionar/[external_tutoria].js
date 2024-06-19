import SideNavBar from '@/components/SideNavBar'
import AuthRoute from '@/pages/authRoute'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import styles from '../../../styles/Home.module.css'
import { obtenerTutoria, editarTutoria } from '@/pages/api/api'
import { format } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
export default function VerTutoria() {
    const router = useRouter();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [actionTaken, setActionTaken] = useState(false);
    const { external_tutoria } = router.query;
    const [editedObservacion, setEditedObservacion] = useState('');
    const [tutoriaData, setTutoriaData] = useState('');

    useEffect(() => {
        if (external_tutoria) {
            obtenerTutoria(external_tutoria).then((data) => {
                setTutoriaData(data.data);
                console.log("data cargada en linea 34 gestionar ", data.data);
            });
        }
    }, [external_tutoria]);
    const handleAprobar = () => {
        setActionTaken('aprobar');
        setShowConfirmation(true);
    };

    const handleRechazar = () => {
        setActionTaken('rechazar');
        setShowConfirmation(true);
    };

    const handleConfirm = () => {
        if (showConfirmation) {

            if (editedObservacion.split(' ').length <= 4) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Observación inválida',
                    text: 'Por favor, ingresa más de 4 palabras en la observación.',
                });
                return;
            }
            let newStatus = "";

            if (actionTaken === 'aprobar') {
                newStatus = "Aprobada";
            } else if (actionTaken === 'rechazar') {
                newStatus = "Rechazada";
            }

            if (newStatus) {

                const targetTimeZone = 'America/Guayaquil';

                const originalDate = new Date();
                const zonedDate = utcToZonedTime(originalDate, targetTimeZone);

                const formattedDateString = format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
                console.log(formattedDateString);
                editarTutoria(external_tutoria, { estado: newStatus, observacion: editedObservacion, fechaAceptada: formattedDateString }).then((response) => {
                    if (response.code === "200 OK") {
                        // Actualizar el estado local de la tutoría
                        setTutoriaData((prevData) => ({
                            ...prevData,
                            estado: newStatus,
                            observacion: editedObservacion,
                            fecha_aceptada: formattedDateString,
                        }));
                        Swal.fire({
                            icon: 'success',
                            title: 'Operación realizada con éxito!',
                            text: 'Tutoría aceptada.',
                        });
                        router.push('/tutorias');
                    } else {
                        alert(`Error al ${newStatus.toLowerCase()} la tutoría`);
                    }
                });
            }

            // Restablecer los valores de acción y confirmación
            setActionTaken('');
            setShowConfirmation(false);
        }
    };

    const handleCancel = () => {
        setActionTaken(false);
        setShowConfirmation(false);
    };
    return (
        <AuthRoute>
            <div className='flex h-screen bg-slate-400 dark:bg-dark-mode-background'>
                <Head>
                    <title>Ver Tutoría</title>
                </Head>
                <SideNavBar />
                <div className={styles.container}>
                    <div>
                        <h1 className={styles.tittle}>Detalles de la tutoría</h1>
                        <h1 style={{ paddingBottom: '13px' }} className={styles.minimalistsubtitleWhite}>DATOS DE LA TUTORÍA</h1>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-8">

                        <label className="block text-sm">
                            <span className="text-gray-700 dark:text-gray-400">Estado</span>
                            <input
                                className="block h-9 w-full pl-10 mt-1 text-sm text-black dark:text-gray-300 dark:bg-gray-700 bg-gray-200"
                                value={tutoriaData.estado}
                                readOnly
                            />
                        </label>
                        <label className="block text-sm">
                            <span className="text-gray-700 dark:text-gray-400">Fecha suguerida por el estudiante</span>
                            <input
                                className="block h-9 w-full pl-10 mt-1 text-sm text-black dark:text-gray-300 dark:bg-gray-700 bg-gray-200"
                                value={moment(tutoriaData.fecha_solicitada).format("DD/MM/YYYY - HH:mm")}
                                readOnly
                            />
                        </label>
                        <label className="block text-sm">
                            <span className="text-gray-700 dark:text-gray-400">Horas</span>
                            <input
                                className="block h-9 w-full pl-10 mt-1 text-sm text-black dark:text-gray-300 dark:bg-gray-700 bg-gray-200"
                                value={tutoriaData.horas}
                                readOnly
                            />
                        </label>
                        <label className="block text-sm">
                            <span className="text-gray-700 dark:text-gray-400">Tema</span>
                            <input
                                className="block h-9 w-full pl-10 mt-1 text-sm text-black dark:text-gray-300 dark:bg-gray-700 bg-gray-200"
                                value={tutoriaData.tema}
                                readOnly
                            />
                        </label>
                        <label className="block text-sm">
                            <span className="text-gray-700 dark:text-gray-400">Modalidad</span>
                            <input
                                className="block h-9 w-full pl-10 mt-1 text-sm text-black dark:text-gray-300 dark:bg-gray-700 bg-gray-200"
                                value={tutoriaData.modalidad}
                                readOnly
                            />
                        </label>
                        <label className="block text-sm">
                            <span className="text-gray-700 dark:text-gray-400">Nombre del estudiante</span>
                            <input
                                className="block h-9 w-full pl-10 mt-1 text-sm text-black dark:text-gray-300 dark:bg-gray-700 bg-gray-200"
                                value={tutoriaData.estudiante_nombre + " " + tutoriaData.estudiante_apellido}
                                readOnly
                            />
                        </label>

                        <label className="block text-sm">
                            <span className="text-gray-700 dark:text-gray-400">Observación</span>
                            <textarea
                                className="block w-full pl-10 mt-1 text-sm text-black dark:text-gray-300 dark:bg-gray-700 bg-gray-200"
                                value={tutoriaData.observacion}
                                onChange={(e) => setEditedObservacion(e.target.value)}
                            />
                        </label>
                    </div>
                    {tutoriaData.estado !== "Aprobada" && tutoriaData.estado !== "Rechazada" && (
                        <div className="px-4 py-3">
                            <div className="flex items-center space-x-4 text-sm">
                                <button
                                    className="items-center justify-between px-4 py-2 text-sm text-white transition-colors duration-1000 bg-green-600 border border-transparent rounded-lg hover:bg-green-700 w-fit"
                                    onClick={handleAprobar}
                                >
                                    Aceptar
                                </button>
                                <button
                                    className="items-center justify-between px-4 py-2 text-sm text-white transition-colors duration-1000 bg-red-600 border border-transparent rounded-lg hover:bg-red-700 w-fit"
                                    onClick={handleRechazar}
                                >
                                    Rechazar
                                </button>
                            </div>
                        </div>
                    )}
                    {showConfirmation && (
                        <div className="px-4 py-3">
                            <label className="block text-sm">
                                <span className="text-gray-700 dark:text-gray-400">¿Estás seguro de querer realizar esta acción?</span>
                            </label>
                            <div className="flex items-center space-x-4 text-sm">
                                <button
                                    className="items-center justify-between px-4 py-2 text-sm text-white transition-colors duration-1000 bg-green-600 border border-transparent rounded-lg hover:bg-green-700 w-fit"
                                    onClick={handleConfirm}
                                >
                                    Confirmar
                                </button>
                                <button
                                    className="items-center justify-between px-4 py-2 text-sm text-white transition-colors duration-1000 bg-red-600 border border-transparent rounded-lg hover:bg-red-700 w-fit"
                                    onClick={handleCancel}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthRoute>
    )
}
