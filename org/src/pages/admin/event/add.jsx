import { HeadAdmin } from "@/components/HeadAdmin";
import { SidebarMenu } from "@/components/SidebarOrganization";
import { FormEventAdd } from "@/components/form/FormEventAdd";
import { withAuth } from "@/lib/authorization";
import { Container, Flex } from "@chakra-ui/react";

function MenuAdd() {
  return (
    <>
      <HeadAdmin />
      <main>
        <Flex>
          <SidebarMenu flex={1} />{" "}
          <Container maxW="80%">
            <FormEventAdd />
          </Container>
        </Flex>
      </main>
    </>
  );
}

export default withAuth(MenuAdd);
