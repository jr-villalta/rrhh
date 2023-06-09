"use client";
import MyNavbar from "./components/MyNavbar";
import { ChakraBaseProvider, extendBaseTheme } from "@chakra-ui/react";
import chakraTheme from "@chakra-ui/theme";
import { supabase } from "@app/utils/supabaseClient";
import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { Router } from "next/router";

const metadata = {
  title: "RH System",
  description: "New app people management",
};

const theme = extendBaseTheme({
  ...chakraTheme,
});

const signInWithEmail = async (email) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email
    });
    if (error) {
      return error;
    }
    return data;
  } catch (error) {
    return error;
  }
};

const correosValidos = async () => {
  try {
    const { data, error } = await supabase.from("correos").select("correo");
    if (error) {
      return error;
    }
    return data;
  } catch (error) {
    return error;
  }
};

const validarCorreo = (correo, correos) => {
  let valido = false;
  correos.forEach((element) => {
    if (element.correo == correo) {
      valido = true;
    }
  });
  return valido;
};

export default function RootLayout({ children }) {
  const toast = useToast();
  const [email, setEmail] = useState(null);
  const [session, setSession] = useState(null);
  const [correos, setCorreos] = useState(null);

  const fetchDataAndSetState = async () => {
    const data = await correosValidos();
    setCorreos(data);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    fetchDataAndSetState();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <html lang="es">
        <head>
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />
        </head>
        <body>
          <ChakraBaseProvider theme={theme}>
            <Flex
              minH={"100vh"}
              align={"center"}
              justify={"center"}
              bg="gray.100"
            >
              <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                <Stack align={"center"}>
                  <Heading fontSize={"4xl"}>Inicia sesión en tu cuenta</Heading>
                  <Text fontSize={"lg"} color={"gray.600"}>
                    para disfrutar de todas nuestras{" "}
                    <Link color={"blue.400"}>fantásticas funciones</Link> ✌️
                  </Text>
                </Stack>
                <Box rounded={"lg"} bg="white" boxShadow={"lg"} p={8}>
                  <Stack spacing={4}>
                    <FormControl id="email">
                      <FormLabel>Dirección de correo electrónico</FormLabel>
                      <Input
                        type="email"
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                    </FormControl>
                    <Stack spacing={10}>
                      <Button
                        bg={"blue.400"}
                        color={"white"}
                        _hover={{
                          bg: "blue.500",
                        }}
                        onClick={async (e) => {
                          e.preventDefault();
                          if (validarCorreo(email, correos) && email.length > 0) {
                            let message = await signInWithEmail(email);
                            toast({
                              title: "Correo enviado",
                              description:
                                "Se ha enviado un correo a tu bandeja de entrada",
                              status: "success",
                              duration: 3000,
                              isClosable: true,
                            });
                          } else {
                            toast({
                              title: "Correo no valido",
                              description: "El correo ingresado no es valido",
                              status: "error",
                              duration: 3000,
                              isClosable: true,
                            });
                          }
                        }}
                      >
                        Inicia sesión
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </Flex>
          </ChakraBaseProvider>
        </body>
      </html>
    );
  } else {
    return (
      <html lang="es">
        <head>
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />
        </head>
        <body>
          <ChakraBaseProvider theme={theme}>
            <Flex direction={"column"}>
              <MyNavbar />
              {children}
            </Flex>
          </ChakraBaseProvider>
        </body>
      </html>
    );
  }
}
