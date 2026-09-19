export type Posicion = "QB" | "RB" | "WR" | "TE";

export interface Jugador {
  id: number;
  nombre: string;
  posicion: Posicion;
  foto: string;
}

export interface Equipo {
  id: number;
  nombre: string;
}

export interface Roster {
  equipoId: number;
  equipo: string;
  jugadores: number[];
}

export interface Punto {
  jugadorId: number;
  jornada: number;
  puntos: number;
}

export interface Enfrentamiento {
  id: number;
  ronda: number;
  equipo1Id: number;
  equipo2Id: number;
  jornadas: {
    ida: number;
    vuelta: number;
  };
}