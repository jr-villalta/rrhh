"use client";
import MyNavbar from "../../components/MyNavbar";
import { ChakraBaseProvider } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";

const metadata = {
  title: "RH System",
  description: "New app people management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <ChakraBaseProvider>
          <Flex direction={"column"}>
            <MyNavbar />
            {children}
          </Flex>
        </ChakraBaseProvider>
      </body>
    </html>
  );
}
