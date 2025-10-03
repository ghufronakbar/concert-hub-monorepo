import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axiosInstanceAuthorization from "../../lib/axiosInstanceAuthorization";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Loading } from "../Loading";
import { primaryColor, tersierColor } from "@/lib/color";
import { useSearchParams } from "next/navigation";

export function TableOrganization() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryStatus = searchParams.get("status");

  const {
    data: dataOrg,
    isLoading,
    isError,
    refetch: refetchDataOrg,
  } = useQuery({
    queryKey: ["organizations", queryStatus],
    queryFn: async () => {
      const endpoint =
        queryStatus == null
          ? "/organizations"
          : `/organizations?status=${queryStatus}`;
      const dataResponse = await axiosInstanceAuthorization.get(endpoint);
      return dataResponse.data;
    },
  });

  const noData = () => {
    if (dataOrg && dataOrg.length === 0) {
      return (
        <Alert status="warning">
          <AlertIcon />
          There&apos;s no data event
        </Alert>
      );
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <Text>Error loading data</Text>;

  return (
    <>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th></Th>
              <Th>Organization</Th>
              <Th>Total Event</Th>
              <Th>
                <Center>Status</Center>
              </Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {dataOrg &&
              dataOrg.map((org, index) => (
                <Tr key={org.id_organization}>
                  <Td>{index + 1}</Td>
                  <Td>
                    <Image
                      src={org.logo}
                      alt={org.organization_name}
                      boxSize="50px"
                      borderRadius="30%"
                      objectFit="cover"
                    />
                  </Td>
                  <Td>
                    <Text as="b">{org.organization_name}</Text>
                    <Text>{org.email}</Text>
                    <Text>{org.phone}</Text>
                  </Td>
                  <Td>{org.events.length}</Td>
                  <Td>
                    <Center>
                      {org.status === 0 ? (
                        <Box
                          as="button"
                          borderRadius="md"
                          bg={tersierColor}
                          color="white"
                          px={4}
                          h={8}
                        >
                          <Text>Pending</Text>
                        </Box>
                      ) : org.status === 1 ? (
                        <Box
                          as="button"
                          borderRadius="md"
                          bg='red'
                          color="white"
                          px={4}
                          h={8}
                        >
                          <Text>Banned</Text>
                        </Box>
                      ) : org.status === 2 ? (
                        <Box
                          as="button"
                          borderRadius="md"
                          bg={primaryColor}
                          color="white"
                          px={4}
                          h={8}
                        >
                          <Text>Approved</Text>
                        </Box>
                      ) : null}
                    </Center>
                  </Td>
                  <Td>
                    <Center>
                      <Button
                        mx={2}
                        onClick={() =>
                          router.push(`/admin/organization/${org.id_organization}`)
                        }
                      >
                        Detail
                      </Button>
                    </Center>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
        {noData()}
      </TableContainer>
    </>
  );
}
