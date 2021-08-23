import { FormControl, FormErrorMessage, FormLabel, Input, Textarea } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & { // we want our inputField component to take any props that a regular inputfield would take
    name: string;
    label: string;
    textarea?: boolean
};

//'' => false
// 'error message stuff' => true

export const InputField: React.FC<InputFieldProps> = ({ // takes label and size off of props
  label,
  textarea,
  size, // here we destructure size off of props
  ...props
}) => {
  let InputOrTextarea = Input
  if (textarea){
    InputOrTextarea = Textarea as any
  }
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputOrTextarea {...field} {...props} id={field.name} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};