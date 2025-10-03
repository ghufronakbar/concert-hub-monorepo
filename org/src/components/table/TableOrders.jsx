import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
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
  useToast,
  Tooltip, // Import Tooltip
} from "@chakra-ui/react";
import { FiCheckCircle } from "react-icons/fi";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { BsCheck2All, BsXCircle } from "react-icons/bs";
import axiosInstanceAuthorization from "../../lib/axiosInstanceAuthorization";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Loading } from "../Loading";
import { primaryColor, secondaryColor, tersierColor, white } from "@/lib/color";
import {
  CheckCircleIcon,
  CheckIcon,
  CloseIcon,
  NotAllowedIcon,
  TimeIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function TableOrders() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const queryPaid = searchParams.get("paid");
  const [idHistory, setIdHistory] = useState();
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const {
    data: dataHistory,
    isLoading,
    isError,
    refetch: refetchDataEvent,
  } = useQuery({
    queryKey: ["histories", queryPaid],
    queryFn: async () => {
      const endpoint =
        queryPaid == null ? "/histories" : `/histories?paid=${queryPaid}`;
      const dataResponse = await axiosInstanceAuthorization.get(endpoint);
      return dataResponse.data;
    },
  });

  const noData = () => {
    if (dataHistory && dataHistory.length === 0) {
      return (
        <Alert status="warning">
          <AlertIcon />
          There&apos;s no data event
        </Alert>
      );
    }
  };

  const handleReject = async (id_history) => {
    try {
      await axiosInstanceAuthorization.put(
        `/order/anomaly-transaction/${id_history}`
      );
      toast({
        title: "Order has been marked as anomaly transaction",
        status: "info",
        position: "bottom-right",
        isClosable: true,
      });
      refetchDataEvent();
      setIsRejectOpen(false);
    } catch (error) {
      console.error("Error marking order as anomaly transaction:", error);
      toast({
        title:
          error.response?.data?.message ||
          "Error marking order as anomaly transaction",
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };

  const handleConfirm = async (id_history) => {
    try {
      console.log({ id_history });
      await axiosInstanceAuthorization.put(`/order/confirm/${id_history}`);
      toast({
        title: "Order has been confirmed",
        status: "success",
        position: "bottom-right",
        isClosable: true,
      });
      refetchDataEvent();
      setIsConfirmOpen(false);
    } catch (error) {
      console.error("Error confirming order:", error);
      toast({
        title: error.response?.data?.message || "Error confirming order",
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };

  const modalRejectOrder = () => {
    return (
      <Modal isOpen={isRejectOpen} onClose={() => setIsRejectOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Are you sure want to mark this order as anomaly transaction?
          </ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() => {
                handleReject(idHistory);
              }}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const modalConfirmOrder = () => {
    return (
      <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure want to confirm this order?</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button
              color={white}
              bg={primaryColor}
              onClick={() => {
                handleConfirm(idHistory);
              }}
            >
              Confirm{" "}
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

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>Name</Th>
              <Th>Event & Ticket</Th>
              <Th>Subtotal</Th>
              <Th>Total</Th>
              <Th>
                <Center>Paid</Center>
              </Th>
              <Th>
                <Center>Used</Center>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {dataHistory &&
              dataHistory.map((event, index) => (
                <Tr key={event.id_event}>
                  <Td>{index + 1}</Td>
                  <Td>
                    <Text as="b">{event.fullname}</Text>
                    <Text>{event.email}</Text>
                  </Td>
                  <Td>
                    <Text as="b">{event.event_name}</Text>
                    <Text>{event.type_ticket}</Text>
                  </Td>
                  <Td>
                    <Text>
                      Rp {event.price} *{event.amount}
                    </Text>
                  </Td>
                  <Td>
                    <Text>Rp {event.total}</Text>
                  </Td>
                  <Td>
                    <Center>
                      {event.paid === 0 ? (
                        <Tooltip label="Pending">
                          <TimeIcon color={tersierColor} />
                        </Tooltip>
                      ) : event.paid === 1 ? (
                        <Tooltip label="Cancelled By User">
                          <CloseIcon color={secondaryColor} />
                        </Tooltip>
                      ) : event.paid === 2 ? (
                        <Tooltip label="Mark as Anomaly Transaction">
                          <WarningTwoIcon color="red" />
                        </Tooltip>
                      ) : event.paid === 3 ? (
                        <Tooltip label="Paid">
                          <CheckIcon color={primaryColor} />
                        </Tooltip>
                      ) : event.paid === 4 ? (
                        <Tooltip label="Confirmed">
                          <CheckCircleIcon color={primaryColor} />
                        </Tooltip>
                      ) : event.paid === 5 ? (
                        <Tooltip label="Expired Time">
                          <NotAllowedIcon color="red" />
                        </Tooltip>
                      ) : null}
                    </Center>
                  </Td>
                  <Td>
                    <Center>
                      {event.used == 1 ? (
                        <BsCheck2All />
                      ) : event.used == 0 ? (
                        <BsXCircle />
                      ) : null}
                    </Center>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
        {noData()}
      </TableContainer>
      {modalRejectOrder()}
      {modalConfirmOrder()}
    </>
  );
}
