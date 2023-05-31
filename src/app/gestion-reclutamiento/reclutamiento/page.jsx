"use client";
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
import { supabase } from "@app/supabaseClient";
import { useState, useEffect } from "react";
import { MdOutlineModeEditOutline, MdOutlineDelete } from "react-icons/md";
import AgregarCandidato from "@app/components/AgregarCandidato";

const fetchData = async () => {
  let { data: candidatos, error } = await supabase
    .from("candidatos")
    .select("*");

  if (error) {
    console.error(error);
  } else {
    return candidatos;
  }
};

const deleteCandidate = async (col, id) => {
  try {
    const { data, error } = await supabase
      .from("candidatos")
      .delete()
      .eq(col, id);

    if (error) {
      console.error(error);
    } else {
      console.log(data);
    }
  } catch (error) {
    console.error(error);
  }
};

export default function Reclutamiento() {
  const [candidatos, setCandidatos] = useState([]);
  const [datosCargados, setDatosCargados] = useState(false);

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const data = await fetchData();
      setCandidatos(data || []);
      setDatosCargados(true);
    };

    if (!datosCargados) {
      fetchDataAndSetState();
    }
  }, [datosCargados]);

  const toast = useToast();
  console.log("Renderizado");
  return (
    <>
      <AgregarCandidato />

      <TableContainer>
        <Table variant="striped" colorScheme="teal">
          <TableCaption>Lista de candidatos</TableCaption>
          <Thead>
            <Tr>
              <Th>Nombres</Th>
              <Th>Apellidos</Th>
              <Th>Experiencia laboral</Th>
              <Th>Habilidades</Th>
              <Th></Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {candidatos.map((candidato) => {
              return (
                <Tr key={candidato.id}>
                  <Td>{candidato.nombres}</Td>
                  <Td>{candidato.apellidos}</Td>
                  <Td>{candidato.experienciaLaboral}</Td>
                  <Td>{candidato.habilidades}</Td>
                  <Td
                    onClick={() => {
                      toast({
                        title: "Editar candidato.",
                        status: "warning",
                        duration: 3000,
                        isClosable: true,
                      });
                    }}
                  >
                    <MdOutlineModeEditOutline />
                  </Td>
                  <Td
                    onClick={() => {
                      deleteCandidate("id", candidato.id);
                      toast({
                        title: "Eliminar candidato.",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
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
