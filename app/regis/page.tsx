"use client";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Text,
  Link,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import * as z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Username is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export default function Regis() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", password: "" },
  });

  const onSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      await axios
        .post("/api/regis", values)
        .then((response) => {
          console.log(response);
          toast.success("Register Successful, Please Login");
          form.reset();
          setIsLoading(false);
          router.push("/login");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Please Try Again");
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign up a new account</Heading>
        </Stack>
        <Box rounded={"lg"} boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormControl id="name" isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input type="text" {...form.register("name")} />
                </FormControl>
                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...form.register("password")}
                    />
                    <InputRightElement h={"full"}>
                      <Button
                        variant={"ghost"}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <Stack spacing={10} pt={2}>
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    loadingText="Submitting"
                    size="lg"
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{ bg: "blue.500" }}
                  >
                    Sign up
                  </Button>
                </Stack>
              </form>
            </FormProvider>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <Link as={NextLink} href="/login" color={"blue.400"}>
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
