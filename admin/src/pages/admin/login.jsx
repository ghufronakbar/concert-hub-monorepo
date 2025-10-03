import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  HStack,
  Input,
  Link,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";
import {axiosInstance} from "@/lib/axiosInstance"; // Adjust the import according to your file structure
import { HeadAdmin } from "@/components/HeadAdmin"; // Adjust the import according to your file structure
import { primaryColor, white } from "@/lib/color";

function Copyright(props) {
  return (
    <Text align="center" {...props}>
      {"Copyright © "}
      <Link color="blue.500" href={process.env.NEXT_PUBLIC_URL}>
        Concert Hub
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Text>
  );
}

export default function SignInSide() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const toast = useToast();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      const { success, message, token, status } = response.data;

      if (success) {
        localStorage.setItem("token", token);
        toast({
          title: "Login Successfully",
          status: "success",
          position: "bottom-right",
          isClosable: true,
        });

        router.push(`/admin/event`);
      } else {
        console.log(response);
        setError(message);
        toast({
          title: message || "Email or Password doesn't match",
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      const errorMessage =
        error.response?.data?.message || "Failed to login. Please try again.";
      setError(errorMessage);
      toast({
        title: errorMessage,
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {HeadAdmin()}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} flex="1">
        <Box
          display={{ base: "none", md: "block" }}
          bgImage="/bg.jpg"
          bgSize="cover"
          bgPosition="center"                    
        />
        <Container maxW="md" py={8} mt={32}>
          <Flex align="center" justify="center" direction="column">
            <Avatar bg={primaryColor} icon={<LockIcon />} mb={4} />
            <Heading as="h1" size="lg" mb={6}>
              Login as Admin
            </Heading>
            <Box as="form" w="100%" onSubmit={handleLogin}>
              <VStack spacing={4}>
                <FormControl id="email" isRequired>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <Checkbox>Remember me</Checkbox>
                </FormControl>
                <Button type="submit" color={white} bg={primaryColor} w="full">
                  Login
                </Button>
              </VStack>
              
              <Copyright mt={8} />
            </Box>
          </Flex>
        </Container>
      </Grid>
    </Box>
  );
}
