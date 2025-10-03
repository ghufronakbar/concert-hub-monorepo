import { HeadAdmin } from "@/components/HeadAdmin";
import { Container, Flex } from "@chakra-ui/react";
import { withAuth } from "@/lib/authorization";
import { SidebarMenu } from "@/components/SidebarOrganization";
import { FormTicketEdit } from "@/components/form/FormTicketEdit";

function TicketId() {
  return (
    <>
      <HeadAdmin />
      <main>
        <Flex>
          <SidebarMenu flex={1} />
          <Container maxW="80%">
            <FormTicketEdit />
          </Container>
        </Flex>
      </main>
    </>
  );
}

export default withAuth(TicketId);
