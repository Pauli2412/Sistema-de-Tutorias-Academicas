import axios from 'axios';
import { PersonaExternal, Session, Rol, ObtenerExternal, CerrarSession, ObtenerRol, EstaSession } from './useSession';
const BASE_URL = 'http://localhost:8095/api/v1'; // Reemplaza esta URL con la URL base de tu API

export const loginUser = async (correo, clave) => {
  try {
    const response = await axios.post(`${BASE_URL}/inicio_sesion`, { correo, clave });
    console.log(response);
    PersonaExternal(response.data.data.external);
    Session(response.data.data.token);
    Rol(response.data.data.rol);
    return response;

  } catch (error) {
    console.log("ERROR EN API INICIO DE SESION " + error);
    throw new Error('Error al iniciar sesión');
  }
};

// Metodo para registrar una persona
export const registro = async (data) => {
  const response = await fetch(`${BASE_URL}/personas/guardar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
};


// Metodo para obtener el objeto persona de la sesion actual
export const obtenerPersonaActual = async () => {
  const external_id = ObtenerExternal();
  const response = await fetch(`${BASE_URL}/personas/obtener/${external_id}`);
  const result = await response.json();
  return result;
}

export const obtenerExternal = async () => {
  console.log("EXTERNAL ID ", ObtenerExternal());
  return ObtenerExternal();
}



// Metodo para obtener el objeto persona de la sesion actual
export const obtenerPersonaExternal = async (data) => {
  const external_id = data.external_id;
  const response = await fetch(`${BASE_URL}/personas/obtener/${external_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  return result;
}

// Metodo para editar el objeto persona de la sesion actual
export const editarPersonaActual = async (data) => {
  const external_id = ObtenerExternal();
  const response = await fetch(`${BASE_URL}/personas/editar/${external_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  console.log("EDITADO ACTUAL Nuevo EXTERNAL ", result);
  if (result.data.persona_external != null) {
    PersonaExternal(result.data.persona_external);
  }
  return result;
};

// Metodo de ADMIN para editar una persona con el external ID
export const editarPersona = async (external_id, data) => {
  const response = await fetch(`${BASE_URL}/personas/editar/${external_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
};


export const listarPersonas = async () => {
  const response = await fetch(`${BASE_URL}/personas`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  return result;
};

// Metodo para cerrar sesión
export const logout = async () => {

  CerrarSession();
}

// Metodo para cerrar sesión
export const obtenerRol = async () => {
  console.log("ROL ", ObtenerRol());
  return ObtenerRol();
}

export const cargarAsignaturas = async () => {
  const response = await fetch(`${BASE_URL}/asignaturas`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  return result;
}

export const crearRegistroTutoria = async (data) => {
  const response = await fetch(`${BASE_URL}/registro/tutorias/guardar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}

export const listarTutorias = async () => {
  const response = await fetch(`${BASE_URL}/registro/tutorias`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  return result;
}

export const obtenerRegistroTutoria = async (external_id) => {
  console.log("EXTERNAL ID ", external_id);
  const response = await fetch(`${BASE_URL}/registro/tutorias/${external_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  return result;
}

export const guardarTutoria = async (data) => {
  const external_id = ObtenerExternal();
  data.external_estudiante = external_id;
  console.log("DATA ", data);
  const response = await fetch(`${BASE_URL}/tutorias/guardar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}

export const listarTutoriasIndividuales = async () => {
  const response = await fetch(`${BASE_URL}/tutorias`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  return result;
}

// Antes tutoriasDoc
export const reg_tutoriasDoc = async () => {
  const external_id = ObtenerExternal();
  const response = await fetch(`${BASE_URL}/registro/tutorias`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  const tutoriasFiltradas = result.data.filter(tutoria => tutoria.external_docente === external_id);
  console.log("TUTORIAS FILTRADAS ", tutoriasFiltradas);
  return tutoriasFiltradas;
}

export const tutoriasEst = async () => {
  const external_id = ObtenerExternal();
  const response = await fetch(`${BASE_URL}/tutorias`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  const tutoriasFiltradas = result.data.filter(tutoria => tutoria.estudiante_external_id === external_id);
  console.log("TUTORIAS FILTRADAS ", tutoriasFiltradas);
  return tutoriasFiltradas;
}

// Metodo de Docente para editar tutoria con el external ID
export const editarTutoria = async (external_id, data) => {
  console.log("Editar", external_id, "con la data", data);
  const response = await fetch(`${BASE_URL}/tutorias/editar/${external_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
};

// Metodo para obtener el objeto tutoria 
export const obtenerTutoria = async (external_id) => {
  console.log("EXTERNAL ID ", external_id);
  const response = await fetch(`${BASE_URL}/tutorias/obtener/${external_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  return result;
}

export const listarTodasTutorias = async () => {
  const response = await fetch(`${BASE_URL}/tutorias`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  return result;
}

export const listarTutoriasUser = async () => {
  const external_id = ObtenerExternal();
  const response = await fetch(`${BASE_URL}/tutorias`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();

  const tutoriasFiltradas = result.data.filter(tutoria => tutoria.external_docente === external_id);
  console.log("TUTORIAS FILTRADAS ", tutoriasFiltradas);
  return tutoriasFiltradas;
}

// Antes asignaturasDoc
export const tutoriasDoc = async () => {
  const external_id = ObtenerExternal();
  const response = await fetch(`${BASE_URL}/tutorias`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  const tutoriasFiltradas = result.data.filter(tutoria => tutoria.external_docente === external_id && tutoria.estado !== "Solicitada");
  console.log("TUTORIAS FILTRADAS ", tutoriasFiltradas);
  return tutoriasFiltradas;
}

export const asignaturasEst = async () => {
  const external_id = ObtenerExternal();
  const response = await fetch(`${BASE_URL}/tutorias`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();
  const tutoriasFiltradas = result.data.filter(tutoria => tutoria.estudiante_external_id === external_id);
  console.log("TUTORIAS FILTRADAS ", tutoriasFiltradas);
  return tutoriasFiltradas;
}

export const finalizarTutoria = async (external_id, data) => {
  console.log("Editar", external_id, "con la data", data);
  const response = await fetch(`${BASE_URL}/tutorias/editar/${external_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}