import rosters from "../../data/rosters.json";
import jugadores from "../../data/jugadores.json"
import { obtenerPuntosJugadorDetalle } from "./jugadores";

export function obtenerRoster(equipoId: number) {
    const roster = rosters.find((roster) => roster.equipoId === equipoId);
    if (!roster) return null;

    const jugadoresDelRoster = roster.jugadores.map((jugadorId) => {
        return jugadores.find((jugador) => jugador.id === jugadorId);
    }).filter((jugador) => jugador !== undefined);

    if (jugadoresDelRoster.length === 0) {
        throw new Error('No hay jugadores disponibles para el roster');
    };

    const detalleJugadores = jugadoresDelRoster.map((jugador) => {
        return obtenerPuntosJugadorDetalle(jugador!.id);
    });

    return { ...roster, jugadores: detalleJugadores };
}
