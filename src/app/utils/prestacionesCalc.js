import { supabase } from "@app/utils/supabaseClient";
import { useState } from "react";

const fetchData = async () => {
  try {
    let { data, error } = await supabase.from("prestaciones").select("*");
    if (error) {
      return error;
    } else {
      return data;
    }
  } catch (error) {
    return error;
  }
};

export function PrestacionesCalc(salario) {
  const [datosCargados, setDatosCargados] = useState(null);
  let PHN, PHE, PVR, PHEDA, HS, PDEDA;
  let res;

  const fetchDataAndSetState = async () => {
    const data = await fetchData();
    setDatosCargados(data || []);
  };

  if (!datosCargados) {
    fetchDataAndSetState();
  }

  if (datosCargados) {
    datosCargados.forEach((item) => {
      if (item.cod === "PHN") {
        PHN = item.valor;
      } else if (item.cod === "PHE") {
        PHE = item.valor;
      } else if (item.cod === "PVR") {
        PVR = item.valor;
      } else if (item.cod === "PHEDA") {
        PHEDA = item.valor;
      } else if (item.cod === "HS") {
        HS = item.valor;
      } else if (item.cod === "PDEDA") {
        PDEDA = item.valor;
      }
    });

    let PQ = salario / 2;
    let PD = salario / 30;
    let PH = PD / 8;

    res = {
      SM: salario,
      PQ: PQ,
      PD: PD,
      PH: PD / 8,
      SPHN: PH + PH * (PHN / 100),
      SPHEDA: PH + PH * (PHEDA / 100),
      SPDEDA: PD + PD * (PDEDA / 100),
      SPHE: PH + PH * (PHE / 100),
      SPVR: PQ + PQ * (PVR / 100),
    };
  } else {
    res = {};
  }

  return res;
}
