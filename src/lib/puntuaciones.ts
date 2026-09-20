import jugadores from "../../data/jugadores.json";
import rosters from "../../data/rosters.json";
// import puntos from "../../data/puntos.json";
import { calcularBestball, type JugadorBestball } from "./bestball";
import { get } from "@vercel/blob";
export interface Punto {
  jugadorId: number;
  jornada: number;
  puntos: number;
}

const PUNTOS_PATH = "puntos.json";

export async function calcularBestballEquipo(
  equipoId: number,
  jornada: number
) {
  const puntos = await obtenerPuntos()
  // Buscar el roster del equipo
  const roster = rosters.find(
    (equipo) => equipo.equipoId === equipoId
  );

  if (!roster) {
    throw new Error(`No existe el equipo ${equipoId}`);
  }

  // Convertimos los jugadores del roster al formato que necesita bestball
  const jugadoresEquipo: JugadorBestball[] = roster.jugadores.map(
    (jugadorId) => {
      const jugador = jugadores.find(
        (jugador) => jugador.id === jugadorId
      );

      if (!jugador) {
        throw new Error(
          `No existe el jugador ${jugadorId} en jugadores.json`
        );
      }

      const punto = puntos.find(
        (punto) =>
          punto.jugadorId === jugadorId &&
          punto.jornada === jornada
      );

      return {
        id: jugador.id,
        nombre: jugador.nombre,
        posicion: jugador.posicion,
        puntos: punto?.puntos ?? 0,
        foto: jugador.foto,
      };
    }
  );

  return calcularBestball(jugadoresEquipo);
}

export async function calcularPuntuacionRonda(
    equipoId: number,
    enfrentamiento: any
) {
    const jornadaIda = enfrentamiento.jornadas.ida;
    const jornadaVuelta = enfrentamiento.jornadas.vuelta;

    const bestballIda = await calcularBestballEquipo(
        equipoId,
        jornadaIda
    );

    const bestballVuelta = await calcularBestballEquipo(
        equipoId,
        jornadaVuelta
    );

    const puntosIda = bestballIda.puntosTotales;
    const puntosVuelta = bestballVuelta.puntosTotales;

    const total = Number(
        (puntosIda + puntosVuelta).toFixed(2)
    );

    return {
        ronda: enfrentamiento.ronda,
        puntosIda,
        puntosVuelta,
        bestballIda,
        bestballVuelta,
        total
    };
}

export async function obtenerPuntos(): Promise<Punto[]> {
  const result = await get(PUNTOS_PATH, {
    access: "private",
    useCache: false,
    token: import.meta.env.BLOB_READ_WRITE_TOKEN,

  });

  if (!result) {
    return [];
  }

  const text = await new Response(result.stream).text();

  return JSON.parse(text) as Punto[];
}