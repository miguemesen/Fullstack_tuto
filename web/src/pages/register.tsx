import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";
import { Box } from "@chakra-ui/layout";
import { Formik, Form } from "formik";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useMutation } from "urql";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import {useRouter} from "next/router";

interface registerProps {}



const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [,register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, {setErrors}) => {
          const response = await register(values)
          if (response.data?.register.errors){
            setErrors(toErrorMap(response.data.register.errors))
          } else if (response.data?.register.user){
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
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
