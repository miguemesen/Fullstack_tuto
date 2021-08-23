import { Box, Flex, Link, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";

const CreatePost: React.FC<{}> = ({}) => {
    return (
      <Wrapper>
        <Formik
          initialValues={{ title: "", text: "" }}
          onSubmit={async (values) => {
            console.log(values);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="title"
                label="Title"
                placeholder="title"
              ></InputField>
              <Box mt={4}>
                <InputField
                  textarea
                  name="text"
                  label="Body"
                  placeholder="text..."
                ></InputField>
              </Box>
              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                backgroundColor="teal"
                color="white"
              >
                create post
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    );
}

export default CreatePost;