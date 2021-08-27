import { Box, Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import { Layout } from "../../components/Layout";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import { withApollo } from "../../utils/withApollo";

export const Post = ({}) => {
    const {data, error, loading} = useGetPostFromUrl()

    if (loading){
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
        <Box mb={6}>{data.post.text}</Box>
        <EditDeletePostButtons
          id={data.post.id}
          creatorId={data.post.creator.id}
        />
      </Layout>
    );
}

export default withApollo({ssr: true}) (Post);