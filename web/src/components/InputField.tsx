import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react';
import { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & { // we want our inputField component to take any props that a regular inputfield would take
    name: string;
    label: string;
};

//'' => false
// 'error message stuff' => true

export const InputField: React.FC<InputFieldProps> = ({ // takes label and size off of props
  label,
  size, // here we destructure size off of props
  ...props
}) => {
  
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} {...props} id={field.name} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};