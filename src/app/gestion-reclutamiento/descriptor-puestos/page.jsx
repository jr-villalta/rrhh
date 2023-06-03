"use client";
import AgregarPuesto from '@app/components/Agregar';
import PuestosTable from '@app/components/PuestosTable';

const dataProp = {
  columns: [
  { name: "Nombre del puesto", key: "nombrePuesto", typeCol:"text"},
  { name: "Descripcion", key: "descripcionPuesto", typeCol:"text"},
  { name: "Requisitos", key: "requisitos", typeCol:"text"},
],
  table: "puestosTrabajo",
  headerText: "Agregar puesto",
  tittleError: "Error al registrar el puesto.",
  tittleSuccess: "Puesto registrado exitosamente.",
}

export default function DescriptorPuestos() {
    return (
      <>
        <AgregarPuesto dataProp={dataProp} />
        <PuestosTable />
      </>
    )
  }
  