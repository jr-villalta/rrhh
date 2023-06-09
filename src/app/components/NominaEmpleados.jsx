import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  // Tfoot,
  // Flex,
  // Button,
} from "@chakra-ui/react";
import { supabase } from "@app/utils/supabaseClient";
import { useEffect, useState } from "react";

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

const fetchRenta = async () => {
  try {
    let { data, error } = await supabase
      .from("renta")
      .select("tramo,desde,hasta,porcentaje,sobreExceso,cuotaFija");

    if (error) {
      return error;
    } else {
      return data;
    }
  } catch (error) {
    return error;
  }
};

const calcularRenta = (salarioBase, renta, deduccionesCargadas) => {
  if (renta == null) {
    return 0;
  }
  let rentaCalculada = 0;
  let cuotaFija = 0;
  let porcentaje = 0;
  let sobreExceso = 0;
  let deducciones = deduccionesCargadas;

  renta.map((tramo) => {
    if (tramo.hasta != null) {
      if (salarioBase >= tramo.desde && salarioBase <= tramo.hasta) {
        cuotaFija = tramo.cuotaFija;
        porcentaje = tramo.porcentaje;
        sobreExceso = tramo.sobreExceso;
      }
    } else {
      if (salarioBase >= tramo.desde) {
        cuotaFija = tramo.cuotaFija;
        porcentaje = tramo.porcentaje;
        sobreExceso = tramo.sobreExceso;
      }
    }
  });

  rentaCalculada =
    (salarioBase - deducciones - sobreExceso) * (porcentaje / 100) + cuotaFija;

  //   console.log(rentaCalculada);
  return rentaCalculada;
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

  const [rentaCargada, setRentaCargada] = useState(null);
  useEffect(() => {
    const fetchDataAndSetState = async () => {
      const data = await fetchRenta();
      data.sort((a, b) => a.tramo - b.tramo);
      //   console.log(data);
      setRentaCargada(data || []);
    };

    if (!rentaCargada) {
      fetchDataAndSetState();
    }

    const suscripcion = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "renta" },
        (payload) => {
          fetchDataAndSetState();
        }
      )
      .subscribe();

    return () => {
      suscripcion.unsubscribe();
    };
  }, [rentaCargada]);

  let deducciones = 0;
  return (
    <>
      <TableContainer>
        <Table variant="striped" colorScheme="teal">
          <TableCaption>Nomina de empleados</TableCaption>
          <Thead>
            <Tr>
              <Th>DUI</Th>
              <Th>Nombre completo</Th>
              <Th>Salario base</Th>
              {descuentosCargados != null &&
                descuentosCargados.map((descuento, i) => {
                  return <Th key={i}>{descuento.nombre}</Th>;
                })}
              <Th>Renta</Th>
              <Th>Salario liquido</Th>
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
                          (descuento.porcentajeTrabajador / 100);

                        return (
                          <Td key={i}>
                            $
                            {(
                              dato.categoriascapital.salarioBase *
                              (descuento.porcentajeTrabajador / 100)
                            ).toFixed(2)}
                          </Td>
                        );
                      })}
                    <Td>
                      $
                      {rentaCargada != null &&
                        calcularRenta(
                          dato.categoriascapital.salarioBase,
                          rentaCargada,
                          deducciones
                        ).toFixed(2)}
                    </Td>
                    <Td>
                      ${" "}
                      {(
                        dato.categoriascapital.salarioBase -
                        deducciones -
                        calcularRenta(
                          dato.categoriascapital.salarioBase,
                          rentaCargada,
                          deducciones
                        )
                      ).toFixed(2)}
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
          {/* <Tfoot>
            <Tr>
              <Th>
                <Button colorScheme="teal" size="sm" my={2}>
                  Generar boletas de pago
                </Button>
              </Th>
            </Tr>
          </Tfoot> */}
        </Table>
      </TableContainer>
    </>
  );
}
