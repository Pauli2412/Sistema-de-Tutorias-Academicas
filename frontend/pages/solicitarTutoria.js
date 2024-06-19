import SideNavBar from '@/components/SideNavBar';
import React from 'react';
import AuthRoute from './authRoute';
import styles from '../styles/Home.module.css';
import Head from 'next/head';

export default function solicitarTutoria() {
    return (
        <AuthRoute>
            <Head>
                <title>Solicitar Tutoria</title>
            </Head>
            <div className={styles.general}>
                <SideNavBar />
                <div className={styles.container}>
                    <div className="grid grid-cols-3 gap-4 items-center">
                        <div class="text-left">
                            <img src="/images/logo_unl.png" alt="Logo" class="w-20 h-20" />
                        </div>
                        <div class="text-center">
                            <h1 class="text-xs font-bold text-white">Facultad de la Industria y los Recursos Naturales No Renovables</h1>
                        </div>
                        <div class="text-right ">
                            <p class="text-xs text-white">Periodo Academico: Febrero 2023- Agosto 2023</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">

                        <div class="">
                            <p class="text-xs text-white">Programacion I</p>
                        </div>

                        <div class="">
                            <p class="text-xs text-white">Ciclo: 6</p>
                        </div>


                    </div>

                </div>
            </div>
        </AuthRoute >
    )
}
