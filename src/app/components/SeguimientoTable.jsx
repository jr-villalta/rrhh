import { supabase } from "@app/supabaseClient";
import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  useToast,
} from "@chakra-ui/react";
import { MdOutlineModeEditOutline, MdOutlineDelete } from "react-icons/md";
import EditSeguimiento from "./EditSeguimiento";

const dataProp = {
  table: "seguimiento",
  tableCaptionText: "Lista de seguimiento de candidatos",
  thItems: ["Candidato", "Puesto", "etapa", "Aprobado"],
};

const fetchData = async () => {
  try {
    let { data, error } = await supabase
      .from(dataProp.table)
      .select(
        "id, etapa, aprobacion, candidatos(nombres,apellidos), puestostrabajo(nombrePuesto)"
      );

    if (error) {
      return error;
    } else {
      return data;
    }
  } catch (error) {
    return error;
  }
};

export default function SeguimientoTable() {
  const [datosCargados, setDatosCargados] = useState(null);

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const data = await fetchData();
      // console.log(data);
      setDatosCargados(data || []);
    };

    if (!datosCargados) {
      fetchDataAndSetState();
    }

    const suscripcion = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: dataProp.table },
        (payload) => {
          // console.log(payload);
          fetchDataAndSetState();
        }
      )
      .subscribe();

    return () => {
      suscripcion.unsubscribe();
    };
  }, [datosCargados]);

  const toast = useToast();
  // console.log("Renderizado");
  return (
    <>
      <TableContainer mt={5}>
        <Table>
          <TableCaption>{dataProp.tableCaptionText}</TableCaption>
          <Thead>
            <Tr>
              {dataProp.thItems.map((thItem) => {
                return <Th key={thItem}>{thItem}</Th>;
              })}
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {datosCargados != null &&
              datosCargados.map((dato) => {
                return (
                  <Tr
                    key={dato.id}
                    bg={
                      dato.aprobacion == null
                        ? "gray.100"
                        : dato.aprobacion
                        ? "green.100"
                        : "red.100"
                    }
                  >
                    <Td>
                      {dato.candidatos.nombres +
                        " " +
                        dato.candidatos.apellidos}
                    </Td>
                    <Td>{dato.puestostrabajo.nombrePuesto}</Td>
                    <Td>{dato.etapa}</Td>
                    {dato.aprobacion == null ? (
                      <Td>No definido</Td>
                    ) : (
                      <Td>{dato.aprobacion ? "Aprobado" : "Reprobado"}</Td>
                    )}
                    <Td>
                      <EditSeguimiento prevData={dato} />
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
