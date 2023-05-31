import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
  } from "@chakra-ui/react";

  export default function Table(data) {
  return (
    <>
      <TableContainer>
        <Table variant="striped" colorScheme="teal">
          <TableCaption>Lista de candidatos</TableCaption>
          <Thead>
            <Tr>
              {data.head.map((item) => {
                return <Th>{item}</Th>;
              })}
            </Tr>
          </Thead>
          <Tbody>
            {data.body.map((items) => {
                return (
                    <Tr>
                    {items.map((item) => {
                        return <Td>{item}</Td>;
                    })}
                    </Tr>
                );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
