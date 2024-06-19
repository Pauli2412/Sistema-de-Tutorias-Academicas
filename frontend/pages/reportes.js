import React, { useState, useEffect } from "react";
import Head from "next/head";
import AuthRoute from "./authRoute";
import SideNavBar from "@/components/SideNavBar";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { listarTutorias, obtenerExternal, listarTodasTutorias } from "./api/api";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function asignaturas() {
    const [external_id, setExternal_id] = useState("");
    const [data, setData] = useState([
        {
            asignatura: "",
            periodo: "",
            paralelo: "",
            carrera: "",
            facultad: "",
            ciclo: "",
            fechaEmision: "",
            nombre_docente: "",
            external_persona: "",
            external_registro: "",
        },
    ]);

    const [tutorias, setTutorias] = useState([
        {
            fechaTutoria: "",
            fecha_aceptada: "",
            estado: "",
            docente: "",
            fecha_solicitada: "",
            horaInicio: "",
            horas: "",
            tema: "",
            modalidad: "",
            estudiante_nombre: "",
            materia: "",
            estudiante_apellido: "",
            external_registroTutoria: "",
            external_docente: "",
        },
    ]);

    useEffect(() => {
        obtenerExternal().then((data) => {
            console.log("---", data);
            setExternal_id(data);
            console.log("** External Id ", external_id);// Establecer el valor de external_id
        });

        listarTutorias().then((data) => {
            console.log("ppp", data);
            setData(data.data);
            //console.log("EXternal del registro", data.external_registro);
        });
        listarTodasTutorias().then((data) => {
            console.log("***", data);
            setTutorias(data.data);
            //console.log("DATA TUTORIAS", tutorias.data.docente);
        });
    }, [external_id]);

    const generatePDF = (item) => {
        const pdf = new jsPDF();
        const logo = "/images/logo_unl.png";
        pdf.addImage(logo, "PNG", 10, 10, 30, 30);

        pdf.setFont("Helvetica", "bold");
        pdf.setFontSize(22);
        pdf.setTextColor(33, 89, 103);
        pdf.text("UNIVERSIDAD NACIONAL DE LOJA", 55, 30);

        pdf.setFont("Helvetica", "normal");
        pdf.setFontSize(14);
        pdf.setTextColor(91, 129, 141);
        pdf.text("COMISIÓN DE ARTICULACIÓN DE LAS FUNCIONES SUSTANTIVAS", 50, 40);

        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text("REPORTE DEL REGISTRO DE LAS ACTIVIDADES DE TUTORÍA ACADÉMICA", 50, 50);


        pdf.setFont("Helvetica", "normal");
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);

        pdf.text(`Facultad: ${item.asignatura}`, 10, 60);
        pdf.text(`Carrera: ${item.carrera}`, 10, 70);
        pdf.text(`Asignatura: ${item.asignatura}`, 10, 80);
        pdf.text(`Docente: ${item.tutor_nombre} ${item.tutor_apellido}`, 10, 90);
        pdf.text(`Ciclo: ${item.ciclo}`, 10, 100);
        pdf.text(`Periodo: ${item.periodo}`, 10, 110);
        pdf.text(`Paralelo: ${item.paralelo}`, 10, 120);


        // Agregar tabla
        const headers = [[" Fecha   ", " Tiempo Tutoría     ", " Datos del Estudiante    ", " Tema Tratado  ", " Modalidad  ", " Observación  ", " Estado  "]];

        const tableData = [];
        tutorias.forEach((rowData) => {
            if (rowData.external_registroTutoria !== item.external_registro) {
                return;
            }
            console.log("EXTERNAL REGISTRO TUTORIAS", rowData.external_registroTutoria);
            console.log("EXTERNAL REGISTRO ", item.external_registro);
            const fechaFormateada = new Date(rowData.fecha_solicitada).toISOString().split('T')[0];

            const row = [
                fechaFormateada,
                rowData.horas,
                `${rowData.estudiante_nombre} ${rowData.estudiante_apellido}`,
                rowData.tema,
                rowData.modalidad,
                rowData.observacion,
                rowData.estado,
            ];
            tableData.push(row);
        });

        pdf.autoTable({
            startY: 130,
            head: headers,
            body: tableData,
            styles: {
                fontSize: 10,
                cellPadding: 4,
            },
            headStyles: {
                fillColor: '#f2f2f2',
                textColor: '#000',
                fontSize: 9, // 
                fontStyle: 'bold',
            },
            bodyStyles: {
                textColor: '#000',
            },
        });

        return pdf;
    };

    const openPDFInNewTab = (item) => {
        const pdf = generatePDF(item);
        const pdfUrl = pdf.output('bloburl'); // Crea una URL para el Blob del PDF
        window.open(pdfUrl, '_blank');
    };

    return (
        <AuthRoute>
            <div className={styles.general}>
                <Head>
                    <title>Reportes</title>
                </Head>
                <SideNavBar />
                <div className={styles.container}>
                    <h1 className={styles.tittle}>Reportes de Tutorías</h1>
                    <table className="h-full w-full whitespace-no-wrap">
                        <thead>
                            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                <th className="px-4 py-3">Asignatura</th>
                                <th className="text-center px-4 py-3">Carrera</th>
                                <th className="text-center px-4 py-3">Periodo</th>
                                <th className="text-center px-4 py-3">Docente</th>
                                <th className="text-center px-4 py-3">Ciclo</th>
                                <th className="text-center px-4 py-3">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                            {data.map((item, index) => (
                                (item.external_docente === external_id) ? (
                                    <tr key={index} className="text-gray-700 dark:text-gray-400">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center text-sm">
                                                <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                                                    <Image
                                                        className="object-cover w-full h-full rounded-full"
                                                        src="/images/logo_unl.png"
                                                        alt=""
                                                        width={32}
                                                        height={32}
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
                                        <td className="px-4 py-3 text-sm text-center">{item.carrera}</td>
                                        <td className="px-4 py-3 text-sm text-center">{item.periodo}</td>
                                        <td className="px-4 py-3 text-sm text-center">{item.tutor_nombre} {item.tutor_apellido}</td>
                                        <td className="px-4 py-3 text-sm text-center">{item.ciclo}</td>
                                        <td className="px-4 py-3 text-sm text-center">
                                            <button
                                                className="items-center justify-between px-4 py-2 text-sm text-white transition-colors duration-1000 bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700"
                                                onClick={() => openPDFInNewTab(item)}
                                            >
                                                Generar PDF
                                            </button>
                                        </td>
                                    </tr>
                                ) : null
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthRoute>
    );
}
