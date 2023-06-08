import { supabase } from "@app/supabaseClient";
import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  useToast,
} from "@chakra-ui/react";

const dataProp = {
  table: "renta",
  tableCaptionText: "IMPUESTO SOBRE LA RENTA",
  thItems: [
    "DESDE",
    "HASTA",
    "% A APLICAR",
    "SOBRE EL EXCESO DE",
    "CUOTA FIJA",
  ],
};

const fetchData = async () => {
  try {
    let { data, error } = await supabase.from(dataProp.table).select("*");

    if (error) {
      return error;
    } else {
      return data;
    }
  } catch (error) {
    return error;
  }
};

export default function RentaTable() {
  const [datosCargados, setDatosCargados] = useState(null);

  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const data = await fetchData();
      // console.log(data);
      setDatosCargados(data || []);
    };

    if (!datosCargados) {
      fetchDataAndSetState();
    }
  }, [datosCargados]);

  const toast = useToast();
  // console.log("Renderizado");
  return (
    <>
      <TableContainer>
        <Table>
          <TableCaption>{dataProp.tableCaptionText}</TableCaption>
          <Thead>
            <Tr>
              <Th></Th>
              {dataProp.thItems.map((thItem) => {
                return <Th key={thItem}>{thItem}</Th>;
              })}
            </Tr>
          </Thead>
          <Tbody>
            {datosCargados != null &&
              datosCargados.map((dato) => {
                return (
                  <Tr key={dato.tramo}>
                    <Td>TRAMO {dato.tramo}</Td>
                    <Td>$ {dato.desde}</Td>
                    <Td>
                      {dato.hasta == null ? "En adelante" : `$ ${dato.hasta}`}
                    </Td>
                    <Td>{dato.porcentaje} %</Td>
                    <Td>$ {dato.sobreExceso}</Td>
                    <Td>$ {dato.cuotaFija}</Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
