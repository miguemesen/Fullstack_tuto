import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { gql } from "urql";
import {
  PostSnippetFragment,
  PostsQuery,
  useUpvoteMutation,
  UpvoteMutation
} from "../generated/graphql";
import {ApolloCache} from "@apollo/client"

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const updateAfterVote = (value: number, postId: number, cache: ApolloCache<UpvoteMutation>) => {
  const data = cache.readFragment<{ // we had to type all that because there's no object with those three types (id, points, voteStatus)
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });

  if (data){
    if (data.voteStatus === value){
      return;
    }
    const newPoints =
    (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
    cache.writeFragment(
      {
        id: "Post:" + postId,
        fragment: gql`
        fragment _ on Post {
          points
          voteStatus
        }
        `, data: {points: newPoints, voteStatus: value},
      }
    )
  }
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [vote] = useUpvoteMutation();
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        aria-label="updoot post"
        colorScheme={post.voteStatus === 1 ? "green" : undefined}
        icon={<ChevronUpIcon />}
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setLoadingState("updoot-loading");
          await vote({
            variables: { postId: post.id, value: 1 },
            update: (cache) => updateAfterVote(1, post.id, cache),
          });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "updoot-loading"}
      />
      {post.points}
      <IconButton
        aria-label="downdoot post"
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        icon={<ChevronDownIcon />}
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          setLoadingState("downdoot-loading");
          await vote({
            variables: {
              postId: post.id,
              value: -1,
            },
            update: (cache) => updateAfterVote(-1, post.id, cache),
          });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "downdoot-loading"}
      />
    </Flex>
  );
};
