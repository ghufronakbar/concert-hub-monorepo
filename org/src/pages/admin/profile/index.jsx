import { Container, Flex, Heading } from "@chakra-ui/react";
import { HeadAdmin } from "@/components/HeadAdmin";
import { NavbarAdmin } from "@/components/NavbarAdmin";
import { withAuth } from "@/lib/authorization";
import { DetailProfile } from "@/components/detail/DetailProfile";
import { SidebarMenu } from "@/components/SidebarOrganization";

function Profile() {
  return (
    <>
      <HeadAdmin />
      <NavbarAdmin />
      <main>
        <Flex>
          <SidebarMenu flex={1} />
          <Container maxW="80%">
            <Heading marginBottom="8" marginTop="8">
              Edit Profile
            </Heading>
            <DetailProfile />
          </Container>
        </Flex>
      </main>
    </>
  );
}

export default withAuth(Profile);
