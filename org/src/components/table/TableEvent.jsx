import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  CloseButton,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axiosInstanceAuthorization from "../../lib/axiosInstanceAuthorization";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Loading } from "../Loading";
import { primaryColor, secondaryColor, tersierColor } from "@/lib/color";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useSearchParams } from "next/navigation";
import formatDate from "@/lib/formatDate";
import { useState } from "react";
import Link from "next/link";

export function TableEvent() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const queryTime = searchParams.get("time");
  const queryStatus = searchParams.get("status");
  const [idEvent, setIdEvent] = useState();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const {
    isOpen: isVisible,
    onClose,
    onOpen,
  } = useDisclosure({
    defaultIsOpen: true,
  });

  const {
    data: dataEvent,
    isLoading,
    isError,
    refetch: refetchDataEvent,
  } = useQuery({
    queryKey: ["events", queryTime, queryStatus],
    queryFn: async () => {
      const endpoint =
        queryTime == "" && queryStatus == ""
          ? "/events"
          : `/events?time=${queryTime}&status=${queryStatus}`;
      const dataResponse = await axiosInstanceAuthorization.get(endpoint);
      return dataResponse.data;
    },
  });

  const noData = () => {
    if (dataEvent && dataEvent.length === 0) {
      return (
        <Alert status="warning">
          <AlertIcon />
          There&apos;s no data event
        </Alert>
      );
    }
  };

  const handleDelete = async (id_event) => {
    await axiosInstanceAuthorization.delete(`/event/delete/${id_event}`);
    toast({
      title: "Event has been deleted",
      status: "info",
      position: "bottom-right",
      isClosable: true,
    });
    refetchDataEvent();
    setIsDeleteOpen(false);
  };

  const alertMessage = () => {
    return isVisible ? (
      <Alert my={4} status="info">
        <AlertIcon />
        <Box flex="1">
          <AlertTitle>Message!</AlertTitle>
          <AlertDescription>
            You cannot delete an event that has been approved!
          </AlertDescription>
        </Box>
        <CloseButton
          alignSelf="flex-start"
          position="absolute"
          right={2}
          top={2}
          onClick={onClose}
        />
      </Alert>
    ) : null;
  };

  const modalConfirmDelete = () => {
    return (
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure want to delete this event?</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() => {
                handleDelete(idEvent);
              }}
            >
              Finish
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  if (isLoading) return <Loading />;
  if (isError) return <Text>Error loading data</Text>;

  return (
    <>
      <TableContainer>
        <Button
          bg={primaryColor}
          color="white"
          mb={2}
          onClick={() => {
            router.push(`/admin/event/add`);
          }}
        >
          Add Event
        </Button>

        {alertMessage()}

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th></Th>
              <Th>Event Name</Th>
              <Th>Location</Th>
              <Th>
                <Text>Event Start</Text>
                <Text>Event End</Text>
              </Th>
              <Th>
                <Center>Status</Center>
              </Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {dataEvent &&
              dataEvent.map((event, index) => (
                <Tr key={event.id_event}>
                  <Td>{index + 1}</Td>
                  <Td>
                    <Image
                      src={event.event_image}
                      alt={event.event_name}
                      boxSize="50px"
                      borderRadius="30%"
                      objectFit="cover"
                      style={{
                        flexShrink: 0,
                        width: "50px",
                        height: "50px",
                        minWidth: "50px",
                        minHeight: "50px",
                      }}
                    />
                  </Td>
                  <Td>{event.event_name}</Td>
                  <Td>
                    <div
                      style={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {event.location}
                      <Link href={event.url_google_map} target="_blank">
                        <ExternalLinkIcon />
                      </Link>
                    </div>
                  </Td>
                  <Td>
                    <Text>{formatDate(event.event_start)}</Text>
                    <Text>{formatDate(event.event_end)}</Text>
                  </Td>
                  <Td>
                    <Center>
                      {event.status === 0 ? (
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
                      ) : event.status === 1 ? (
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
                      ) : event.status === 2 ? (
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
                      {event.status === 0 ? (
                        <>
                          <Button
                            bg="red"
                            color="white"
                            mx={2}
                            onClick={() => {
                              setIdEvent(event.id_event);
                              setIsDeleteOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                          <Button
                            mx={2}
                            onClick={() =>
                              router.push(`/admin/event/${event.id_event}`)
                            }
                          >
                            Detail
                          </Button>
                        </>
                      ) : event.status === 1 ? (
                        <>
                          <Button
                            bg="red"
                            color="white"
                            mx={2}
                            onClick={() => {
                              setIdEvent(event.id_event);
                              setIsDeleteOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        </>
                      ) : event.status === 2 ? (
                        <>
                          <Button
                            onClick={() =>
                              router.push(`/admin/event/${event.id_event}`)
                            }
                          >
                            Detail
                          </Button>
                        </>
                      ) : null}
                    </Center>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
        {noData()}
      </TableContainer>
      {modalConfirmDelete()}
    </>
  );
}
