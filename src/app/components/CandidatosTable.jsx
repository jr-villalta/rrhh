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

const deleteCandidate = async (col, id) => {
  try {
    const { data, error } = await supabase
      .from(dataProp.table)
      .delete()
      .eq(col, id);

    if (error) {
      return error;
    } else {
      return data;
    }
  } catch (error) {
    return error;
  }
};

export default function CandidatosTable({editProp}) {
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
                    <Td>{dato.experienciaLaboral}</Td>
                    <Td>{dato.habilidades}</Td>
                    <Td>
                      <EditCandidato dataProp={editProp} prevData={dato} />
                    </Td>
                    <Td
                      onClick={() => {
                        let del = deleteCandidate("dui", dato.dui);
                        del.then((res) => {
                          if (res == null) {
                            toast({
                              title: "Candidato eliminado exitosamente",
                              status: "Success",
                              duration: 3000,
                              isClosable: true,
                            });
                          } else {
                            toast({
                              title: "Error: El candidato no ha sido eliminado",
                              status: "error",
                              duration: 3000,
                              isClosable: true,
                            });
                          }
                        });
                      }}
                    >
                      <MdOutlineDelete />
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
