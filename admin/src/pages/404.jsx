import { Flex, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      flexDirection="column"
    >
      <Heading>Concert Hub: Page 404 - Not Found</Heading>
      <Image
      alt=""
      src='/404.jpg'
      width={500}
      height={500}/>      
      <Text marginTop="4">
        Return to{" "}
        <Text
          as="span"
          color="blue"
          cursor="pointer"
          onClick={() => {
            router.push(`/admin/event`);
          }}
        >
          Dashboard
        </Text>
      </Text>
    </Flex>
  );
}
