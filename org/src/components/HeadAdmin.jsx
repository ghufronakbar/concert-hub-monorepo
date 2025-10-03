import Head from "next/head";

import { useQuery } from "@tanstack/react-query";
import axiosInstanceAuthorization from "@/lib/axiosInstanceAuthorization";

export const HeadAdmin = () => {
  const { data: profileHead, refetch: refetchProfileHead } = useQuery({
    queryKey: ["profileHead"],
    queryFn: async () => {
      const { data } = await axiosInstanceAuthorization.get("/profile");
      return data[0];
    },
  });

  return (
    <Head>
      <title>{profileHead ? profileHead.organization_name : "Admin Organization"}</title>
      <meta
        name={profileHead ? profileHead.organization_name : "Loading.."}
        content="admin page for concerthub app"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/logo.svg" />
    </Head>
  );
};
