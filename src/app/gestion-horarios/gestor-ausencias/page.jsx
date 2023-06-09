"use client";
import AgregarAusencia from "@app/components/AgregarAusencia";

const dataProp = {
    columns: [
      { name: "Dui del empleado", key: "dui", typeCol: "text" },
      { name: "Fecha", key: "fecha", typeCol: "date" },
    ],
    table: "ausencias",
    headerText: "Agregar ausencias o vacaciones",
    tittleError: "Error al registrar la ausencia o vacacion",
    tittleSuccess: "Ausencia o vacacion registrada con éxito",
  };

export default function GestorAusencias() {
  return (
    <>
      < AgregarAusencia dataProp={dataProp} />
    </>
  );
}
