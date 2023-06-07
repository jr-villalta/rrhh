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
  Select,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@app/supabaseClient";

export default function Agregar({ dataProp }) {
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const [formData, setFormData] = useState({});
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const [puestos, setPuestos] = useState(null);
  useEffect(() => {
    const fetchPuestos = async () => {
      try {
        let { data, error } = await supabase
          .from("puestostrabajo")
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

    if (!puestos) {
      fetchPuestos().then((data) => {
        // console.log(data);
        setPuestos(data || []);
      });
    }
  }, [puestos]);

  const insertSeguimiento = async (formData) => {
    const dui = formData.dui;
    const puesto = formData.id;
    // console.log(dui);
    // console.log(puesto);

    try {
      const { data, error } = await supabase
        .from("seguimiento")
        .insert([{ idPuesto: puesto, idCandidato: dui }]);

      if (error) {
        setFormData({});
        return error;
      }

      setFormData({});
      return data;
    } catch (error) {
      return error;
    }
  };

  const insertData = async (formData) => {
    let newFormData = { ...formData };
    delete newFormData.id;
    // console.log(newFormData);

    try {
      const { data, error } = await supabase
        .from(dataProp.table)
        .insert([newFormData]);

      if (error) {
        setFormData({});
        return error;
      }

      setFormData({});
      return data;
    } catch (error) {
      return error;
    }
  };
  const handleSubmit = async () => {
    let data = await insertData(formData);
    let segui = insertSeguimiento(formData);
    let res = null;
    data != null && segui != null ? (res = new Error()) : (res = null);
    return res;
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
                return column.key === "dui" ? (
                  <FormControl key={column.key} mt={4}>
                    <FormLabel>{column.name}</FormLabel>
                    <Input
                      name={column.key}
                      placeholder={column.name}
                      onChange={handleInputChange}
                      type={column.typeCol}
                      maxLength={10}
                      value={formData.dui || ""}
                    />
                  </FormControl>
                ) : (
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

              <FormControl mt={4}>
                <FormLabel>Seleccionar puesto</FormLabel>
                <Select
                  onChange={handleInputChange}
                  name="id"
                  placeholder="Seleccionar puesto"
                >
                  {puestos != null &&
                    puestos.map((puesto) => {
                      return (
                        <option value={puesto.id} key={puesto.id}>
                          {puesto.nombrePuesto}
                        </option>
                      );
                    })}
                </Select>
              </FormControl>
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
