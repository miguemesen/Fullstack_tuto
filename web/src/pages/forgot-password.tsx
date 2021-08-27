import { Box, Flex, Link, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import router from "next/router";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";
import { withApollo } from "../utils/withApollo";
import login from "./login";

const ForgotPassword: React.FC<{}> = ({}) => {
    const [complete, setComplete] = useState(false);
    const [forgotPassword] = useForgotPasswordMutation()
    return (
      <Wrapper variant="small">
        <Formik
          initialValues={{ email: "" }}
          onSubmit={async (values) => {
            await forgotPassword({variables: values});
            setComplete(true);
          }}
        >
          {({ isSubmitting }) =>
            complete ? (
              <Box>if an account with that email exists, we sent you an email</Box>
            ) : (
              <Form>
                <InputField
                  name="email"
                  label="Email"
                  placeholder="email"
                  type="email"
                ></InputField>
                <Button
                  mt={4}
                  type="submit"
                  isLoading={isSubmitting}
                  backgroundColor="teal"
                  color="white"
                >
                  forgot password
                </Button>
              </Form>
            )
          }
        </Formik>
      </Wrapper>
    );
}

export default withApollo({ssr: false}) (ForgotPassword);