import { Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { Layout } from "../../components/Layout";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";

export const Post = ({}) => {
    const [{data, error, fetching}] = useGetPostFromUrl()

    if (fetching){
        return (
            <Layout>
                <div>loading...</div>
            </Layout>
        )
    }

    if (error){
        return <div>{error.message}</div>
    }

    if (!data?.post){
        return <Layout>
            <div>could not find post</div>
        </Layout>
    }
    
    return (
      <Layout>
        <Heading mb={4}>{data.post.title}</Heading>
        {data.post.text}
      </Layout>
    );
}

export default withUrqlClient(createUrqlClient,{ssr: true})(Post);