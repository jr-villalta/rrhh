"use client";
import { Box, Heading, Text } from "@chakra-ui/react";

const WelcomePage = () => {
  return (
    <Box
      maxW="container.sm"
      m="auto"
      p={4}
      display="flex"
      justifyContent="center"
    >
      <Box textAlign="center">
        <Heading as="h1" mb={4}>
          Bienvenido al Sistema de Gestión de Empleados
        </Heading>
        <Text fontSize="xl" mb={6}>
          MP Consultoría y Construcción S.A. DE C.V.
        </Text>
        <Text fontSize="lg" mb={8}>
          ¡Gracias por utilizar nuestro sistema! Aquí podrás gestionar la
          información de los empleados, administrar los registros de asistencia,
          generar reportes y más.
        </Text>
      </Box>
    </Box>
  );
};

export default WelcomePage;
