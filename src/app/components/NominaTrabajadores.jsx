import { supabase } from "@app/utils/supabaseClient";
import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

const fetchData = async () => {
  try {
    let { data, error } = await supabase
      .from("trabajadores")
      .select(
        "dui,candidatos(nombres,apellidos),categoriascapital(salarioBase)"
      );

    if (error) {
      return error;
    } else {
      return data;
    }
  } catch (error) {
    return error;
  }
};

const fetchDescuentos = async () => {
  try {
    let { data, error } = await supabase
      .from("deducciones")
      .select("id,nombre,porcentajeTrabajador,porcentajeEmpleador");

    if (error) {
      return error;
    } else {
      return data;
    }
  } catch (error) {
    return error;
  }
};

export default function NominaEmpleados() {
  const [datosCargados, setDatosCargados] = useState(null);
  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const data = await fetchData();
      //   console.log(data);
      setDatosCargados(data || []);
    };

    if (!datosCargados) {
      fetchDataAndSetState();
    }

    const suscripcion = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trabajadores" },
        (payload) => {
          // console.log(payload);
          fetchDataAndSetState();
        }
      )
      .subscribe();

    return () => {
      suscripcion.unsubscribe();
    };
  }, [datosCargados]);

  const [descuentosCargados, setDescuentosCargados] = useState(null);
  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const data = await fetchDescuentos();
      //   console.log(data);
      setDescuentosCargados(data || []);
    };

    if (!descuentosCargados) {
      fetchDataAndSetState();
    }

    const suscripcion = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "deducciones" },
        (payload) => {
          fetchDataAndSetState();
        }
      )
      .subscribe();

    return () => {
      suscripcion.unsubscribe();
    };
  }, [descuentosCargados]);

  let deducciones = 0;
  var total = 0;
  return (
    <>
      <TableContainer>
        <Table variant="striped" colorScheme="teal">
          <TableCaption>Nomina de la empresa</TableCaption>
          <Thead>
            <Tr>
              <Th>DUI</Th>
              <Th>Nombre completo</Th>
              <Th>Salario del empleado</Th>
              {descuentosCargados != null &&
                descuentosCargados.map((descuento,i) => {
                  return <Th key={i}>{descuento.nombre}</Th>;
                })}
              <Th>Total a pagar</Th>
            </Tr>
          </Thead>
          <Tbody>
            {datosCargados != null &&
              datosCargados.map((dato) => {
                return (
                  <Tr key={dato.dui}>
                    <Td>{dato.dui}</Td>
                    <Td>
                      {dato.candidatos.nombres} {dato.candidatos.apellidos}
                    </Td>
                    <Td>${dato.categoriascapital.salarioBase}</Td>
                    {descuentosCargados != null &&
                      descuentosCargados.map((descuento, i) => {
                        deducciones +=
                          dato.categoriascapital.salarioBase *
                          (descuento.porcentajeEmpleador / 100);

                        return (
                          <Td key={i}>
                            $
                            {(
                              dato.categoriascapital.salarioBase *
                              (descuento.porcentajeEmpleador / 100)
                            ).toFixed(2)}
                          </Td>
                        );
                      })}
                    <Td>
                      ${" "}
                      {(
                        dato.categoriascapital.salarioBase + deducciones
                      ).toFixed(2)}
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
