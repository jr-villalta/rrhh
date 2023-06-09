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
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";

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
      email: email,
      options: {
        emailRedirectTo: "http://localhost:3000",
      },
    });
    if (error) {
      return error;
    }
    return data;
  } catch (error) {
    return error;
  }
};

export default function RootLayout({ children }) {
  const [formData, setFormData] = useState({});
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = () => {
    let message = signInWithEmail(formData.email);
    return message;
  };

  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

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
                <Box
                  rounded={"lg"}
                  bg="white"
                  boxShadow={"lg"}
                  p={8}
                >
                  <Stack spacing={4}>
                    <FormControl id="email">
                      <FormLabel>Dirección de correo electrónico</FormLabel>
                      <Input type="email" onChange={handleInputChange} />
                    </FormControl>
                    <Stack spacing={10}>
                      <Button
                        bg={"blue.400"}
                        color={"white"}
                        _hover={{
                          bg: "blue.500",
                        }}
                        onClick={() => {
                          // let res = handleSubmit();
                          // console.log(res);
                          setSession(true);
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
