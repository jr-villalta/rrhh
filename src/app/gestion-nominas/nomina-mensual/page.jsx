"use client"; 
import { prestacionesCalc } from "@app/utils/prestacionesCalc";

export default function NominaMensual() {
    console.log(prestacionesCalc(365));
    return (
      <>
        <div>NominaMensual</div>
      </>
    )
  }
  