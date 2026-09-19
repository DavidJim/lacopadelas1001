import jugadores from "../../data/jugadores.json";
import puntos from "../../data/puntos.json";
import { getJornadaActual, obtenerRonda } from "./jornadas";


export function obtenerJugador(jugadorId: number) {
  return jugadores.find((jugador) => jugador.id === jugadorId);
}
export function obtenerPuntosJugadorDetalle(jugadorId: number) {
    const jornadaActual = getJornadaActual();
    const rondaActual = obtenerRonda(jornadaActual.jornada.ronda);

    const puntosJugador = puntos.filter(
        (punto) => punto.jugadorId === jugadorId
    );

    const puntosTotales = puntosJugador.reduce(
        (total, punto) => total + punto.puntos,
        0
    );

    return {
        jugador: obtenerJugador(jugadorId),
        rondaActual,
        puntosTotales,
        puntosPorJornada: puntosJugador,
    };
}