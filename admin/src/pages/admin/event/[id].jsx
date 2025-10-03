import { HeadAdmin } from "@/components/HeadAdmin";
import { DetailEvent } from "@/components/detail/DetailEvent";
import { Container, Flex } from "@chakra-ui/react";
import Event from ".";
import { withAuth } from "@/lib/authorization";
import { SidebarMenu } from "@/components/SidebarOrganization";

function EventID() {
  return (
    <>
      <HeadAdmin />
      <main>
        <Flex>
          <SidebarMenu flex={1} />
          <Container maxW="80%">
            <DetailEvent />
          </Container>
        </Flex>
      </main>
    </>
  );
}

export default withAuth(EventID);
