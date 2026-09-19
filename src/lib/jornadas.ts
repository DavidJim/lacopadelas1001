import jornadas from '../../data/fechasJornadas.json';

export function obtenerRonda(ronda: number) {
  return jornadas.filter((j) => j.ronda === ronda);
}

function parsearFechaNFL(fechaStr: string): Date {
  const [dia, mes, ano] = fechaStr.split('-');
  return new Date(`${ano}-${mes}-${dia}`);
}

export function getJornadaPorNumero(jornada: number) {
    const jornadaEncontrada = jornadas.find((j) => j.jornada === jornada);
    const now = new Date();
    if (!jornadaEncontrada) {
        throw new Error(`Jornada no encontrada: ${jornada}`);
    }
    const fechaInicio = parsearFechaNFL(jornadaEncontrada.fechaInicio);
    const fechaFin = parsearFechaNFL(jornadaEncontrada.fechaFin);
    
    return { jornada: jornadaEncontrada, enJuego: now >= fechaInicio && now <= fechaFin };
}

export function getJornadaActual() {
    const now = new Date();
    let enJuego = false;
    const jornadaActual = jornadas.find((j) => {
        const fechaInicio = parsearFechaNFL(j.fechaInicio);
        const fechaFin = parsearFechaNFL(j.fechaFin);

        return now >= fechaInicio && now <= fechaFin;
    });

    if (jornadaActual) {
        enJuego = true;
        return { jornada:jornadaActual, enJuego };
    }

    const siguienteJornada = jornadas.find((j) => {
        const fechaInicio = parsearFechaNFL(j.fechaInicio);

        return fechaInicio > now;
    });

    if (siguienteJornada) {
        return { jornada: siguienteJornada, enJuego: false };
    }

    const ultimaJornada = jornadas.at(-1);

    if (!ultimaJornada) {
        throw new Error('No hay jornadas disponibles');
    }

    return { jornada: ultimaJornada, enJuego: false };
}