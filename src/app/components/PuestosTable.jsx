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

const dataProp = {
  table: "puestostrabajo",
  tableCaptionText: "Lista de puestos de trabajo",
  thItems: ["Nombre del puesto", "Descripcion", "Requisitos", "Estado"],
};

const fetchData = async () => {
  try {
    let { data, error } = await supabase.from(dataProp.table).select("*");

    if (error) {
      console.error(error);
      return error;
    } else {
      return data;
    }
  } catch (error) {
    return error;
  }
};

const deletePuesto = async (col, id) => {
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

export default function PuestosTable() {
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
  return (
    <>
      <TableContainer>
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
                    bg={dato.estadoPuesto ? "green.200" : "red.200"}
                  >
                    <Td>{dato.nombrePuesto}</Td>
                    <Td>{dato.descripcionPuesto}</Td>
                    <Td>{dato.requisitos}</Td>
                    <Td>{dato.estadoPuesto ? "Activo" : "Inactivo"}</Td>
                    <Td
                      onClick={() => {
                        let del = deletePuesto("id", dato.id);
                        del.then((res) => {
                          if (res == null) {
                            toast({
                              title: "Puesto eliminado exitosamente",
                              status: "success",
                              duration: 3000,
                              isClosable: true,
                            });
                          }else{
                            toast({
                              title: "Error: No se pudo eliminar el puesto",
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
