import styles from '../styles/Usuals.module.css'
import bg from '../public/images/unl_background.jpg';
import logo from '../public/images/logo_unl_home.png';
import React, { Component } from 'react'
import Head from 'next/head';
import Link from 'next/link';

export default function Index() {

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${bg.src})`, height: '100vh', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
      <Head>
        <title>Gestión de Tutorías</title>
      </Head>

      <div>
      </div>

      <div style={{ position: 'absolute', top: '30px', left: '10px', height: '59px', width: '200px', backgroundImage: `url(${logo.src})`, backgroundSize: 'cover' }} />

      <div className={styles.container}>

        <div className={styles.containerTarget}>
          <h1 className={styles.tittle}>Sistema de gestión de tutorías</h1>
          <h1 className={styles.minimalist}>
            Nuestro enfoque en la excelencia educativa nos ha impulsado a desarrollar un nuevo sistema de tutorías para docentes y estudiantes. Buscamos simplificar el acceso y seguimiento de las tutorías, fomentando la comunicación eficaz entre docentes y alumnos. A través de esta plataforma, brindamos una experiencia fluida y enriquecedora, centrada en el crecimiento personal y académico de cada estudiante.
          </h1>
          <Link href="/login2" passHref>
            <button className={styles.button} style={{ width: '150px' }}>Iniciar sesión</button>
          </Link>
        </div>
      </div>
    </div>
  )

}
