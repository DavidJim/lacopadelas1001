import jugadores from "../../data/jugadores.json";
import rosters from "../../data/rosters.json";
import puntos from "../../data/puntos.json";

import { calcularBestball, type JugadorBestball } from "./bestball";

export function calcularBestballEquipo(
  equipoId: number,
  jornada: number
) {
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