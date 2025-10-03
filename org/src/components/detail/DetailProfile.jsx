import {
  Box,
  Center,
  Flex,
  Image,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstanceAuthorization from "@/lib/axiosInstanceAuthorization";
import { LoadingComponent } from "../LoadingComponent";
import { Loading } from "../Loading";

export function DetailProfile() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [organizationName, setOrganizationName] = useState("");
  const [logo, setLogo] = useState(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [profile, setProfile] = useState(null);
  const [error, setError]=useState(false)

  const { data: dataProfile, refetch: refetchDataProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axiosInstanceAuthorization.get(`/profile`);
      const profileData = data[0];
      setProfile(profileData);
      setOrganizationName(profileData.organization_name);
      setPhone(profileData.phone);
      setEmail(profileData.email);
      setLoading(false);
      return data;
    },
  });

  
  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("organization_name", organizationName);
    formData.append("phone", phone);
    formData.append("email", email);
    if (logo) {
      formData.append("logo", logo);
    }

    try {
      const response = await axiosInstanceAuthorization.put(`/profile/edit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Successfully updated profile",
        status: "success",
      });
      refetchDataProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Failed to update profile",
        description: error.response?.data?.message || "An unexpected error occurred",
        status: "error",
      });
    }
  };

  const handlePassword = async () => {
    try {
      if (newPassword === confirmationPassword) {
        await axiosInstanceAuthorization.put(`/profile/edit/password`, {
          old_password: oldPassword,
          new_password: newPassword,
        });
        toast({
          title: "Successfully changed password",
          status: "success",
        });
        setOldPassword("");
        setNewPassword("");
        setConfirmationPassword("");
      } else {
        toast({
          title: "Confirmation password doesn't match",
          status: "error",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: "Failed to change password",
        description: error.response?.data?.message || "An unexpected error occurred",
        status: "error",
      });
    }
  };

  if (loading) return <Loading/>;
  if (error) return <div>Error fetching data</div>;

  return (
    <>
      {profile && (
        <Flex justifyContent="center">
          <Box
            p={8}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            m={4}
            flex={2}
          >
            <form>
              <Center>
                {logo ? (
                  <Image
                    src={URL.createObjectURL(logo)}
                    alt="Selected Logo"
                    layout="fill"
                    boxSize="150px"
                    borderRadius="50%"
                    objectFit="cover"
                  />
                ) : (
                  profile.logo && (
                    <Image
                      src={profile.logo}
                      alt="Organization Logo"
                      layout="fill"
                      boxSize="150px"
                      borderRadius="50%"
                      objectFit="cover"
                    />
                  )
                )}
              </Center>
              <FormControl my={6}>
                <FormLabel>Logo</FormLabel>
                <Input
                  type="file"
                  onChange={(e) => setLogo(e.target.files[0])}
                />
              </FormControl>
              <FormControl my={6}>
                <FormLabel>Organization Name</FormLabel>
                <Input
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                />
              </FormControl>
              <FormControl my={6}>
                <FormLabel>Phone</FormLabel>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </FormControl>
              <FormControl my={6}>
                <FormLabel>Email</FormLabel>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <VStack>
                <Button onClick={handleUpdate}>Update</Button>
              </VStack>
            </form>
          </Box>
          <Box
            p={8}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            m={4}
            flex={1}
          >
            <form>
              <FormControl my={6}>
                <FormLabel>Old Password</FormLabel>
                <Input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </FormControl>
              <FormControl my={6}>
                <FormLabel>New Password</FormLabel>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </FormControl>
              <FormControl my={6}>
                <FormLabel>Confirmation Password</FormLabel>
                <Input
                  type="password"
                  value={confirmationPassword}
                  onChange={(e) => setConfirmationPassword(e.target.value)}
                />
              </FormControl>
              <VStack>
                <Button onClick={handlePassword}>Update</Button>
              </VStack>
            </form>
          </Box>
        </Flex>
      )}
    </>
  );
}
