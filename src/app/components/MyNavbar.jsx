import Link from "next/link";
import { useRef } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  MenuDivider,
  Avatar,
  Button,
  Flex,
  Box,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { IoSettingsOutline, IoLogOutSharp } from "react-icons/io5";

const menu = [
  {
    Titulo: "Gestión Reclutamiento de Capital Humano",
    items: [
      {
        Nombre: "Descriptor de los puestos de Trabajo",
        path: "/gestion-reclutamiento/descriptor-puestos",
      },
      {
        Nombre: "Reclutamiento de Capital Humano",
        path: "/gestion-reclutamiento/reclutamiento",
      },
      {
        Nombre: "Sistema de seguimiento de candidatos",
        path: "/gestion-reclutamiento/seguimiento-candidatos",
      },
      {
        Nombre: "Selección de Capital Humano",
        path: "/gestion-reclutamiento/seleccion-capital",
      },
      {
        Nombre: "Ingreso Expediente de los Trabajadores",
        path: "/gestion-reclutamiento/ingreso-expediente-trabajadores",
      },
      {
        Nombre: "Reporte o Informe de categoría o módulo",
        path: "/gestion-reclutamiento",
      },
    ],
  },
  {
    Titulo: "Gestión de nóminas y retribuciones Económicas",
    items: [
      {
        Nombre: "Definición de Salario por Categoría del Capital Humano",
        path: "/gestion-nominas/definicion-salario",
      },
      {
        Nombre: "Definición de Deducciones por Ley",
        path: "/gestion-nominas/deducciones",
      },
      {
        Nombre: "Definición de Prestaciones por Ley",
        path: "/gestion-nominas/prestaciones",
      },
      {
        Nombre: "Beneficios Económicos",
        path: "/gestion-nominas/beneficios-economicos",
      },
      {
        Nombre: "Nómina de Salario Mensuales",
        path: "/gestion-nominas/nomina-mensual",
      },
      {
        Nombre: "Boleta de Pago Mensuales",
        path: "/gestion-nominas/boleta-pago",
      },
      {
        Nombre: "Reporte o Informe de categoría o módulo",
        path: "/gestion-nominas",
      },
    ],
  },
  {
    Titulo: "Módulo de Gestión del tiempo y horarios",
    items: [
      {
        Nombre: "Control de días laborables",
        path: "/gestion-horarios/dias-laborados",
      },
      {
        Nombre: "Control de incapacidades",
        path: "/gestion-horarios/incapacidades",
      },
      {
        Nombre: "Control de ausencias injustificadas",
        path: "/gestion-horarios/ausencias-injustificadas",
      },
      {
        Nombre: "Control de ausencia justificadas",
        path: "/gestion-horarios/ausencias-justificadas",
      },
      {
        Nombre: "Programación de Vacaciones Anuales",
        path: "/gestion-horarios/programacion-vacaciones",
      },
      {
        Nombre: "Reporte o Informe de categoría o módulo",
        path: "/gestion-horarios",
      },
    ],
  },
  {
    Titulo: "Evaluación del Personal ",
    items: [
      { Nombre: "Propuesto por cada equipo acorde a la empresa", path: "/" },
      {
        Nombre: "Reporte o Informe de categoría o módulo",
        path: "/evaluacion-personal",
      },
    ],
  },
];

export default function MyNavbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  return (
    <>
      <Flex
        align="center"
        justify="space-between"
        px={4}
        py={2}
        bg="gray.900"
        color="white"
      >
        <IconButton
          ref={btnRef}
          aria-label="Open Menu"
          bg="gray.900"
          color="white"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          onClick={isOpen ? onClose : onOpen}
        />

        <Menu>
          <MenuButton
            as={Button}
            rounded={"full"}
            variant={"link"}
            cursor={"pointer"}
            minW={0}
            bg="gray.900"
            colorScheme="teal"
          >
            <Avatar size={"sm"} name={"C G"} />
          </MenuButton>
          <MenuList bg="gray.900" color="white">
            <MenuItem
              p={1.5}
              bg="gray.900"
              color="white"
              icon={<IoSettingsOutline />}
            >
              Configuracion
            </MenuItem>
            <MenuDivider borderColor="teal.500" />
            <MenuItem
              p={1.5}
              bg="gray.900"
              color="white"
              icon={<IoLogOutSharp />}
            >
              Cerrar Sesión
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        size={"sm"}
      >
        <DrawerOverlay>
          <DrawerContent bg="gray.700" color="white">
            <DrawerHeader></DrawerHeader>
            <DrawerCloseButton/>
            <DrawerBody>
              <Accordion mt={2}>
                {menu.map((menuItem) => (
                  <AccordionItem key={menuItem.Titulo}>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          {menuItem.Titulo}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Flex flexDirection="column">
                        {menuItem.items.map((item) => (
                          <Link
                            key={item.Nombre}
                            href={item.path}
                            onClick={onClose}
                          >
                            {item.Nombre}
                          </Link>
                        ))}
                      </Flex>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}
