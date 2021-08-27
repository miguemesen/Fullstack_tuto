import { Box, Link } from "@chakra-ui/layout";
import { Button, Flex } from "@chakra-ui/react";
import { query } from "@urql/exchange-graphcache";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { router } from "websocket";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { MeDocument, MeQuery, useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";
import NextLink from "next/link"
import { withApollo } from "../../utils/withApollo";

const ChangePassword: NextPage = () => {
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            variables: {
              newPassword: values.newPassword,
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",   
            },
            update: (cache, {data}) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.changePassword.user,
                }
              });
              cache.evict({fieldName: "posts:{}"})
            }
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            // it worked
            router.push("/"); // pushes back to homepage
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              label="new password"
              placeholder="New Password"
              type="password"
            ></InputField>
            {tokenError ? (
              <Flex>
                <Box mr={2} color="red">{tokenError}</Box>
                <NextLink href="/forgot-password">
                <Link>click here to get a new one</Link>
                </NextLink>
              </Flex>
            ) : null}
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              backgroundColor="teal"
              color="white"
            >
              change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};


export default withApollo({ssr: false}) (ChangePassword);
