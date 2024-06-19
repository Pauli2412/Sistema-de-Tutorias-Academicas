import SideNavBar from "@/components/SideNavBar";
import styles from '../../styles/Home.module.css';
import Head from "next/head";
import AuthRoute from "../authRoute";
import moment from 'moment';
import Image from "next/image";
import Swal from 'sweetalert2'
import { useState, useEffect } from "react";
import { obtenerRol, listarTutorias, tutoriasDoc, asignaturasEst, finalizarTutoria, editarTutoria } from "../api/api";
import Link from "next/link";
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { format, set } from 'date-fns';
import { useRouter } from "next/router";

export default function Tutorias() {
    const router = useRouter();
    const [role, setRole] = useState('');
    const [data, setData] = useState([]); // Estado para almacenar todas las tutorías
    const [currentDate, setCurrentDate] = useState(''); // Estado para almacenar la fecha actual
    const [tutoriaFinalizada, setTutoriaFinalizada] = useState('');
    const [nuevaFecha, setNuevaFecha] = useState('');
    // Estado para almacenar la fecha actual
    const detalles = (index) => {
        Swal.fire({
            title: `${data[index].materia}`,
            html: `
              <p><strong>Estudiante:</strong> ${data[index].estudiante_nombre} ${data[index].estudiante_apellido}</p>
              <p><strong>Fecha de tutoría:</strong> ${moment(data[index].fecha_solicitada).format("YYYY-MM-DD - HH:mm")}</p>
              <p><strong>Estado:</strong> ${data[index].estado}</p>
              <p><strong>Docente:</strong> ${data[index].docente}</p>
              <p><strong>Horas:</strong> ${data[index].horas}</p>
              <p><strong>Tema:</strong> ${data[index].tema}</p>
              <p><strong>Modalidad:</strong> ${data[index].modalidad}</p>
              <p><strong>Materia:</strong> ${data[index].materia}</p>
              ${data[index].fecha_finalizada !== null ? `<p><strong>Fecha Finalizada:</strong> ${moment(data[index].fecha_finalizada).format("YYYY-MM-DD - HH:mm")}</p>` : ''}
              <p><strong>Observación:</strong> ${data[index].observacion}</p>
            `
        });
    }

    const verInformacion = (index) => {
        Swal.fire({
            title: `${data[index].materia}`,
            html: `
                <p><strong>Observación de la tutoría:</strong> ${data[index].observacion}</p>
                `
        })
    }
    // Reprogramar fecha
    const handleOpenModal = (index) => {
        Swal.fire({
            title: 'Editar Fechas',
            html: `
                <div>
                    <p>Fecha Actual: ${moment(data[index].fecha_solicitada).format("YYYY-MM-DD - HH:mm")}</p>
                    <input
                        type="datetime-local"
                        id="fechaEditable"
                        class="swal2-input"
                    />
                </div>
            `,
            focusConfirm: false,
            preConfirm: () => {
                const fechaEditable = document.getElementById('fechaEditable').value;
                const targetTimeZone = 'America/Guayaquil';
                const originalDate = new Date(fechaEditable);
                const zonedDate = utcToZonedTime(originalDate, targetTimeZone);
                const formattedDateString = format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
                console.log('fecha a editar ' + data[index].fecha_solicitada);
                console.log('fecha editable ' + formattedDateString);
                reprogramarTutoria(index, formattedDateString);
            },
        });
    };

    const reprogramarTutoria = async (index, formattedDateString) => {
        try {
            console.log('console nueva fecha   ' + formattedDateString);
            console.log('external tutoria ' + data[index].external_id_tutoria);
            // Make API call to update the tutoria
            editarTutoria(data[index].external_id_tutoria, {
                estado: 'Re-Asignada', // Replace with the actual value you want
                observacion: data[index].observacion,
                fechaSolicitada: formattedDateString, // Use the nuevaFecha state value here
            }).then((response) => {
                if (response.code === "200 OK") {
                    Swal.fire({
                        title: 'Tutoría Reprogramada',
                        text: 'La tutoría ha sido reprogramada exitosamente.',
                        icon: 'success',
                    });
                    router.push('/tutorias');
                }
            });
            // Handle response and update the data state if necessary
            // ...
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un error al reprogramar la tutoría.',
                icon: 'error',
            });
        }
    };

    const handleFinalizar = (index) => {
        Swal.fire({
            title: 'Finalizar Tutoría',
            html: `
                <div>
                <p><strong>${data[index].materia}</strong></p>
                <p><a>${data[index].estudiante_nombre} ${data[index].estudiante_apellido}</a></p>
                <p>Agregue una observación:</p>
                  <input
                    placeholder="El estudiante asistió y..."
                    type="textarea"
                    id="observacion"
                    class="swal2-input"
                  />
                </div>
              `,
            focusConfirm: false,
            preConfirm: async () => {
                const popup = Swal.getPopup();
                const observacion = popup.querySelector('#observacion').value;
                const targetTimeZone = 'America/Guayaquil';
                const originalDate = new Date();
                const zonedDate = utcToZonedTime(originalDate, targetTimeZone);
                const formattedDateString = format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
                finalizarTutoria(data[index].external_id_tutoria, { observacion: observacion, estado: "Finalizada", fechaFinalizada: formattedDateString })
                    .then(res => {
                        console.log(res);
                        router.reload();
                    })
                    .catch(error => {
                        console.error("Error al finalizar la tutoría:", error);
                    });
                console.log("ok finalizar" + observacion);
            },
        });
    };

    useEffect(() => {
        const targetTimeZone = 'America/Guayaquil';
        const originalDate = new Date();
        const zonedDate = utcToZonedTime(originalDate, targetTimeZone);
        const formattedDateString = format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        setCurrentDate(formattedDateString);
        obtenerRol().then(rol => {
            const userRole = rol;
            setRole(userRole);
            console.log(rol);
        });

        // Lógica para obtener tutorías según el rol
        const
            fetchTutorias = async () => {
                let tutorias = [];
                if (role === 'docente') {
                    console.log("Cargando tutorias docente");
                    console.log(currentDate);
                    tutorias = await tutoriasDoc();
                } else if (role === 'estudiante') {
                    tutorias = await asignaturasEst();
                }
                setData(tutorias);
            };

        fetchTutorias();
    }, [role]);


    return (
        <AuthRoute>
            <div className={styles.general}>
                <Head>
                    <title>Tutorías</title>
                </Head>
                <SideNavBar />
                <div className={styles.container}>
                    <h1 className={styles.tittle}>Tutorías</h1>
                    <table className="h-full w-full whitespace-no-wrap">
                        <thead>
                            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                <th class="px-4 py-3">Materia</th>
                                <th class="px-4 py-3 text-center">Tema</th>
                                <th class="px-4 py-3 text-center">Estado</th>
                                <th class="px-4 py-3 text-center">Fecha</th>
                                {role === 'docente' && (
                                    <th class="px-4 py-3 text-center">Detalles</th>
                                )}
                                <th class="px-4 py-3 text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                            {data.map((tutoria, index) => (
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
                                            </div>
                                            <div>
                                                <p className="font-semibold">{tutoria.materia}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">{tutoria.docente}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm">{tutoria.tema}</td>
                                    <td className="px-4 py-3 text-xs text-center">
                                        <span className={`px-2 py-1 font-semibold leading-tight ${tutoria.estado === 'Aprobada' ? 'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100 rounded-full' : tutoria.estado === 'Rechazada' ? 'rounded-full text-red-700 bg-red-100 dark:bg-red-700 dark:text-red-100' : tutoria.estado === 'Solicitada' ? 'rounded-full text-orange-700 bg-orange-100 dark:text-white dark:bg-orange-600' : ' rounded-full text-gray-700 bg-gray-100 dark:text-gray-100 dark:bg-gray-700'}`}>
                                            {tutoria.estado}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-center">
                                        {moment(tutoria.fecha_solicitada).format('YYYY-MM-DD')}
                                        <p className="text-xs text-gray-600 dark:text-gray-400">{moment(tutoria.fecha_solicitada).format('HH:mm')} - {tutoria.horas} hora(s)</p>
                                    </td>

                                    {role === 'docente' && (
                                        <td className="px-4 py-3 text-sm text-center">
                                            <svg
                                                className="mx-auto block w-5 h-5"
                                                aria-hidden="true"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                cursor="pointer"
                                                onClick={() => detalles(index)}
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 0a10 10 0 100 20 10 10 0 000-20zm0 1.67a8.33 8.33 0 110 16.66 8.33 8.33 0 010-16.66zm.83 12.75a.83.83 0 01-.83.84H9.17a.83.83 0 01-.83-.84v-4.8a.83.83 0 01.83-.84h.83a.83.83 0 01.83.84V14.42zm-.83-5.51a.59.59 0 01-.59-.59V5.75a.59.59 0 111.18 0v2.23a.59.59 0 01-.59.59z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </td>
                                    )}
                                    {role === 'docente' ? (

                                        moment(currentDate).isAfter(tutoria.fecha_solicitada) && tutoria.estado !== "Finalizada" ? (
                                            <td className="px-4 py-3 text-center">
                                                <div>
                                                    <button onClick={() => handleFinalizar(index)} className="items-center justify-between px-4 py-2 text-sm text-white transition-colors duration-1000 bg-red-600 border border-transparent rounded-lg hover:bg-red-700 w-fit">
                                                        Finalizar
                                                    </button>
                                                </div>
                                            </td>
                                        ) : (
                                            tutoria.estado !== 'Rechazada' && tutoria.estado !== 'Finalizada' ? (
                                                <td className="px-4 py-3 text-center">
                                                    <div>
                                                        <button onClick={() => handleOpenModal(index)} className="mt-1 items-center justify-between px-4 py-2 text-sm text-white transition-colors duration-1000 bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 w-fit">
                                                            Re-Programar
                                                        </button>
                                                    </div>
                                                </td>
                                            ) : (
                                                <td className="px-4 py-3 text-center">
                                                    <div>
                                                        <button onClick={() => verInformacion(index)} className="mt-1 items-center justify-between px-4 py-2 text-sm text-white transition-colors duration-1000 bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 w-fit">
                                                            Información
                                                        </button>
                                                    </div>
                                                </td>
                                            )
                                        )
                                    ) : (
                                        tutoria.estado === 'Re-Asignada' && role === 'estudiante' ? (
                                            <td className="px-4 py-3 text-center">
                                                <div>
                                                    <Link href={`/tutorias/gestionar/${tutoria.external_id_tutoria}`}>
                                                        <button className="items-center justify-between px-4 py-2 text-sm text-white transition-colors duration-1000 bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 w-fit">
                                                            Gestionar
                                                        </button>
                                                    </Link>
                                                </div>
                                            </td>
                                        ) : (
                                            tutoria.estado === 'Rechazada' || tutoria.estado === 'Finalizada' ? (
                                                <td className="px-4 py-3 text-center">
                                                    <div>
                                                        <button onClick={() => verInformacion(index)} className="mt-1 items-center justify-between px-4 py-2 text-sm text-white transition-colors duration-1000 bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 w-fit">
                                                            Información
                                                        </button>
                                                    </div>
                                                </td>
                                            ) : (
                                                <td className="px-4 py-3 text-center">
                                                    <div>
                                                        <button onClick={() => detalles(index)} className="items-center justify-between px-4 py-2 text-sm text-white transition-colors duration-1000 bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 w-fit">
                                                            Detalles
                                                        </button>
                                                    </div>
                                                </td>
                                            )

                                        )
                                    )}

                                </tr>

                            ))}

                        </tbody>
                    </table>
                    {role === 'docente' ? (
                        <div className="mt-5">
                            <Link href="/tutorias/pendientes" passHref>
                                <button className="mt-4 items-center justify-between px-4 py-2 text-sm text-white transition-colors duration-1000 bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 w-fit">
                                    Ver Tutorías Solicitadas
                                </button>
                            </Link>
                            <Link href="/tutorias/registro" passHref>
                                <button className="ml-3 mt-4 items-center justify-between px-4 py-2 text-sm text-white transition-colors duration-1000 bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 w-fit">
                                    Crear una registro de tutorías
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
        </AuthRoute>
    )
}