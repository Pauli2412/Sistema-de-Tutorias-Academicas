import Head from 'next/head';
import bg from '../public/images/login_background.jpg';
import styles from '../styles/Login.module.css'
import { useState } from 'react';
import Link from 'next/link';
import { loginUser, obtener } from './api/api';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const handleLogin = async () => {
        try {
            loginUser(email, password)
                .then((response) => {
                    console.log(response.data.data.external); // Aquí puedes acceder a los datos de la respuesta
                    if (response.data.code == "200 OK") {
                        router.push('/home');
                    } else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Ocurrió un error...',
                            text: 'Revisa tus credenciales!',
                        })
                    }
                })
                .catch((error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Tenemos un error de servidor...',
                        text: 'Intentalo más tarde!',
                    })
                    console.error('Error al iniciar sesión:', error);
                });
        } catch (error) {
            console.log("error: " + error);
        }
    };
    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePassword = () => {
        var tipo = document.getElementById("password");
        if (tipo.type == "password") {
            tipo.type = "text";
        } else {
            tipo.type = "password";
        }
        setShowPassword(!showPassword);
    };
    // Evalua showIcon, si es verdadero cambia la fuente de imagen de una hacia otra
    const showIcon = showPassword ? "/images/icon_hide_glow.png" : "/images/icon_show_password.png";

    return (
        <div className={styles.container} style={{ backgroundImage: `url(${bg.src})`, height: '100vh', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
            <Head>
                <title>Log-in</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.form}>
                <h1 className={styles.minimalist}>SISTEMA DE GESTION DE TUTORIAS</h1>
                <h1 className={styles.tittle}>
                    <span>Log In</span>
                    <span style={{ color: '#1c90f5' }}>.</span>
                </h1>
                <h1 style={{ paddingTop: '13px', paddingBottom: '13px' }} className={styles.minimalistsubtitle}>Aun no tienes cuenta?
                    <Link style={{ color: '#1e7fd6' }} href="/register" passHref>
                        Registrate
                    </Link>
                </h1>
                <div className={styles.inputContainer}>
                    <input className={styles.input} style={{ width: '330px' }} type="text" id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <span className={styles.span}>Email</span>
                    <div className={styles.icon} style={{ backgroundImage: `url("/images/icon_email.png")` }} />
                </div>
                <div className={styles.inputContainer} >
                    <input className={styles.input} style={{ width: '330px' }} type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <span className={styles.span}>Password</span>
                    <div className={styles.iconToggle} style={{ backgroundImage: `url(${showIcon})` }} onClick={handleTogglePassword} />
                </div>
                <button onClick={handleLogin} className={styles.button} style={{ width: '330px' }}>Log In</button>
            </div>
        </div>

    )
}