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

const columns = [
  { name: "Nombres", key: "nombres" },
  { name: "Apellidos", key: "apellidos" },
  { name: "Experiencia laboral", key: "experienciaLaboral" },
  { name: "Habilidades", key: "habilidades" },
];
export default function AgregarCandidato() {
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const [formData, setFormData] = useState({});
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const insertData = async (candidato) => {
    try {
      const { data, error } = await supabase
        .from("candidatos")
        .insert([candidato]);

      if (error) {
        // console.error(error);
        setFormData({});
        return error;
      }

      // console.log("Cadidato", data);
      setFormData({});
      return data;
    } catch (error) {
      // console.error(error);
      return error;
    }
  };
  const handleSubmit = () => {
    // console.log(formData);
    let message = insertData(formData);
    return message;
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
                  let res = await handleSubmit();
                  if (res == null) {
                    toast({
                      title: "Candidato registrado exitosamente.",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                    });
                  } else {
                    toast({
                      title: "Error al registrar candidato.",
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
