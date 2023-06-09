"use client";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
} from "@chakra-ui/react";
import { PrestacionesCalc } from "@app/utils/prestacionesCalc";

export default function NominaMensual() {
  console.log(PrestacionesCalc(365));
  return (
    <>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Trabajadores</Tab>
          <Tab>Empleados</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <p>one!</p>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
