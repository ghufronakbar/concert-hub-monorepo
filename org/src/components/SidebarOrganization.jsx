import { Box, Center, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import { useQuery } from "@tanstack/react-query";
import axiosInstanceAuthorization from "@/lib/axiosInstanceAuthorization";
import { primaryColor, secondaryColor, tersierColor } from "@/lib/color";
import Image from "next/image";
import { CheckCircleIcon, CheckIcon, CloseIcon, NotAllowedIcon, TimeIcon, WarningTwoIcon } from "@chakra-ui/icons";

export function SidebarMenu() {
  const router = useRouter();

  const { data: profileSB, isLoading: loadingProfileSB } = useQuery({
    queryKey: ["profileSB"],
    queryFn: async () => {
      const { data } = await axiosInstanceAuthorization.get("/profile");
      return data[0];
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  return (
    <>
      {!loadingProfileSB && profileSB && (
        <Sidebar>
          <br />
          <Box
            p={3}
            mx={2}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Stack onClick={() => router.push(`/admin/profile`)}>
              <Center>
                {profileSB.logo ? (
                  <Box
                    width="70px"
                    height="70px"
                    borderRadius="50%"
                    overflow="hidden"
                    position="relative"
                  >
                    <Image
                      src={profileSB.logo}
                      alt="Organization Logo"
                      layout="fill"
                      objectFit="cover"
                    />
                  </Box>
                ) : ""}
              </Center>
              <Text as="b" fontSize="2xl" color={secondaryColor} textAlign="center">
                {profileSB.organization_name}
              </Text>
            </Stack>
          </Box>
          <br />
          <br />
          <Menu>
            <MenuItem onClick={() => router.push(`/admin/event/scan`)}>🔎 Scan Tickets</MenuItem>
            <SubMenu label="🧾 Events">
              <MenuItem onClick={() => router.push(`/admin/event`)}>📑 All Event</MenuItem>
              <MenuItem onClick={() => router.push(`/admin/event?time=past`)}>⏳ Past Event</MenuItem>
              <MenuItem onClick={() => router.push(`/admin/event?time=on-going`)}>🎊 On Going</MenuItem>
              <MenuItem onClick={() => router.push(`/admin/event?time=soon`)}>🕝 Coming Soon</MenuItem>
              <MenuItem onClick={() => router.push(`/admin/event?status=0`)}>⌚ Waiting for approval</MenuItem>
              <MenuItem onClick={() => router.push(`/admin/event?status=1`)}>❌ Rejected by Admin</MenuItem>
              <MenuItem onClick={() => router.push(`/admin/event?status=2`)}>✅ Approved</MenuItem>
            </SubMenu>
            <SubMenu label="📒 Orders">
              <MenuItem onClick={() => router.push(`/admin/orders`)}>🎫 All Order</MenuItem>
              <MenuItem onClick={() => router.push(`/admin/orders?paid=0`)}><HStack><TimeIcon color={tersierColor} /><Text>Pending</Text> </HStack></MenuItem>
              <MenuItem onClick={() => router.push(`/admin/orders?paid=1`)}><HStack><CloseIcon color={secondaryColor} /><Text>Cancelled by User</Text> </HStack></MenuItem>
              <MenuItem onClick={() => router.push(`/admin/orders?paid=2`)}><HStack><WarningTwoIcon color="red" /><Text>Anomaly Transaction</Text> </HStack></MenuItem>
              <MenuItem onClick={() => router.push(`/admin/orders?paid=3`)}><HStack><CheckIcon color={primaryColor}/><Text>Paid</Text> </HStack></MenuItem>
              <MenuItem onClick={() => router.push(`/admin/orders?paid=4`)}><HStack> <CheckCircleIcon color={primaryColor} /><Text>Confirmed</Text> </HStack></MenuItem>
              <MenuItem onClick={() => router.push(`/admin/orders?paid=5`)}><HStack><NotAllowedIcon color='red'/><Text>Expired Time</Text> </HStack></MenuItem>
            </SubMenu>
            <MenuItem onClick={handleLogout}>🔒 Logout</MenuItem>
          </Menu>
        </Sidebar>
      )}
    </>
  );
}
