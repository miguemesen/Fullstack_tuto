import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
    const [{data, fetching}] = useMeQuery();
    const router = useRouter();
    useEffect(() => {
      if (!fetching && !data.me){
        router.replace("/login?next=" + router.pathname)  // we tell the login page where to go after we've logged in
      }
    }, [fetching,data,router])   
}