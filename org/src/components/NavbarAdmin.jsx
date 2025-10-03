import {
  Flex,
  Spacer,
  Box,
  Heading,
  Link as ChakraLink,
  Button,
  UnorderedList,
  List,
  Image,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Nav, NavbarBrand } from "reactstrap";

export function NavbarAdmin() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  return (
   <>
   </>
  );
}
