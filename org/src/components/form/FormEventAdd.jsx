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
  AlertIcon,
  Alert,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { Loading } from "../Loading";
import axiosInstanceAuthorization from "@/lib/axiosInstanceAuthorization";
import { primaryColor, secondaryColor, tersierColor, white } from "@/lib/color";

export function FormEventAdd() {
  const router = useRouter();
  const { id: id_event } = router.query;
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState(null);
  const [location, setLocation] = useState({
    locationName: "",
    street: "",
    subDistrict: "",
    cityDistrict: "",
    province: "",
  });
  const eventImageRef = useRef();
  const sitePlanImageRef = useRef();
  const [selectedEventImage, setSelectedEventImage] = useState(null);
  const [selectedSitePlanImage, setSelectedSitePlanImage] = useState(null);

  const handleEventImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedEventImage(URL.createObjectURL(file));
  };

  const handleSitePlanImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedSitePlanImage(URL.createObjectURL(file));
  };

  const handleAdd = async () => {
    try {
      if (
        !event.event_name ||
        !event.description ||
        !location.locationName ||
        !location.street ||
        !location.subDistrict ||
        !location.cityDistrict ||
        !location.province ||
        !event.event_type ||
        !event.event_start ||
        !event.event_end ||
        !eventImageRef
      ) {
        toast({
          title: "Complete form to update event",
          status: "warning",
          position: "bottom-right",
          isClosable: true,
        });
        return;
      }

      const now = new Date();
      if (new Date(event.event_start) < now) {
        toast({
          title: "Event start must be in the future",
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
        return;
      }

      if (new Date(event.event_start) > new Date(event.event_end)) {
        toast({
          title: "Event end must not be earlier than event start",
          status: "error",
          position: "bottom-right",
          isClosable: true,
        });
        return;
      }

      const formData = new FormData();
      formData.append("event_name", event.event_name);
      formData.append("description", event.description);
      formData.append(
        "location",
        `${location.locationName}, ${location.street}, ${location.subDistrict}, ${location.cityDistrict}, ${location.province}`
      );
      formData.append("type", event.event_type);
      formData.append("event_start", event.event_start);
      formData.append("event_end", event.event_end);

      if (eventImageRef.current.files.length > 0) {
        formData.append("event_image", eventImageRef.current.files[0]);
      }

      if (sitePlanImageRef.current.files.length > 0) {
        formData.append("site_plan_image", sitePlanImageRef.current.files[0]);
      }

      await axiosInstanceAuthorization.post(`/event/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Event has been added",
        status: "success",
        position: "bottom-right",
        isClosable: true,
      });

      router.push(`/admin/event`);
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        title: "Error adding event",
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };

  if (loading) return <Loading />;



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

  return (
    <>
      <form>
        <Box p={8} borderWidth="1px" borderRadius="lg" overflow="hidden" mt={4}>
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
                  <Alert status="warning">
                    <AlertIcon />
                    Must add event image
                  </Alert>
                )}
              </Center>
              <Input
                mt={4}
                type="file"
                name="event_image"
                ref={eventImageRef}
                onChange={handleEventImageChange}                
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
                  <Alert status="warning">
                    <AlertIcon />
                    No file choosen
                  </Alert>
                )}
              </Center>
              <Input
                mt={4}
                type="file"
                name="site_plan_image"
                ref={sitePlanImageRef}
                onChange={handleSitePlanImageChange}                
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
                    onChange={(e) =>
                      setEvent({ ...event, event_name: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    onChange={(e) =>
                      setEvent({ ...event, description: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Location Name</FormLabel>
                  <Input
                    name="locationName"
                    onChange={(e) =>
                      setLocation({ ...location, locationName: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl>
                  <Flex>
                    <Box flex="1" mr={2}>
                      <FormLabel>Street</FormLabel>
                      <Input
                        name="street"
                        onChange={(e) =>
                          setLocation({ ...location, street: e.target.value })
                        }
                      />
                    </Box>
                    <Box flex="1" ml={2}>
                      <FormLabel>Sub District</FormLabel>
                      <Input
                        name="subDistrict"
                        onChange={(e) =>
                          setLocation({
                            ...location,
                            subDistrict: e.target.value,
                          })
                        }
                      />
                    </Box>
                  </Flex>
                </FormControl>

                <FormControl>
                  <Flex>
                    <Box flex="1" mr={2}>
                      <FormLabel>City / District</FormLabel>
                      <Input
                        name="cityDistrict"
                        onChange={(e) =>
                          setLocation({
                            ...location,
                            cityDistrict: e.target.value,
                          })
                        }
                      />
                    </Box>
                    <Box flex="1" ml={2}>
                      <FormLabel>Province</FormLabel>
                      <Input
                        name="province"
                        onChange={(e) =>
                          setLocation({ ...location, province: e.target.value })
                        }
                      />
                    </Box>
                  </Flex>
                </FormControl>

                <FormControl>
                  <FormLabel>Event Type</FormLabel>
                  <Input
                    name="event_type"
                    onChange={(e) =>
                      setEvent({ ...event, event_type: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Event Start</FormLabel>
                  <Input
                    type="datetime-local"
                    name="event_start"
                    onChange={(e) =>
                      setEvent({
                        ...event,
                        event_start: new Date(e.target.value).toISOString(),
                      })
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Event End</FormLabel>
                  <Input
                    type="datetime-local"
                    name="event_end"
                    onChange={(e) =>
                      setEvent({
                        ...event,
                        event_end: new Date(e.target.value).toISOString(),
                      })
                    }
                  />
                </FormControl>
              </Stack>
            </Box>
          </Flex>
          <VStack mt={4}>
            <Button
              bg={primaryColor}
              color={white}
              onClick={handleAdd}              
            >
              Add Event
            </Button>
          </VStack>
        </Box>
      </form>
    </>
  );
}
