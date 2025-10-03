import { HeadAdmin } from "@/components/HeadAdmin";
import { FormEventEdit } from "@/components/form/FormEventEdit";
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
            <FormEventEdit />
          </Container>
        </Flex>
      </main>
    </>
  );
}

export default withAuth(EventID);
