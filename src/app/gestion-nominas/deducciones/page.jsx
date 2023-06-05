'use client'
import Agregar from "@app/components/Agregar";
import DeduccionesTable from "@app/components/DeduccionesTable";
import RentaTable from "@app/components/RentaTable";

const dataProp = {
  columns: [
    { name: "Nombre", key: "nombre", typeCol: "text" },
    { name: "Porcentaje del Trabajador", key: "porcentajeTrabajador", typeCol: "number" },
    { name: "Porcentaje del Empleador", key: "porcentajeEmpleador", typeCol: "number" },
  ],
  table: "deducciones",
  headerText: "Agregar deduccion",
  tittleError: "Error al registrar deduccion",
  tittleSuccess: "Deduccion registrada exitosamente",
};

export default function Deducciones() {
    return (
      <>
        <Agregar dataProp={dataProp}/>
        <DeduccionesTable />
        <RentaTable mt={5}/>
      </>
    )
  }
  