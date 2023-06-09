import React, { useState, useEffect } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Flex } from "@chakra-ui/react";

export default function EvalPersonal() {
  const [empleado, setEmpleado] = useState("");
  const [dui, setDui] = useState("");
  const [puesto, setPuesto] = useState("");
  const [fechaActual, setFechaActual] = useState("");
  const [evaluacion, setEvaluacion] = useState({
    adaptabilidad: 0,
    comunicacion: 0,
    conocimientos: 0,
    calidad: 0,
    resolucion: 0
  });
  const [comentarios, setComentarios] = useState("");
  const [totalPuntaje, setTotalPuntaje] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const beforePrint = () => {
      setIsPrinting(true);
    };

    const afterPrint = () => {
      setIsPrinting(false);
    };

    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);

    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, []);

  useEffect(() => {
    setFechaActual(obtenerFechaActual());
  }, []);

  const handleEmpleadoChange = (event) => {
    setEmpleado(event.target.value);
  };

  const handleDuiChange = (event) => {
    setDui(event.target.value);
  };

  const handlePuestoChange = (event) => {
    setPuesto(event.target.value);
  };

  const handlePuntajeChange = (criterio, puntaje) => {
    const parsedPuntaje = parseFloat(puntaje);
    if (!isNaN(parsedPuntaje) && parsedPuntaje >= 1 && parsedPuntaje <= 10) {
      const nuevaEvaluacion = { ...evaluacion, [criterio]: parsedPuntaje };
      setEvaluacion(nuevaEvaluacion);
      calcularTotalPuntaje(nuevaEvaluacion);
    }
  };

  const calcularTotalPuntaje = (evaluacion) => {
    let sumaPuntajes = 0;
    let sumaPesos = 0;
    criterios.forEach((criterio, index) => {
      const peso = pesos[index];
      const puntaje = evaluacion[criterio];
      sumaPuntajes += peso * puntaje;
      sumaPesos += peso;
    });

    const total = sumaPesos > 0 ? sumaPuntajes / sumaPesos : 0;
    setTotalPuntaje(total);
  };

  const handleComentariosChange = (event) => {
    setComentarios(event.target.value);
  };

  const handleImprimirClick = () => {
    setIsPrinting(true);
    window.print();
  };

  const limpiarFormulario = () => {
    setEmpleado("");
    setDui("");
    setPuesto("");
    setFechaActual("");
    setEvaluacion({
      adaptabilidad: 0,
      comunicacion: 0,
      conocimientos: 0,
      calidad: 0,
      resolucion: 0
    });
    setComentarios("");
    setTotalPuntaje(0);
  };

  const criterios = [
    "Adaptabilidad",
    "Comunicación efectiva",
    "Conocimientos",
    "Calidad del trabajo realizado",
    "Resolución de problemas"
  ];

  const pesos = [20, 15, 25, 20, 20];

  const obtenerFechaActual = () => {
    const fecha = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    return fecha.toLocaleDateString(undefined, options);
  };

  const firma = "Firma";

  return (
    <Box mx="10%">
        <Box mb={4}>
        {fechaActual}
      </Box>
      <Box mb={4}>
        <label htmlFor="empleadoInput">Empleado: </label>
        <input
          id="empleadoInput"
          type="text"
          value={empleado}
          onChange={handleEmpleadoChange}
        />
      </Box>

      <Box mb={4}>
        <label htmlFor="duiInput">DUI: </label>
        <input
          id="duiInput"
          type="text"
          value={dui}
          onChange={handleDuiChange}
        />
      </Box>

      <Box mb={4}>
        <label htmlFor="puestoInput">Puesto: </label>
        <input
          id="puestoInput"
          type="text"
          value={puesto}
          onChange={handlePuestoChange}
        />
      </Box>

      {empleado && (
        <Table>
          <Thead>
            <Tr>
              <Th>Criterio</Th>
              <Th>Peso (%)</Th>
              <Th>Puntuación (1 - 10)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {criterios.map((criterio, index) => (
              <Tr key={criterio}>
                <Td>{criterio}</Td>
                <Td>{pesos[index]}</Td>
                <Td>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max="10"
                    value={evaluacion[criterio]}
                    onChange={(e) => handlePuntajeChange(criterio, e.target.value)}
                    style={{ border: "1px solid gray" }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Box mt={4}>
        <label htmlFor="comentarios">Comentarios:</label>
        <textarea
          id="comentarios"
          value={comentarios}
          onChange={handleComentariosChange}
          style={{ border: "1px solid gray", width: "100%" }}
        />
      </Box>

      <Box mt={4}>
        <strong>Puntaje total de la evaluación:</strong> {totalPuntaje.toFixed(2)}
      </Box>

      <Flex mt={4} justifyContent="center">
        {!isPrinting && (
          <>
            <Button ml={2} onClick={limpiarFormulario}>
              Limpiar
            </Button>
            <Button ml={2} onClick={handleImprimirClick}>
              Imprimir
            </Button>
          </>
        )}
      </Flex>

      <Flex mt={4} flexDirection="column" alignItems="center">
        <hr style={{ width: "45%", marginTop: "50px" }} />
        <Box mt={2}>
          <Flex justifyContent="center">
            <p>{firma}</p>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
