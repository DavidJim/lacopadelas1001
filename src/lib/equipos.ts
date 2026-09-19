import equipos from "../../data/equipos.json";

export function obtenerEquipo(equipoId: number) {
  return equipos.find((equipo) => equipo.id === equipoId);
}
