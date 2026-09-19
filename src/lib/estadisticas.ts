import { obtenerEquipo } from "./equipos";

interface Equipo {
  equipoId: number;
  equipo: string;
  jugadores: number[];
}

interface Jugador {
  nombre: string;
  id: number;
  posicion: string;
  foto: string;
}

interface Punto {
  jugadorId: number;
  jornada: number;
  puntos: number;
}

export interface EstadisticasJornada {
    media: number;

    maxima: {
        equipoId: number;
        nombre: string;
        puntos: number;
    } | null;

    minima: {
        equipoId: number;
        nombre: string;
        puntos: number;
    } | null;

    mayorDiferencia: {
        equipo1Id: number;
        equipo2Id: number;
        equipo1: string;
        equipo2: string;
        puntos1: number;
        puntos2: number;
        diferencia: number;
    } | null;

    jugadorJornada: {
        jugadorId: number;
        nombre: string;
        puntos: number;
    } | null;
}


export function calcularEstadisticasJornada(
    enfrentamientos: any[]
): EstadisticasJornada {

    const equipos: {
        equipoId: number;
        nombre: string;
        puntos: number;
    }[] = [];

    const partidos: {
        equipo1Id: number;
        equipo2Id: number;
        equipo1: string;
        equipo2: string;
        puntos1: number;
        puntos2: number;
    }[] = [];

    const jugadores: {
        jugadorId: number;
        nombre: string;
        puntos: number;
        posicion: string;
        foto: string;
    }[] = [];


    // --------------------------------------------------
    // Recopilar datos
    // --------------------------------------------------

    for (const enfrentamiento of enfrentamientos) {

        const equipo1 = enfrentamiento.equipo1;
        const equipo2 = enfrentamiento.equipo2;

        const bestball1 = enfrentamiento.bestball1;
        const bestball2 = enfrentamiento.bestball2;

        const puntos1 = bestball1.puntosTotales;
        const puntos2 = bestball2.puntosTotales;


        // Equipos

        equipos.push({
            equipoId: equipo1.id,
            nombre: equipo1.nombre,
            puntos: puntos1
        });

        equipos.push({
            equipoId: equipo2.id,
            nombre: equipo2.nombre,
            puntos: puntos2
        });


        // Enfrentamiento

        partidos.push({
            equipo1Id: equipo1.id,
            equipo2Id: equipo2.id,
            equipo1: equipo1.nombre,
            equipo2: equipo2.nombre,
            puntos1,
            puntos2
        });


        // Jugadores del Best Ball

        for (const jugador of [
            ...bestball1.jugadores,
            ...bestball2.jugadores
        ]) {

            jugadores.push({
                jugadorId: jugador.id,
                nombre: jugador.nombre,
                puntos: jugador.puntos,
                posicion: jugador.posicion,
                foto: jugador.foto
            });

        }
    }


    // --------------------------------------------------
    // Sin datos
    // --------------------------------------------------

    if (equipos.length === 0) {

        return {
            media: 0,
            maxima: null,
            minima: null,
            mayorDiferencia: null,
            jugadorJornada: null
        };
    }


    // --------------------------------------------------
    // Media
    // --------------------------------------------------

    const totalPuntos = equipos.reduce(
        (sum, equipo) => sum + equipo.puntos,
        0
    );

    const media = totalPuntos / equipos.length;


    // --------------------------------------------------
    // Máxima
    // --------------------------------------------------

    const maxima = equipos.reduce((max, equipo) =>
        equipo.puntos > max.puntos
            ? equipo
            : max
    );


    // --------------------------------------------------
    // Mínima
    // --------------------------------------------------

    const minima = equipos.reduce((min, equipo) =>
        equipo.puntos < min.puntos
            ? equipo
            : min
    );


    // --------------------------------------------------
    // Mayor diferencia
    // --------------------------------------------------

    const mayorDiferencia = partidos.reduce(
        (max, partido) => {

            const diferencia = Math.abs(
                partido.puntos1 - partido.puntos2
            );

            if (!max || diferencia > max.diferencia) {

                return {
                    ...partido,
                    diferencia
                };
            }

            return max;
        },
        null as EstadisticasJornada["mayorDiferencia"]
    );


    // --------------------------------------------------
    // Jugador de la jornada
    // --------------------------------------------------

    const jugadorJornada = jugadores.length > 0
        ? jugadores.reduce((max, jugador) =>
            jugador.puntos > max.puntos
                ? jugador
                : max
        )
        : null;


    return {
        media: Number(media.toFixed(2)),

        maxima: {
            ...maxima,
            puntos: Number(maxima.puntos.toFixed(2))
        },

        minima: {
            ...minima,
            puntos: Number(minima.puntos.toFixed(2))
        },

        mayorDiferencia: mayorDiferencia
            ? {
                ...mayorDiferencia,
                diferencia: Number(
                    mayorDiferencia.diferencia.toFixed(2)
                )
            }
            : null,

        jugadorJornada
    };
}
export function obtenerJugadoresRecord(
  jugadores: Jugador[],
  puntos: Punto[]
) {
    let puntosMax = puntos.sort((a, b) => b.puntos - a.puntos)
    const max = Math.max(
      ...puntosMax.map((punto) => punto.puntos)
    );
    const jugadoresMax = puntosMax.filter((punto) => {return punto.puntos === max})
}

export function obtenerJugadoresMasPresentes(
  equipos: Equipo[],
  jugadores: Jugador[]
) {
const apariciones = new Map<number, number>();

  for (const equipo of equipos) {
    for (const jugadorId of equipo.jugadores) {
      apariciones.set(
        jugadorId,
        (apariciones.get(jugadorId) ?? 0) + 1
      );
    }
  }

  const porPosicion: Record<
    string,
    (Jugador & { equipos: number })[]
  > = {};

  for (const jugador of jugadores) {
    const cantidad = apariciones.get(jugador.id) ?? 0;

    if (!porPosicion[jugador.posicion]) {
      porPosicion[jugador.posicion] = [];
    }

    porPosicion[jugador.posicion].push({
      ...jugador,
      equipos: cantidad
    });
  }

  const resultado: Record<
    string,
    (Jugador & { equipos: number })[]
  > = {};

  for (const [posicion, jugadoresPosicion] of Object.entries(porPosicion)) {
    const max = Math.max(
      ...jugadoresPosicion.map((jugador) => jugador.equipos)
    );

    resultado[posicion] = jugadoresPosicion.filter(
      (jugador) => jugador.equipos === max
    );
  }

  return resultado;
}