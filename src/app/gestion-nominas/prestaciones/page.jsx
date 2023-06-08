'use client';
import PrestacionesTable from "@app/components/PrestacionesTable";
import { prestacionesCalc } from "@app/utils/prestacionesCalc";

export default function Prestaciones() {
    console.log(prestacionesCalc(365));
    return (
      <>
        < PrestacionesTable />
      </>
    )
  }
  