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
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "@/components/Loading";
import axiosInstanceAuthorization from "@/lib/axiosInstanceAuthorization";
import { primaryColor, white } from "@/lib/color";
import { formatDate, formatTime } from "@/lib/formatDate";

export function DetailEvent() {
  const router = useRouter();
  const { id: id_event } = router.query;
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const { data: dataEvent, refetch: refetchDataEvent } = useQuery({
    queryKey: ["event", id_event],
    queryFn: async () => {
      const dataResponse = await axiosInstanceAuthorization.get(
        `/event/${id_event}`
      );
      setEvent(dataResponse.data[0]);
      setLoading(false);
      return dataResponse.data;
    },
  });

  const handleApprove = async () => {
    try {
      await axiosInstanceAuthorization.put(`/event/approve/${id_event}`, {
        id_event,
      });

      toast({
        title: "Event has been approved",
        status: "success",
        position: "bottom-right",
        isClosable: true,
      });

      router.push(`/admin/event`);
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Error approving event",
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };

  const handleReject = async () => {
    try {
      await axiosInstanceAuthorization.put(`/event/reject/${id_event}`, {
        id_event,
      });

      toast({
        title: "Event has been rejected",
        status: "info",
        position: "bottom-right",
        isClosable: true,
      });

      router.push(`/admin/event`);
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Error rejecting event",
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };

  const ModalConfirmApprove = () => {
    return (
      <Modal isOpen={isApproveOpen} onClose={() => setIsApproveOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Are you sure you want to approve this event?
          </ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button color="white" bg={primaryColor} onClick={handleApprove}>
              Approve
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
          <ModalHeader>Are you sure you want to reject this event?</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button colorScheme="red" onClick={handleReject}>
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
        Once you approve or reject, this action cannot be undone.
      </Alert>
    );
  };

  return (
    <>
      {event && (
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
                    src={event.event_image}
                    alt={event.event_name}
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
                <Center>
                  {event.site_plan_image ? (
                    <Image
                      borderRadius="18"
                      boxSize="400"
                      objectFit="cover"
                      src={event.site_plan_image}
                      alt=""
                    />
                  ) : (
                    <Alert>
                      <AlertIcon />
                      Site plan image has not been uploaded yet.
                    </Alert>
                  )}
                </Center>
              </Box>
            </Flex>
            <Flex mt={4}>
              <Box
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
                      <Th>Event Name:</Th>
                      <Td>{event.event_name}</Td>
                    </Tr>
                    <Tr>
                      <Th>Description:</Th>
                      <Td>{event.description}</Td>
                    </Tr>
                    <Tr>
                      <Th>Location:</Th>
                      <Td>{event.location}</Td>
                    </Tr>
                    <Tr>
                      <Th>Event Type:</Th>
                      <Td>{event.event_type}</Td>
                    </Tr>
                    <Tr>
                      <Th>Event Start:</Th>
                      <Td>{new Date(event.event_start).toLocaleString()}</Td>
                    </Tr>
                    <Tr>
                      <Th>Event End:</Th>
                      <Td>{new Date(event.event_end).toLocaleString()}</Td>
                    </Tr>
                  </Tbody>
                </Table>
                </Stack>
              </Box>
            </Flex>
            {event.status == 0 ? <AlertMessage mt={4} /> : null}

            <Center>
              <HStack mt={4}>
                {event.status == 0 ? (
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
            <Flex>
              <Text fontWeight="bold" mb={4}>
                List of Tickets
              </Text>
              <Spacer />
            </Flex>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Type</Th>
                  <Th>Amount</Th>
                  <Th>Sold</Th>
                  <Th>Price</Th>
                  <Th>Date Start</Th>
                  <Th>Date End</Th>
                </Tr>
              </Thead>
              <Tbody>
                {event.tickets.map((ticket) => (
                  <Tr key={ticket.id_ticket}>
                    <Td>{ticket.ticket_type}</Td>
                    <Td>{ticket.amount}</Td>
                    <Td>{ticket.sold}</Td>
                    <Td>Rp {ticket.price}</Td>
                    <Td>{new Date(ticket.date_start).toLocaleString()}</Td>
                    <Td>{new Date(ticket.date_end).toLocaleString()}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          <ModalConfirmReject />
          <ModalConfirmApprove />
        </>
      )}
    </>
  );
}
