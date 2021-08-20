import {
    Button,
  } from "@chakra-ui/react";
  import { Box } from "@chakra-ui/layout";
  import { Formik, Form } from "formik";
  import React from "react";
  import { InputField } from "../components/InputField";
  import { Wrapper } from "../components/Wrapper";
  import { useLoginMutation } from "../generated/graphql";
  import { toErrorMap } from "../utils/toErrorMap";
  import {useRouter} from "next/router";
  
  interface registerProps {}
  
  
  
  const Login: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [,login] = useLoginMutation();
    return (
      <Wrapper variant="small">
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={async (values, {setErrors}) => {
            const response = await login({options: values})
            if (response.data?.login.errors){
              setErrors(toErrorMap(response.data.login.errors))
            } else if (response.data?.login.user){
              // it worked
              router.push("/") // pushes back to homepage
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="username"
                label="Username"
                placeholder="username"
              ></InputField>
              <Box mt={4}>
                <InputField
                  name="password"
                  label="Password"
                  placeholder="password"
                  type="password"
                ></InputField>
              </Box>
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
  
  export default Login;
  