'use client'

export const Session = (token) => {
    localStorage.setItem('token', token);    
};

export const ObtenerSession = (token) => {
    return localStorage.getItem('token');    
};
export const PersonaExternal = (external) => {
    localStorage.setItem('external', external);    
};
export const ObtenerExternal = () => {
    return localStorage.getItem('external');    
};

export const Rol = (rol) =>{
    localStorage.setItem('rol', rol);
};

export const ObtenerRol = () =>{
    return localStorage.getItem('rol');
}

export const EstaSession = () =>{
    const token = localStorage.getItem('token');
    if(token) return true;
    else return false;
};

export const CerrarSession = () =>{
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('external');
}
