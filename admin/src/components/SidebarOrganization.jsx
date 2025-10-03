import { Box, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";

export function SidebarMenu() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  return (
    <>
      <Sidebar>
        <Box
          p={3}
          mx={2}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          display="flex"
          flexDirection="column"
          alignItems="center"
          mt={8}
        >
          <Text as="b" fontSize="3xl">
            ADMIN
          </Text>
        </Box>
        <br />
        <Menu>
          <SubMenu label="🧾 Events">
            <MenuItem onClick={() => router.push(`/admin/event`)}>
              📑 All Event
            </MenuItem>
            <MenuItem
              onClick={() => router.push(`/admin/event?time=past`)}
            >
              ⏳ Past Event
            </MenuItem>
            <MenuItem
              onClick={() => router.push(`/admin/event?time=on-going`)}
            >
              🎊 On Going
            </MenuItem>
            <MenuItem
              onClick={() => router.push(`/admin/event?time=soon`)}
            >
              🕝 Coming Soon
            </MenuItem>
            <MenuItem
              onClick={() => router.push(`/admin/event?status=0`)}
            >
              ⌚ Waiting for approval
            </MenuItem>
            <MenuItem
              onClick={() => router.push(`/admin/event?status=1`)}
            >
              ❌ Rejected by Admin
            </MenuItem>
            <MenuItem
              onClick={() => router.push(`/admin/event?status=2`)}
            >
              ✅ Approved
            </MenuItem>
          </SubMenu>
          <SubMenu label="🏢 Organizations">
            <MenuItem onClick={() => router.push(`/admin/organization`)}>
              📑 All Organizations
            </MenuItem>
            <MenuItem
              onClick={() => router.push(`/admin/organization?status=0`)}
            >
              ⏳ Need Approval
            </MenuItem>
            <MenuItem
              onClick={() => router.push(`/admin/organization?status=1`)}
            >
              ❌ Banned
            </MenuItem>
            <MenuItem onClick={() => router.push(`/admin/event?status=2`)}>
              ✅ Active
            </MenuItem>
          </SubMenu>
          <MenuItem
            onClick={() => {
              handleLogout();
            }}
          >
            🔒 Logout
          </MenuItem>
        </Menu>
      </Sidebar>
    </>
  );
}
