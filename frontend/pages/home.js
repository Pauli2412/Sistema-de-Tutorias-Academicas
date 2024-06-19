import SideNavBar from '@/components/SideNavBar';
import React from 'react';
import AuthRoute from './authRoute';
import styles from '../styles/Home.module.css';
import Head from 'next/head';
export default function Home() {

    return (
        <AuthRoute>
            <div className={styles.general}>
                <Head>
                    <title>Home</title>
                </Head>
                <SideNavBar/>
                <div className={styles.container}>
                    
                </div>
            </div>
        </AuthRoute>

    )
}