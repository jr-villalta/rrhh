"use client";
import Agregar from "@app/components/AgregarCandidato";
import CandidatosTable from "@app/components/CandidatosTable";

const dataProp = {
  columns: [
    { name: "DUI", key: "dui", typeCol: "text"},
    { name: "Nombres", key: "nombres", typeCol: "text" },
    { name: "Apellidos", key: "apellidos", typeCol: "text" },
    { name: "Experiencia laboral", key: "experienciaLaboral", typeCol: "text" },
    { name: "Habilidades", key: "habilidades", typeCol: "text" },
  ],
  table: "candidatos",
  headerText: "Agregar candidato",
  tittleError: "Error al registrar el candidato.",
  tittleSuccess: "Candidato registrado exitosamente.",
};

export default function Reclutamiento() {
  // console.log("Renderizado");
  return (
    <>
      <Agregar dataProp={dataProp} />
      <CandidatosTable />
    </>
  );
}
