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
  Link,
  Button,
  Heading,
  Text,
  useColorMode,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon, SunIcon, MoonIcon } from "@chakra-ui/icons";
import * as z from "zod";
import axios from "axios";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import NextLink from "next/link";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Username is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/login", values);

      if (response?.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      if (response.status === 200) {
        toast.success("Login Successful");
        form.reset();
        router.push("/");
      } else {
        toast.error("Please Try Again");
      }
    } catch (error) {
      console.log(error);
      toast.error("Please Try Again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} position="relative">
      <Box position="absolute" top="4" right="4">
        <IconButton
          aria-label="Toggle theme"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
        />
      </Box>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={8}>
        <Stack align={"center"}>
          <Image src="https://pacificgarden.co.id/wp-content/uploads/2021/10/Logo-UBM-Universitas-Bunda-Mulia-Original.png" alt="Logo" boxSize="150px" objectFit="contain" />
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
        </Stack>
        <Box rounded={"lg"} boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormControl id="name">
                  <FormLabel>Username</FormLabel>
                  <Input type="text" {...form.register("name")} />
                </FormControl>
                <FormControl id="password">
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
                    Sign in
                  </Button>
                </Stack>
              </form>
            </FormProvider>
            <Stack pt={6}>
              <Text align={"center"}>
                Not a user?{" "}
                <Link as={NextLink} href="/regis" color={"blue.400"}>
                  Register
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
