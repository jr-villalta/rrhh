"use client";
import { useState, useEffect } from "react";
import { supabase } from "@app/utils/supabaseClient";

export default function GestionReclutamiento() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let { data: seguimiento, error } = await supabase
          .from("seguimiento")
          .select("*,puestostrabajo (*)");

        if (error) return error;
        return seguimiento;
      } catch (error) {
        return error;
      }
    };

    if (!data) {
      fetchData().then((data) => {
        console.log(data);
        setData(data || []);
      });
    }
  }, [data]);

  return (
    <>
      <div>You are in gestion de reclutamiento</div>
    </>
  );
}
