import {
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { supabase } from "@app/supabaseClient";

const dataProp = {
  columns: [
    { name: "Puesto", key: "idPuesto", typeCol: "number" },
    { name: "Candidato", key: "idCandidato", typeCol: "number" },
  ],
  headerText: "Agregar Seguimiento",
  tittleSuccess: "Seguimiento agregado",
  tittleError: "Error al agregar seguimiento",
};

export default function AgregarSeguimiento() {
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const [formData, setFormData] = useState({});
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const fetchPuestos = async () => {
    try {
      let { data, error } = await supabase
        .from("puestosTrabajo")
        .select("id, nombrePuesto")
        .eq("estadoPuesto", true);

      if (error) {
        return error;
      } else {
        return data;
      }
    } catch (error) {
      return error;
    }
  };

  const fetchCandidatos = async () => {
    try {
      let { data, error } = await supabase
        .from("candidatos")
        .select("id, nombres, apellidos");

      if (error) {
        return error;
      } else {
        return data;
      }
    } catch (error) {
      return error;
    }
  };

  const handleSubmit = () => {
    // console.log(formData);
    const fetchData = async () => {
      const puestos = await fetchPuestos();
      const candidatos = await fetchCandidatos();
      console.log(puestos);
      console.log(candidatos);
    };
    fetchData();
  };

  return (
    <>
      <Flex justifyContent="end" p={2}>
        <Button colorScheme="teal" onClick={onOpen}>
          Insertar
        </Button>
      </Flex>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <Flex>
          <ModalContent>
            <ModalHeader>{dataProp.headerText}</ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              {dataProp.columns.map((column) => {
                return (
                  <FormControl key={column.key} mt={4}>
                    <FormLabel>{column.name}</FormLabel>
                    <Input
                      name={column.key}
                      placeholder={column.name}
                      onChange={handleInputChange}
                      type={column.typeCol}
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
                  let res = await handleSubmit();
                  if (res == null) {
                    toast({
                      title: dataProp.tittleSuccess,
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                    });
                  } else {
                    toast({
                      title: dataProp.tittleError,
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                    });
                  }
                  onClose();
                }}
              >
                Registrar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Flex>
      </Modal>
    </>
  );
}
