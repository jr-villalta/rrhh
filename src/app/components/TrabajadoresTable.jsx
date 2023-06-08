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
import { MdOutlineModeEditOutline } from "react-icons/md";

const dataProp = {
  table: "trabajadores",
  tableCaptionText: "Lista de trabajadores",
  thItems: [
    "dui",
    "nombre completo",
    "Salario",
    "telefono",
    "direccion",
    "estadoCivil",
  ],
};

const fetchData = async () => {
  try {
    let { data, error } = await supabase
      .from(dataProp.table)
      .select("*,categoriascapital(salarioBase),candidatos(nombres,apellidos)");

    if (error) {
      return error;
    } else {
      return data;
    }
  } catch (error) {
    return error;
  }
};

export default function TrabajadoresTable() {
  const [datosCargados, setDatosCargados] = useState(null);

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const data = await fetchData();
      console.log(data);
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
                    key={dato.dui}
                    bg={
                      dato.telefono == null ||
                      dato.direccion == null ||
                      dato.estadoCivil == null
                        ? "orange.200"
                        : ""
                    }
                  >
                    <Td>{dato.dui}</Td>
                    <Td>{dato.candidatos.nombres + " " + dato.candidatos.apellidos}</Td>
                    <Td>$ {dato.categoriascapital.salarioBase}</Td>
                    {dato.telefono == null ? (
                      <Td>No definido</Td>
                    ) : (
                      <Td>{dato.telefono}</Td>
                    )}
                    {dato.direccion == null ? (
                      <Td>No definido</Td>
                    ) : (
                      <Td>{dato.direccion}</Td>
                    )}
                    {dato.estadoCivil == null ? (
                      <Td>No definido</Td>
                    ) : (
                      <Td>{dato.estadoCivil}</Td>
                    )}
                    <Td
                      onClick={() => {
                        toast({
                          title: "Error: El trabajador no se actualizo",
                          status: "error",
                          duration: 3000,
                          isClosable: true,
                        });
                      }}
                    >
                      <MdOutlineModeEditOutline />
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
