import { useRouter } from "next/router";
import { useEffect, useState, createContext } from "react";
import {jwtDecode} from "jwt-decode"; // Perhatikan bahwa tidak ada kurung kurawal
import { useToast } from "@chakra-ui/react";

export const AuthContext = createContext();

export function withAuth(Component) {
  const WithAuthComponent = (props) => {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const toast = useToast()

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin/login");
      } else {
        try {
          const payload = jwtDecode(token);
          if (!payload.rows || payload.rows.length === 0) {
            router.push("/admin/login");
          } else if (payload.exp < Date.now() / 1000) {
            console.log("waktu habis");
            toast({
              title: "Session has expired",
              status: "warning",
              position: "bottom-right",
              isClosable: true,
            });
            router.push("/admin/login");
          } else {
            setUserData(payload);
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          router.push("/admin/login");
        }
      }
    }, [router, toast]);

    return (
      <AuthContext.Provider value={userData}>
        <Component {...props} />
      </AuthContext.Provider>
    );
  };

  WithAuthComponent.displayName = `withAuth(${Component.displayName || Component.name || "Component"})`;

  return WithAuthComponent;
}

