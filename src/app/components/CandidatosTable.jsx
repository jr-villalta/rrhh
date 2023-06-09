import { supabase } from "@app/utils/supabaseClient";
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
  Box,
} from "@chakra-ui/react";
import EditCandidato from "./EditCandidato";

const dataProp = {
  table: "candidatos",
  tableCaptionText: "Lista de candidatos",
  thItems: [
    "DUI",
    "Nombres",
    "Apellidos",
    "Experiencia laboral",
    "Habilidades",
  ],
};

const fetchData = async () => {
  try {
    let { data, error } = await supabase.from(dataProp.table).select("*");

    if (error) {
      return error;
    } else {
      return data;
    }
  } catch (error) {
    return error;
  }
};

export default function CandidatosTable({ editProp }) {
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
      <TableContainer>
        <Table variant="striped" colorScheme="teal">
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
                  <Tr key={dato.dui}>
                    <Td>{dato.dui}</Td>
                    <Td>{dato.nombres}</Td>
                    <Td>{dato.apellidos}</Td>
                    <Td>
                      <Box
                        w={300}
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="wrap"
                      >
                        {dato.experienciaLaboral}
                      </Box>
                    </Td>
                    <Td>
                      <Box
                        w={300}
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="wrap"
                      >
                        {dato.habilidades}
                      </Box>
                    </Td>
                    <Td>
                      <EditCandidato dataProp={editProp} prevData={dato} />
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
