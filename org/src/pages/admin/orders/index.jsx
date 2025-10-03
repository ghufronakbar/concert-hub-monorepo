import { HeadAdmin } from "@/components/HeadAdmin";
import { SidebarMenu } from "@/components/SidebarOrganization";
import { TableOrders } from "@/components/table/TableOrders";
import { withAuth } from "@/lib/authorization";
import { Container, Flex, Heading } from "@chakra-ui/react";

function Orders() {
  return (
    <>
      <HeadAdmin />
      <main>
        <Flex>
          <SidebarMenu flex={1} />
          <Container maxW="80%">
            <Heading marginBottom="8" marginTop="8">
              Data Orders
            </Heading>
            {TableOrders()}
          </Container>
        </Flex>
      </main>
    </>
  );
}

export default withAuth(Orders);
