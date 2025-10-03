import {
  Box,
  Button,
  Center,
  Image,
  Spacer,
  Flex,
  Stack,
  Text,
  useToast,
  Table,
  Thead,
  Th,
  Tr,
  Tbody,
  Td,
  AlertIcon,
  Alert,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  HStack,
  ModalBody,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "@/components/Loading";
import axiosInstanceAuthorization from "@/lib/axiosInstanceAuthorization";
import { primaryColor, secondaryColor, tersierColor, white } from "@/lib/color";
import { formatDate } from "@/lib/formatDate";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export function DetailOrganization() {
  const router = useRouter();
  const { id: id_organization } = router.query;
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [org, setOrg] = useState(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isBannedOpen, setIsBannedOpen] = useState(false);
  const [isKTPOpen, setIsKTPOpen] = useState(false);
  const [isLLOpen, setIsLLOpen] = useState(false);

  const { data: dataOrg, refetch: refetchDataOrg } = useQuery({
    queryKey: ["organization", id_organization],
    queryFn: async () => {
      const dataResponse = await axiosInstanceAuthorization.get(
        `/organization/${id_organization}`
      );
      setOrg(dataResponse.data[0]);
      setLoading(false);
      return dataResponse.data;
    },
  });

  const handleApprove = async () => {
    try {
      await axiosInstanceAuthorization.put(
        `/organization/approve/${id_organization}`
      );

      toast({
        title: "Organization has been approved",
        status: "success",
        position: "bottom-right",
        isClosable: true,
      });

      router.push(`/admin/organization`);
    } catch (error) {
      console.error("Error approving organization:", error);
      toast({
        title: "Error approving organization",
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };

  const handleBan = async () => {
    try {
      await axiosInstanceAuthorization.put(
        `/organization/banned/${id_organization}`
      );

      toast({
        title: "Organization has been banned",
        status: "info",
        position: "bottom-right",
        isClosable: true,
      });

      router.push(`/admin/organization`);
    } catch (error) {
      console.error("Error banning organization:", error);
      toast({
        title: "Error banning organization",
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };

  const handleReject = async () => {
    try {
      await axiosInstanceAuthorization.delete(
        `/organization/reject/${id_organization}`
      );

      toast({
        title: "Organization has been rejected",
        status: "info",
        position: "bottom-right",
        isClosable: true,
      });

      router.push(`/admin/organization`);
    } catch (error) {
      console.error("Error rejecting organization:", error);
      toast({
        title: "Error rejecting organization",
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };

  const ModalKTP = () => {
    return (
      <Modal isOpen={isKTPOpen} onClose={() => setIsKTPOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>KTP Attachment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <Image
                borderRadius="18"
                boxSize="400"
                objectFit="cover"
                src={org.ktp}
                alt={org.organization_name}
              />
            </Center>
          </ModalBody>
          <ModalFooter>
            <Button
              color="white"
              bg={tersierColor}
              onClick={() => {
                setIsKTPOpen(false);
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const ModalLL = () => {
    return (
      <Modal isOpen={isLLOpen} onClose={() => setIsLLOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>KTP Attachment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <Image
                borderRadius="18"
                boxSize="400"
                objectFit="cover"
                src={org.legality_letter}
                alt={org.organization_name}
              />
            </Center>
          </ModalBody>
          <ModalFooter>
            <Button
              color="white"
              bg={tersierColor}
              onClick={() => {
                setIsLLOpen(false);
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const ModalConfirmApprove = () => {
    return (
      <Modal isOpen={isApproveOpen} onClose={() => setIsApproveOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Are you sure you want to approve this organization?
          </ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button
              color="white"
              bg={primaryColor}
              onClick={() => {
                handleApprove();
              }}
            >
              Approve
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const ModalConfirmBan = () => {
    return (
      <Modal isOpen={isBannedOpen} onClose={() => setIsBannedOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Are you sure you want to ban this organization?
          </ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button
              color="white"
              bg="red"
              onClick={() => {
                handleBan();
              }}
            >
              Ban
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const ModalConfirmReject = () => {
    return (
      <Modal isOpen={isRejectOpen} onClose={() => setIsRejectOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Are you sure you want to reject this organization?
          </ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() => {
                handleReject();
              }}
            >
              Reject
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  if (loading) return <Loading />;

  const AlertMessage = ({ mt }) => {
    return (
      <Alert mt={mt} status="warning">
        <AlertIcon />
        Once you reject, this action cannot be undone.
      </Alert>
    );
  };

  const NoData = () => {
    return (
      <Alert status="warning">
        <AlertIcon />
        There&quot;s no event
      </Alert>
    );
  };

  return (
    <>
      {org && (
        <>
          <Box
            p={8}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            mt={4}
          >
            <Flex>
              <Box
                p={8}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                mt={4}
                flex={9}
              >
                <Center>
                  <Image
                    borderRadius="18"
                    boxSize="400"
                    objectFit="cover"
                    src={org.logo}
                    alt={org.organization_name}
                  />
                </Center>
                <Box
                  mt={6}
                  p={8}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  flex={18}
                >
                  <Stack spacing={4}>
                    <Table variant="simple">
                      <Tbody>
                        <Tr>
                          <Th>Organization Name:</Th>
                          <Td>{org.organization_name}</Td>
                        </Tr>
                        <Tr>
                          <Th>Email:</Th>
                          <Td>{org.email}</Td>
                        </Tr>
                        <Tr>
                          <Th>Phone:</Th>
                          <Td>{org.phone}</Td>
                        </Tr>
                        <Tr>
                          <Th>Status:</Th>
                          <Td>
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
                                bg="red"
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
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </Stack>
                </Box>
              </Box>
              <Spacer flex={1} />
              <Flex direction="column" flex={8}>
                <Box
                  p={8}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  mt={4}
                  flex={9}
                >
                  <Text as="b" mb={4}>
                    KTP
                  </Text>
                  <Center>
                    <Image
                      borderRadius="18"
                      boxSize="400"
                      objectFit="cover"
                      src={org.ktp}
                      alt={org.organization_name}
                      onClick={() => {
                        setIsKTPOpen(true);
                      }}
                    />
                  </Center>
                </Box>
                <Spacer flex={1} />
                <Box
                  p={8}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  mt={4}
                  flex={9}
                >
                  <Text as="b" mb={4}>
                    Legality Letter
                  </Text>
                  <Center>
                    <Image
                      borderRadius="18"
                      boxSize="400"
                      objectFit="cover"
                      src={org.legality_letter}
                      alt={org.organization_name}
                      onClick={() => {
                        setIsLLOpen(true);
                      }}
                    />
                  </Center>
                </Box>
              </Flex>
            </Flex>
            {org.status == 0 ? <AlertMessage mt={4} /> : null}
            <Center>
              <HStack mt={4}>
                {org.status == 0 ? (
                  <>
                    <Button
                      bg="red"
                      color={white}
                      onClick={() => {
                        setIsRejectOpen(true);
                      }}
                    >
                      Reject
                    </Button>
                    <Button
                      bg={primaryColor}
                      color={white}
                      onClick={() => {
                        setIsApproveOpen(true);
                      }}
                    >
                      Approve
                    </Button>
                  </>
                ) : org.status == 1 ? (
                  <Button
                    bg={primaryColor}
                    color={white}
                    onClick={() => {
                      setIsApproveOpen(true);
                    }}
                  >
                    Approve
                  </Button>
                ) : org.status == 2 ? (
                  <Button
                    bg="red"
                    color={white}
                    onClick={() => {
                      setIsBannedOpen(true);
                    }}
                  >
                    Banned
                  </Button>
                ) : null}
              </HStack>
            </Center>
          </Box>
          <Box
            p={8}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            mt={4}
          >
            <Flex align="center" justify="space-between" mb={4}>
              <Text fontWeight="bold">List of Events</Text>{" "}
              {org.events.length > 0 ? (
                <Text fontWeight="bold">Total : {org.events.length}</Text>
              ) : null}
            </Flex>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>No</Th>
                  <Th>Event</Th>
                  <Th>Location</Th>
                  <Th>Type</Th>
                  <Th>Status</Th>
                  <Th>
                    <Text>Date Start</Text>
                    <Text>Date End</Text>
                  </Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {org.events.map((event, index) => (
                  <Tr key={event.id_event}>
                    <Td>{index + 1}</Td>
                    <Td>{event.event_name}</Td>
                    <Td>
                      {event.location}
                      <a href={event.url_google_map} target="_blank">
                        <ExternalLinkIcon />
                      </a>
                    </Td>
                    <Td>{event.type}</Td>
                    <Td>
                      <Center>
                        {event.event_status === 0 ? (
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
                        ) : event.event_status === 1 ? (
                          <Box
                            as="button"
                            borderRadius="md"
                            bg={secondaryColor}
                            color="white"
                            px={4}
                            h={8}
                          >
                            <Text>Rejected</Text>
                          </Box>
                        ) : event.event_status === 2 ? (
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
                      <Text>{formatDate(event.event_start)}</Text>
                      <Text>{formatDate(event.event_end)}</Text>
                    </Td>
                    <Td>
                      {" "}
                      <Button
                        bg={tersierColor}
                        color={white}
                        onClick={() => {
                          router.push(`/admin/event/${event.id_event}`);
                        }}
                      >
                        Detail
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {org.events.length == 0 ? <>{NoData()}</> : null}
          </Box>

          <ModalConfirmReject />
          <ModalConfirmApprove />
          <ModalConfirmBan />
          <ModalKTP />
          <ModalLL />
        </>
      )}
    </>
  );
}
