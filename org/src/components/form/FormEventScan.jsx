import {
  Box,
  Button,
  FormControl,
  Input,
  Flex,
  Stack,
  VStack,
  useToast,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Loading } from "../Loading";
import axiosInstanceAuthorization from "@/lib/axiosInstanceAuthorization";
import { primaryColor, white } from "@/lib/color";
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";

export function FormEventScan() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [ucIdHistory, setUcIdHistory] = useState("");
  const [ucIdUser, setUcIdUser] = useState("");
  const [ucIdOrganization, setUcIdOrganization] = useState("");
  const [ucIdEvent, setUcIdEvent] = useState("");
  const [ucIdTicket, setUcIdTicket] = useState("");
  const [ucAmount, setUcAmount] = useState("");
  const [ucDate, setUcDate] = useState("");
  const [scannerResult, setScannerResult] = useState(null);
  const [scanner, setScanner] = useState(null);
  const unique_code = `${ucIdHistory}/${ucIdUser}/${ucIdOrganization}/${ucIdEvent}/${ucIdTicket}/${ucAmount}/${ucDate}`;

  // Define success and error functions outside of useEffect
  function success(result) {
    if (scanner) {
      scanner.clear();
    }
    setScannerResult(result);
  }

  function error(err) {
    console.warn(err);
  }

  useEffect(() => {
    const newScanner = new Html5QrcodeScanner(`reader`, {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });
    setScanner(newScanner);

    newScanner.render(success, error);

    // Cleanup on component unmount
    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, []);

  const scanQR = async () => {
    try {
      const response = await axiosInstanceAuthorization.put(`/order/scan-ticket`, {
        unique_code: scannerResult,
      });
      toast({
        title: response.data.message,
        status: "success",
        position: "bottom-right",
        isClosable: true,
      });
      setScannerResult(null);
      setTimeout(() => {
        if (scanner) {
          scanner.render(success, error);
        }
      }, 3000); 
    } catch (error) {
      console.log(error);
      toast({
        title: error?.response?.data.message,
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
      setScannerResult(null);
      setTimeout(() => {
        if (scanner) {
          scanner.render(success, error);
        }
      }, 3000); // Restart the scanner after 5 seconds
    }
  };

  useEffect(() => {
    if (scannerResult) {
      scanQR();
    }
  }, [scannerResult]);

  const handleScanTicket = async () => {
    try {
      if (
        !(
          ucIdHistory &&
          ucIdUser &&
          ucIdOrganization &&
          ucIdEvent &&
          ucIdTicket &&
          ucAmount &&
          ucDate
        )
      ) {
        toast({
          title: "Complete form to scan ticket",
          status: "warning",
          position: "bottom-right",
          isClosable: true,
        });
        return;
      }
      const response = await axiosInstanceAuthorization.put(
        `/order/scan-ticket`,
        {
          unique_code,
        }
      );
      toast({
        title: response.data.message,
        status: "success",
        position: "bottom-right",
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <form>
        <Box p={8} borderWidth="1px" borderRadius="lg" overflow="hidden" mt={4}>
          <Flex mt={4}>
            <Box
              p={8}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              flex={18}
            >
              <Heading my={4}>Scan Ticket</Heading>
              <Box
                px={80}
                py={8}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                my={4}
              >                
                <div id="reader"></div>
              </Box>
              <Stack spacing={4}>
                <FormControl>
                  <Flex>
                    <Box flex="1" mr={2}>
                      <Input
                        name="ucIdHistory"
                        value={ucIdHistory}
                        onChange={(e) => setUcIdHistory(e.target.value)}
                        type="number"
                      />
                    </Box>
                    <Box flex="1" mr={2}>
                      <Input
                        name="ucIdUser"
                        value={ucIdUser}
                        onChange={(e) => setUcIdUser(e.target.value)}
                        type="number"
                      />
                    </Box>
                    <Box flex="1" mr={2}>
                      <Input
                        name="ucIdOrganization"
                        value={ucIdOrganization}
                        onChange={(e) => setUcIdOrganization(e.target.value)}
                        type="number"
                      />
                    </Box>
                    <Box flex="1" mr={2}>
                      <Input
                        name="ucIdEvent"
                        value={ucIdEvent}
                        onChange={(e) => setUcIdEvent(e.target.value)}
                        type="number"
                      />
                    </Box>
                    <Box flex="1" mr={2}>
                      <Input
                        name="ucIdTicket"
                        value={ucIdTicket}
                        onChange={(e) => setUcIdTicket(e.target.value)}
                        type="number"
                      />
                    </Box>
                    <Box flex="1" mr={2}>
                      <Input
                        name="ucAmount"
                        value={ucAmount}
                        onChange={(e) => setUcAmount(e.target.value)}
                        type="number"
                      />
                    </Box>
                    <Box flex="2" mr={2}>
                      <Input
                        name="ucDate"
                        value={ucDate}
                        type="date"
                        onChange={(e) => setUcDate(e.target.value)}
                      />
                    </Box>
                  </Flex>
                </FormControl>
              </Stack>
            </Box>
          </Flex>
          <VStack mt={4}>
            <Button
              bg={primaryColor}
              color={white}
              onClick={() => {
                handleScanTicket();
              }}
            >
              Scan Ticket
            </Button>
          </VStack>
        </Box>
      </form>
    </>
  );
}
