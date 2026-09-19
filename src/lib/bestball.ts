export type Posicion = "QB" | "RB" | "WR" | "TE";

export interface JugadorBestball {
  id: number;
  nombre: string;
  posicion: string;
  puntos: number;
  foto: string
}

export interface ResultadoBestball {
  jugadores: JugadorBestball[];
  puntosTotales: number;
}

export function calcularBestball(
  jugadores: JugadorBestball[]
): ResultadoBestball {
  // Copiamos y ordenamos cada posición de mayor a menor puntuación
  const quarterbacks = jugadores
    .filter((jugador) => jugador.posicion === "QB")
    .sort((a, b) => b.puntos - a.puntos);

  const runningBacks = jugadores
    .filter((jugador) => jugador.posicion === "RB")
    .sort((a, b) => b.puntos - a.puntos);

  const wideReceivers = jugadores
    .filter((jugador) => jugador.posicion === "WR")
    .sort((a, b) => b.puntos - a.puntos);

  const tightEnds = jugadores
    .filter((jugador) => jugador.posicion === "TE")
    .sort((a, b) => b.puntos - a.puntos);

  // Elegimos los titulares obligatorios
  const seleccionados: JugadorBestball[] = [];

  if (quarterbacks.length > 0) {
    seleccionados.push(quarterbacks[0]);
  }

  seleccionados.push(...runningBacks.slice(0, 2), ...wideReceivers.slice(0, 2));

  if (tightEnds.length > 0) {
    seleccionados.push(tightEnds[0]);
  }

  // IDs de los jugadores que ya hemos utilizado
  const idsSeleccionados = new Set(
    seleccionados.map((jugador) => jugador.id)
  );

  // Buscamos los FLEX entre los jugadores que todavía no hemos utilizado
  const flex = jugadores
  .filter(
    (jugador) =>
      !idsSeleccionados.has(jugador.id) &&
      ["RB", "WR", "TE"].includes(jugador.posicion)
  )
  .sort((a, b) => b.puntos - a.puntos)
  .slice(0, 2);

  seleccionados.push(...flex);

  // Calculamos la puntuación total
  const puntosTotales = seleccionados.reduce(
    (total, jugador) => total + jugador.puntos,
    0
  );

  return {
    jugadores: seleccionados,
    puntosTotales,
  };
}