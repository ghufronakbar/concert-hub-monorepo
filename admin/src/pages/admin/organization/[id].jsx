import { HeadAdmin } from "@/components/HeadAdmin";
import { Container, Flex } from "@chakra-ui/react";
import { withAuth } from "@/lib/authorization";
import { SidebarMenu } from "@/components/SidebarOrganization";
import { DetailOrganization } from "@/components/detail/DetailOrganization";

function EventID() {
  return (
    <>
      <HeadAdmin />
      <main>
        <Flex>
          <SidebarMenu flex={1} />
          <Container maxW="80%">
            <DetailOrganization />
          </Container>
        </Flex>
      </main>
    </>
  );
}

export default withAuth(EventID);
