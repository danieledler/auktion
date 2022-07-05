import { Box } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import Auktionsfika from "../src/components/Auktionsfika";

const Home: NextPage = () => {
  return (
    <Box>
      <Head>
        <title>Auktionsfika</title>
        <meta name="description" content="Auktionsfika" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box as="main" display="flex" flexDir="column">
        <Auktionsfika />
      </Box>
    </Box>
  );
};

export default Home;
