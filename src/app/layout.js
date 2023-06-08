"use client";
import MyNavbar from "./components/MyNavbar";
import { ChakraBaseProvider, extendBaseTheme } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import chakraTheme from '@chakra-ui/theme';

const metadata = {
  title: "RH System",
  description: "New app people management",
};

const theme = extendBaseTheme({
  ...chakraTheme,
})

export default function RootLayout({ children }) {
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
