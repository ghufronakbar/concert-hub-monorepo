import {
  Box,
  Button,
  Center,
  FormControl,
  Image,
  Input,
  Spacer,
  Flex,
  FormLabel,
  Stack,
  VStack,
  Textarea,
  useToast,
  Tr,
  Table,
  Thead,
  Th,
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
  ModalBody,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "../Loading";
import axiosInstanceAuthorization from "@/lib/axiosInstanceAuthorization";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { primaryColor, white } from "@/lib/color";

export function FormEventEdit() {
  const router = useRouter();
  const { id: id_event } = router.query;
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const eventImageRef = useRef();
  const sitePlanImageRef = useRef();
  const [selectedEventImage, setSelectedEventImage] = useState(null);
  const [selectedSitePlanImage, setSelectedSitePlanImage] = useState(null);
  const [isAddTicketOpen, setIsAddTicketOpen] = useState(false);
  const [type, setType] = useState();
  const [amount, setAmount] = useState();
  const [sold, setSold] = useState();
  const [price, setPrice] = useState();
  const [date_start, setDate_start] = useState();
  const [date_end, setDate_end] = useState();
  const [idTicket, setIdTicket] = useState();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSetAmountOpen, setIsSetAmountOpen] = useState(false);

  // Fungsi untuk menangani perubahan pada input file gambar event
  const handleEventImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedEventImage(URL.createObjectURL(file));
  };

  // Fungsi untuk menangani perubahan pada input file gambar site plan
  const handleSitePlanImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedSitePlanImage(URL.createObjectURL(file));
  };

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

  const modalConfirmDelete = () => {
    return (
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure want to delete this ticket?</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() => {
                handleDelete(idTicket);
              }}
            >
              Finish
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const modalSetAmount = () => {
    return (
      <Modal isOpen={isSetAmountOpen} onClose={() => setIsSetAmountOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Set ticket amount</ModalHeader>
          <ModalBody>
            <Alert my={2} status="info">
              <AlertIcon />
              Amount tickets can&quot;t be less than sold tickets
            </Alert>
            <NumberInput value={amount} min={sold}>
              <NumberInputField onChange={(e) => setAmount(e.target.value)} />
              <NumberInputStepper>
                <NumberIncrementStepper
                  onClick={() => {
                    setAmount(amount + 1);
                  }}
                />
                <NumberDecrementStepper
                  onClick={() => {
                    setAmount(amount - 1);
                  }}
                />
              </NumberInputStepper>
            </NumberInput>
          </ModalBody>
          <ModalCloseButton />
          <ModalFooter>
            <Button
              bg={primaryColor}
              color={white}
              onClick={() => {
                handleSetAmount(idTicket);
              }}
            >
              Set Amount
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const handleSetAmount = async (id_ticket) => {
    if (amount < sold) {
      return toast({
        title: "Amount can't be less than sold tickets",
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
    await axiosInstanceAuthorization.put(`/ticket/set-amount/${id_ticket}`, {
      amount,
    });
    toast({
      title: "Amount has been edited",
      status: "info",
      position: "bottom-right",
      isClosable: true,
    });
    refetchDataEvent();
    setIsSetAmountOpen(false);
  };

  const handleDelete = async (id_ticket) => {
    await axiosInstanceAuthorization.delete(`/ticket/delete/${id_ticket}`);
    toast({
      title: "Ticket has been deleted",
      status: "info",
      position: "bottom-right",
      isClosable: true,
    });
    refetchDataEvent();
    setIsDeleteOpen(false);
  };

  const modalAddTicket = () => {
    return (
      <Modal isOpen={isAddTicketOpen} onClose={() => setIsAddTicketOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add ticket to this event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Type</FormLabel>
              <Input
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Price</FormLabel>
              <Input
                name="price"
                value={price}
                type="number"
                onChange={(e) => setPrice(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Date Start</FormLabel>
              <Input
                type="datetime-local"
                name="date_start"
                value={date_start}
                onChange={(e) => setDate_start(e.target.value)}
                disabled={isDisabled}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Date Start</FormLabel>
              <Input
                type="datetime-local"
                name="date_start"
                value={date_end}
                onChange={(e) => setDate_end(e.target.value)}
                disabled={isDisabled}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              bg={primaryColor}
              color={white}
              onClick={() => {
                handleAddTicket();
              }}
            >
              Add Ticket
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const handleAddTicket = async () => {
    try {
      if (!type || !price || !date_start || !date_end) {
        toast({
          title: "Complete form to update event",
          status: "warning",
          position: "bottom-right",
          isClosable: true,
        });
        return;
      } else if (date_start > date_end) {
        return toast({
          title: "Date end must not be earlier than date start",
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
      } else if (
        date_start < event.event_start ||
        date_end < event.event_start
      ) {
        return toast({
          title: "Date must not be earlier than event start",
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
      } else if (date_start > event.event_end || date_end > event.event_end) {
        return toast({
          title: "Date must not be sooner than event end",
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
      }
      await axiosInstanceAuthorization.post(`/ticket/add`, {
        type: type,
        price: price,
        date_start: date_start,
        date_end: date_end,
        id_event: id_event,
      });
      toast({
        title: "Ticket has been added",
        status: "success",
        position: "bottom-right",
        isClosable: true,
      });

      refetchDataEvent();
      setIsAddTicketOpen(false);
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Error updating event",
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };

  const handleUpdate = async () => {
    try {
      if (
        !event.event_name ||
        !event.description ||
        !event.location ||
        !event.event_type ||
        !event.event_start ||
        !event.event_end
      ) {
        toast({
          title: "Complete form to update event",
          status: "warning",
          position: "bottom-right",
          isClosable: true,
        });
        return;
      }

      const formData = new FormData();
      formData.append("event_name", event.event_name);
      formData.append("description", event.description);
      formData.append("location", event.location);
      formData.append("type", event.event_type);
      formData.append("event_start", event.event_start);
      formData.append("event_end", event.event_end);

      if (eventImageRef.current.files.length > 0) {
        formData.append("event_image", eventImageRef.current.files[0]);
      }

      if (sitePlanImageRef.current.files.length > 0) {
        formData.append("site_plan_image", sitePlanImageRef.current.files[0]);
      }

      if (event.event_start > event.event_end) {
        return toast({
          title: "Event end must not be earlier than event start",
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
      }

      await axiosInstanceAuthorization.put(
        `/event/edit/${id_event}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast({
        title: "Event has been updated",
        status: "success",
        position: "bottom-right",
        isClosable: true,
      });

      router.push(`/admin/event`);
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Error updating event",
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };

  const handleEditTicket = (id_ticket) => {
    router.push(`/admin/event/ticket/${id_ticket}`);
  };

  if (loading) return <Loading />;

  const isDisabled =
    event?.event_status === "Past" || event?.event_status === "On Going";

  const nonEditable = () => {
    if (event?.event_status === "Past" || event?.event_status === "On Going") {
      return (
        <Alert status="warning">
          <AlertIcon />
          Events that are already running cannot be edited
        </Alert>
      );
    }
  };

  const alertMessage = () => {
    return (
      <Alert my={2} status="info">
        <AlertIcon />
        Ticket that are already on sale cannot be deleted
      </Alert>
    );
  };

  return (
    <>
      {event && (
        <>
          <form>
            <Box
              p={8}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              mt={4}
            >
              {nonEditable()}
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
                    {selectedEventImage ? (
                      <Image
                        borderRadius="18"
                        boxSize="400"
                        objectFit="cover"
                        src={selectedEventImage}
                        alt=""
                      />
                    ) : (
                      <Image
                        borderRadius="18"
                        boxSize="400"
                        objectFit="cover"
                        src={event.event_image}
                        alt={event.event_name}
                      />
                    )}
                  </Center>
                  <Input
                    mt={4}
                    type="file"
                    name="event_image"
                    ref={eventImageRef}
                    onChange={handleEventImageChange}
                    disabled={isDisabled}
                  />
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
                    {selectedSitePlanImage ? (
                      <Image
                        borderRadius="18"
                        boxSize="400"
                        objectFit="cover"
                        src={selectedSitePlanImage}
                        alt=""
                      />
                    ) : (
                      event.site_plan_image && (
                        <Image
                          borderRadius="18"
                          boxSize="400"
                          objectFit="cover"
                          src={event.site_plan_image}
                          alt="Site Plan"
                        />
                      )
                    )}
                  </Center>
                  <Input
                    mt={4}
                    type="file"
                    name="site_plan_image"
                    ref={sitePlanImageRef}
                    onChange={handleSitePlanImageChange}
                    disabled={isDisabled}
                  />
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
                    <FormControl>
                      <FormLabel>Event Name</FormLabel>
                      <Input
                        name="event_name"
                        value={event.event_name}
                        onChange={(e) =>
                          setEvent({ ...event, event_name: e.target.value })
                        }
                        disabled={isDisabled}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        name="description"
                        value={event.description}
                        onChange={(e) =>
                          setEvent({ ...event, description: e.target.value })
                        }
                        disabled={isDisabled}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Location</FormLabel>
                      <Input
                        name="location"
                        value={event.location}
                        onChange={(e) =>
                          setEvent({ ...event, location: e.target.value })
                        }
                        disabled={isDisabled}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Event Type</FormLabel>
                      <Input
                        name="event_type"
                        value={event.event_type}
                        onChange={(e) =>
                          setEvent({ ...event, event_type: e.target.value })
                        }
                        disabled={isDisabled}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Event Start</FormLabel>
                      <Input
                        type="datetime-local"
                        name="event_start"
                        value={new Date(event.event_start)
                          .toISOString()
                          .slice(0, 16)}
                        onChange={(e) =>
                          setEvent({
                            ...event,
                            event_start: new Date(e.target.value).toISOString(),
                          })
                        }
                        disabled={isDisabled}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Event End</FormLabel>
                      <Input
                        type="datetime-local"
                        name="event_end"
                        value={new Date(event.event_end)
                          .toISOString()
                          .slice(0, 16)}
                        onChange={(e) =>
                          setEvent({
                            ...event,
                            event_end: new Date(e.target.value).toISOString(),
                          })
                        }
                        disabled={isDisabled}
                      />
                    </FormControl>
                  </Stack>
                </Box>
              </Flex>
              <VStack mt={4}>
                {event.event_status == "Past" ||
                event.event_status == "On Going" ? (
                  ""
                ) : (
                  <Button
                    onClick={handleUpdate}
                    bg={primaryColor}
                    color={white}
                  >
                    Update
                  </Button>
                )}
              </VStack>
            </Box>
          </form>
          {alertMessage()}
          <Flex>
            <FormLabel mt={4}>List Ticket</FormLabel>
            <Spacer />
            {event.event_status == "Past" ||
            event.event_status == "On Going" ? (
              ""
            ) : (
              <Button
                mt={4}
                onClick={() => {
                  setIsAddTicketOpen(true);
                }}
                bg={primaryColor}
                color={white}
              >
                Add Ticket
              </Button>
            )}
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
                <Th colSpan={2}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {event.tickets.map((ticket) => (
                <Tr key={ticket.id_ticket}>
                  <Td>{ticket.ticket_type}</Td>
                  <Td>
                    {ticket.amount}{" "}
                    <EditIcon
                      onClick={() => {
                        setIsSetAmountOpen(true);
                        setIdTicket(ticket.id_ticket);
                        setAmount(ticket.amount);
                        setSold(ticket.sold);
                      }}
                    />
                  </Td>
                  <Td>{ticket.sold}</Td>
                  <Td>Rp {ticket.price}</Td>
                  <Td>{new Date(ticket.date_start).toLocaleString()}</Td>
                  <Td>{new Date(ticket.date_end).toLocaleString()}</Td>
                  <Td colSpan={2}>
                    {new Date() < new Date(ticket.date_start) ? (
                      <>
                        <Box
                          bg={primaryColor}
                          as="button"
                          p={2}
                          borderRadius={8}
                          m={2}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          onClick={() => handleEditTicket(ticket.id_ticket)}
                        >
                          <EditIcon color="white" />
                        </Box>
                        <Box
                          bg="red"
                          as="button"
                          p={2}
                          borderRadius={8}
                          m={2}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          onClick={() => {
                            setIdTicket(ticket.id_ticket);
                            setIsDeleteOpen(true);
                          }}
                        >
                          <DeleteIcon color="white" />
                        </Box>
                      </>
                    ) : event.event_status == "Past" ||
                      event.event_status == "On Going" ? (
                      ""
                    ) : event.event_status == "Soon" ? (
                      <>
                        <Box
                          bg={primaryColor}
                          as="button"
                          p={2}
                          borderRadius={8}
                          m={2}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          onClick={() => handleEditTicket(ticket.id_ticket)}
                        >
                          <EditIcon color="white" />
                        </Box>
                      </>
                    ) : (
                      ""
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {modalAddTicket()}
          {modalSetAmount()}
          {modalConfirmDelete()}
        </>
      )}
    </>
  );
}
