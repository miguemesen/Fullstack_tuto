import {
    Button,
  } from "@chakra-ui/react";
  import { Box, Flex, Link } from "@chakra-ui/layout";
  import { Formik, Form } from "formik";
  import React from "react";
  import { InputField } from "../components/InputField";
  import { Wrapper } from "../components/Wrapper";
  import { useLoginMutation } from "../generated/graphql";
  import { toErrorMap } from "../utils/toErrorMap";
  import {useRouter} from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link"
  
  interface registerProps {}
  
  
  
  const Login: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [,login] = useLoginMutation();
    return (
      <Wrapper variant="small">
        <Formik
          initialValues={{ usernameOrEmail: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await login(values);
            if (response.data?.login.errors) {
              setErrors(toErrorMap(response.data.login.errors));
            } else if (response.data?.login.user) {
              // it worked
              if (typeof router.query.next === "string"){
                router.push(router.query.next); // pushes back to homepage
              } else {
                router.push("/")
              }
              
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="usernameOrEmail"
                label="Username or Email"
                placeholder="username or email"
              ></InputField>
              <Box mt={4}>
                <InputField
                  name="password"
                  label="Password"
                  placeholder="password"
                  type="password"
                ></InputField>
              </Box>
              <Flex mt={2}>
                <NextLink href="/forgot-password">
                  <Link ml="auto">forgot password?</Link>
                </NextLink>
              </Flex>
              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                backgroundColor="teal"
                color="white"
              >
                login
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    );
  };
  
  export default withUrqlClient(createUrqlClient) (Login);
  