'use client'
import Agregar from "@app/components/Agregar";
import CategoriesTable from "@app/components/CategoriesTable";

const dataProp = {
  columns: [
    { name: "Nombre", key: "nombre", typeCol: "text" },
    { name: "Descripcion", key: "descripcion", typeCol: "text" },
    { name: "Salario", key: "salarioBase", typeCol: "number" },
  ],
  table: "categoriascapital",
  headerText: "Agregar categoria de capital",
  tittleError: "Error al registrar la categoria de capital",
  tittleSuccess: "Categoria de capital registrada exitosamente",
};

export default function DefinicionSalario() {
    return (
      <>
        <Agregar dataProp={dataProp}/>
        <CategoriesTable />
      </>
    )
  }
  