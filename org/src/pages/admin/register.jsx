import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Button,
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

import { HeadAdmin } from "@/components/HeadAdmin";
import { primaryColor, white } from "@/lib/color";
import { axiosInstance } from "@/lib/axiosInstance";

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

export default function Register() {
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [logo, setLogo] = useState(null);
  const [ktp, setKtp] = useState(null);
  const [legalityLetter, setLegalityLetter] = useState(null);
  const [error, setError] = useState("");
  const toast = useToast();
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();


    const formData = new FormData();
    formData.append("organization_name", organizationName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("confirmation_password", confirmPassword);
    if (logo) formData.append("logo", logo);
    if (ktp) formData.append("ktp", ktp);
    if (legalityLetter) formData.append("legality_letter", legalityLetter);

    try {
      const response = await axiosInstance.post("/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { success, message, status } = response.data;
      if (status == 200) {
        toast({
          title: "Register successfully! Wait for the admin confirmation",
          status: "success",
          position: "bottom-right",
          isClosable: true,
        });
        router.push(`/admin/login`);
      } else {
        console.log(response);
        setError(message);
        toast({
          title: message || "Registration failed",
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error registering:", error.message);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to register. Please try again.";
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
        <Container maxW="md" py={8}>
          <Flex align="center" justify="center" direction="column">
            <Avatar bg={primaryColor} icon={<LockIcon />} mb={4} />
            <Heading as="h1" size="lg" mb={6}>
              Register Account for Admin Organization
            </Heading>
            <Box as="form" w="100%" onSubmit={handleRegister}>
              <VStack spacing={4}>
                <FormControl id="organizationName">
                  <FormLabel>Organization Name</FormLabel>
                  <Input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                  />
                </FormControl>
                <FormControl id="email">
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl id="phone">
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
                <FormControl id="confirmPassword">
                  <FormLabel>Confirm Password</FormLabel>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </FormControl>
                <FormControl id="logo" isRequired>
                  <FormLabel>Organization Logo</FormLabel>
                  <Input
                    type="file"
                    onChange={(e) => setLogo(e.target.files[0])}
                  />
                </FormControl>
                <FormControl id="ktp" isRequired>
                  <FormLabel>KTP</FormLabel>
                  <Input
                    type="file"
                    onChange={(e) => setKtp(e.target.files[0])}
                  />
                </FormControl >
                <FormControl id="legalityLetter" isRequired>
                  <FormLabel>Legality Letter</FormLabel>
                  <Input
                    type="file"
                    onChange={(e) => setLegalityLetter(e.target.files[0])}
                  />
                </FormControl>
                <Button type="submit" color={white} bg={primaryColor} w="full">
                  Register
                </Button>
              </VStack>
              <Flex justify="space-between" mt={4}>
                <HStack
                  onClick={() => {
                    router.push(`/admin/login`);
                  }}
                >
                  <Text>Already have an account?</Text>
                  <Text color={primaryColor}>Login</Text>
                </HStack>
              </Flex>
              <Copyright mt={8} />
            </Box>
          </Flex>
        </Container>
      </Grid>
    </Box>
  );
}
