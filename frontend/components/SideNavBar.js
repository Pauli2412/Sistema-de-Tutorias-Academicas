import styles from '../styles/NavBar.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles2 from '../styles/Login.module.css';
import { logout, obtenerRol } from '@/pages/api/api';
function SideNavBar() {
    const [open, setOpen] = useState(true);
    const [role, setRole] = useState('');
    useEffect(() => {
        obtenerRol().then(rol => {
            const userRole = rol;
            setRole(userRole);
            console.log(rol);
        });
        // Cambia esto por tu lógica real

        // Lógica para obtener tutorías pendientes aquí
        // Actualiza el estado de tutoriasPendientes con los datos obtenidos
    }, []);


    //4.6rem
    const width = open ? '14rem' : '4.4rem';
    const logow = open ? '70px' : '35px';
    const handleLogout = async () => {
        try {
            logout();
        } catch (error) {
            console.log("error: " + error);
        }
    }
    return (
        <section className='flex bg-white-mode-navbar text-black dark:bg-black dark:text-white'>
            <div className={styles.navbar} style={{ width: `${width}` }}>
                <div className='py-3 flex justify-center'>
                    <div className={styles.icon} style={{ cursor: 'pointer', backgroundImage: `url("/images/icon_menu.png")` }} onClick={() => setOpen(!open)} />
                </div>
                <div className='mt-4 flex flex-col gap-4'>
                    <div className='items-center mt-4 flex flex-col gap-4'>
                        <div className={styles.icon} style={{ width: `${logow}`, height: `${logow}`, backgroundImage: `url("/images/logo_unl.png")` }} />
                        <span className={`whitespace-pre duration-500 ${!open && 'opacity-0 overflow-hidden'}`} >Gestión de Tutorías</span>
                    </div>
                    <h1 className={styles2.minimalistsubtitle}>Menú</h1>

                    <Link href="/tutorias" passHref className='group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-slate-300 dark:hover:bg-zinc-900 rounded-md'>
                        <div className={styles.icon} style={{ backgroundImage: `url("/images/icon_tutorias.png")` }} />
                        <span className={` whitespace-pre duration-500 ${!open && 'opacity-0 overflow-hidden hidden'}`}>Tutorías</span>
                    </Link>

                    <Link href="/asignaturas" passHref className='group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-slate-300 dark:hover:bg-zinc-900 rounded-md'>
                        <div className={styles.icon} style={{ backgroundImage: `url("/images/icon_materias.png")` }} />
                        <span className={`whitespace-pre duration-500 ${!open && 'opacity-0 overflow-hidden hidden'}`}>Asignaturas</span>
                    </Link>

                    <Link href="/configuracion" passHref className='group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-slate-300 dark:hover:bg-zinc-900 rounded-md'>
                        <div className={styles.icon} style={{ backgroundImage: `url("/images/icons_edit_profile.png")` }} />
                        <span className={`whitespace-pre duration-500 ${!open && 'opacity-0 overflow-hidden hidden'}`}>Perfil</span>
                    </Link>

                    {role === 'admin' && (
                        <Link href="/admin" passHref className='group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-slate-300 dark:hover:bg-zinc-900 rounded-md'>
                            <div className={styles.icon} style={{ backgroundImage: `url("/images/icon_admin.png")` }} />
                            <span className={`whitespace-pre duration-500 ${!open && 'opacity-0 overflow-hidden hidden'}`}>Admin</span>
                        </Link>
                    )}


                    {role === 'docente' && (
                        <Link href="/reportes" passHref className='group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-slate-300 dark:hover:bg-zinc-900 rounded-md'>
                            <div className={styles.icon} style={{ backgroundImage: `url("/images/icons_reports.png")` }} />
                            <span className={`whitespace-pre duration-500 ${!open && 'opacity-0 overflow-hidden hidden'}`}>Reportes</span>
                        </Link>
                    )}

                    <Link onClick={handleLogout} href="/" passHref className='group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-slate-300 dark:hover:bg-zinc-900 rounded-md'>
                        <div className={styles.icon} style={{ backgroundImage: `url("/images/icon_logout.png")` }} />
                        <span className={` whitespace-pre duration-500 ${!open && 'opacity-0 overflow-hidden hidden'}`}>Cerrar Sesión</span>
                    </Link>
                </div>
            </div>
        </section>
    )
}


export default SideNavBar;