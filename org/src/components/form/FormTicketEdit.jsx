import {
  Box,
  Button,
  FormControl,
  Input,
  Flex,
  FormLabel,
  Stack,
  VStack,
  useToast,
  Table,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "../Loading";
import axiosInstanceAuthorization from "@/lib/axiosInstanceAuthorization";
import { primaryColor, white } from "@/lib/color";
import formatDate from "@/lib/formatDate";

export function FormTicketEdit() {
  const router = useRouter();
  const { id: id_ticket } = router.query;
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState(null);  

  const { data: dataTicket, refetch: refetchDataTicket } = useQuery({
    queryKey: ["ticket", id_ticket],
    queryFn: async () => {
      const dataResponse = await axiosInstanceAuthorization.get(
        `/ticket/${id_ticket}`
      );
      setTicket(dataResponse.data[0]);
      setLoading(false);
      return dataResponse.data;
    },
  });

  const handleUpdate = async () => {
    try {
      const payload = {
        type: ticket.ticket_type,
        price: ticket.price,
        date_start: ticket.date_start,
        date_end: ticket.date_end,
      };      


      if (ticket.date_start > ticket.date_end) {
        return toast({
          title: "Date end must not be earlier than date start",
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
      } else if (
        ticket.date_start < ticket.event_start ||
        ticket.date_end < ticket.event_start
      ) {
        return toast({
          title: "Date must not be earlier than event start",
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
      } else if (
        ticket.date_start > ticket.event_end ||
        ticket.date_end > ticket.event_end
      ) {
        return toast({
          title: "Date must not be sooner than event start",
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
      }

      await axiosInstanceAuthorization.put(
        `/ticket/edit/${id_ticket}`,
        payload
      );

      toast({
        title: "Ticket has been updated",
        status: "success",
        position: "bottom-right",
        isClosable: true,
      });

      router.push(`/admin/event/${ticket && ticket.id_event}`);
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast({
        title: "Error updating ticket",
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };
 

  const isDisabled = new Date() > new Date(ticket && ticket.date_start);

  if (loading) return <Loading />;

  return (
    <>
      {ticket && (
        <>
          <form>
            <Box
              p={8}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              mt={4}
            >
              <Flex mt={4}>
                <Box
                  p={8}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  flex={18}
                >
                  <Table mb={6}>
                    <Tr>
                      <Th>{ticket.event_name}</Th>
                    </Tr>
                    <Tr>
                      <Td>{formatDate(ticket.event_start)}</Td>
                      <Td>-</Td>
                      <Td isNumeric>{formatDate(ticket.event_end)}</Td>
                    </Tr>
                  </Table>
                  <Stack spacing={4}>
                    <FormControl>
                      <FormLabel>Type</FormLabel>
                      <Input
                        name="type"
                        value={ticket.ticket_type}
                        onChange={(e) =>
                          setTicket({ ...ticket, ticket_type: e.target.value })
                        }
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Price</FormLabel>
                      <Input
                        name="price"
                        value={ticket.price}
                        onChange={(e) =>
                          setTicket({ ...ticket, price: e.target.value })
                        }
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Date Start</FormLabel>
                      <Input
                        type="datetime-local"
                        name="date_start"
                        value={new Date(ticket.date_start)
                          .toISOString()
                          .slice(0, 16)}
                        onChange={(e) =>
                          setTicket({
                            ...ticket,
                            date_start: new Date(e.target.value).toISOString(),
                          })
                        }
                        disabled={isDisabled}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Date End</FormLabel>
                      <Input
                        type="datetime-local"
                        name="date_end"
                        value={new Date(ticket.date_end)
                          .toISOString()
                          .slice(0, 16)}
                        onChange={(e) =>
                          setTicket({
                            ...ticket,
                            date_end: new Date(e.target.value).toISOString(),
                          })
                        }
                      />
                    </FormControl>
                  </Stack>
                </Box>
              </Flex>
              <VStack mt={4}>
                <Button onClick={handleUpdate} color={white} bg={primaryColor}>
                  Update
                </Button>
              </VStack>
            </Box>
          </form>
        </>
      )}
    </>
  );
}
