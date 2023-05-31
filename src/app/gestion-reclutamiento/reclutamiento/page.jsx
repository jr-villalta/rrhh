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
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { supabase } from "@app/supabaseClient";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { MdOutlineModeEditOutline, MdOutlineDelete } from "react-icons/md";

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

const columns = [
  { name: "Nombres", key: "nombres" },
  { name: "Apellidos", key: "apellidos" },
  { name: "Experiencia laboral", key: "experienciaLaboral" },
  { name: "Habilidades", key: "habilidades" },
];

export default function Reclutamiento() {
  const [candidatos, setCandidatos] = useState([]);
  const [datosCargados, setDatosCargados] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

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

  // console.log(candidatos);

  const [formData, setFormData] = useState({});
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const toast = useToast();
  const [response, setResponse] = useState();
  const insertData = async (candidato) => {
    try {
      const { data, error } = await supabase
        .from("candidatos")
        .insert([candidato]);

      if (error) {
        console.error(error);
        setResponse(false);
        setFormData({});
        setDatosCargados(false);
        return;
      }

      console.log("Cadidato", data);
      setResponse(true);
      setFormData({});
      setDatosCargados(false);
      return;
    } catch (error) {
      console.error(error);
      setResponse(false);
      setFormData({});
      setDatosCargados(false);
    }
  };
  const handleSubmit = () => {
    //console.log(formData);
    insertData(formData);
    onClose();
  };

  console.log("Renderizado");
  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <Flex>
          <ModalContent>
            <ModalHeader>Agregar candidato</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {columns.map((column) => {
                return (
                  <FormControl key={column.key} mt={4}>
                    <FormLabel>{column.name}</FormLabel>
                    <Input
                      name={column.key}
                      placeholder={column.name}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                );
              })}
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={async () => {
                  await handleSubmit();
                  if (response) {
                    toast({
                      title: "Candidato agregado.",
                      description:
                        "El candidato ha sido agregado exitosamente.",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                    });
                  } else {
                    toast({
                      title: "Error al agregar candidato.",
                      description:
                        "Ha ocurrido un error al agregar el candidato.",
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                    });
                  }
                }}
              >
                Registrar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Flex>
      </Modal>

      <Flex justifyContent="end" p={2}>
        <Button colorScheme="teal" onClick={onOpen}>
          Insertar
        </Button>
      </Flex>

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
