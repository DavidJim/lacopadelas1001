import jornadas from '../../data/fechasJornadas.json';
type EstadoJornada = "pasada" | "enJuego" | "futura";

export function obtenerRonda(ronda: number) {
  return jornadas.filter((j) => j.ronda === ronda);
}

function parsearFechaNFL(fechaStr: string): Date {
  const [dia, mes, ano] = fechaStr.split('-');
  return new Date(`${ano}-${mes}-${dia}`);
}

function obtenerEstadoJornada(
    fechaInicio: Date,
    fechaFin: Date,
    now: Date
): EstadoJornada {
    if (now < fechaInicio) {
        return "futura";
    }

    if (now > fechaFin) {
        return "pasada";
    }

    return "enJuego";
}

export function getJornadaPorNumero(jornada: number) {
    const jornadaEncontrada = jornadas.find((j) => j.jornada === jornada);
    const now = new Date();
    if (!jornadaEncontrada) {
        throw new Error(`Jornada no encontrada: ${jornada}`);
    }
    const fechaInicio = parsearFechaNFL(jornadaEncontrada.fechaInicio);
    const fechaFin = parsearFechaNFL(jornadaEncontrada.fechaFin);

    const estado = obtenerEstadoJornada(fechaInicio, fechaFin, now);
    
    return { jornada: jornadaEncontrada, estado };
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
        return { jornada:jornadaActual, estado: "enJuego" as const };
    }

    const siguienteJornada = jornadas.find((j) => {
        const fechaInicio = parsearFechaNFL(j.fechaInicio);

        return fechaInicio > now;
    });

    if (siguienteJornada) {
        return { jornada: siguienteJornada,  estado: "futura" as const };
    }

    const ultimaJornada = jornadas.at(-1);

    if (!ultimaJornada) {
        throw new Error('No hay jornadas disponibles');
    }

    return { jornada: ultimaJornada, estado: "pasada" as const };
}

export function obtenerRondas() {
    const rondas = new Map();

    for (const jornada of jornadas) {
        if (!rondas.has(jornada.ronda)) {
            rondas.set(jornada.ronda, {
                ronda: jornada.ronda,
                nombre: jornada.rondaNombre,
                primeraJornada: jornada.jornada
            });
        }
    }

    return [...rondas.values()];
}