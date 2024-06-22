"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { FileUpload } from "@/components/file-upload";
import axios from "axios";
import { toast } from "sonner";
import useAuth from "../hooks/useAuth";

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, {
    message: "Book name is required.",
  }),
  author: z.string().min(1, {
    message: "Author is required.",
  }),
  releaseDate: z.string().min(1, {
    message: "Release date is required.",
  }),
  bookUrl: z.string().min(1, {
    message: "Book URL is required.",
  }),
  imageUrl: z.string().min(1, {
    message: "Image URL is required.",
  }),
});

export default function Edit() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = searchParams.get("id");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      author: "",
      releaseDate: "",
      bookUrl: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (bookId) {
      const fetchBook = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`/api/getBook?id=${bookId}`);
          form.reset(response.data);
        } catch (error) {
          console.error("Error fetching book details:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchBook();
    }
  }, [bookId, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await axios.put("/api/edit", values);
      toast.success("Book updated successfully");
      form.reset();
      setIsLoading(false);
      router.push("/");
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error("Failed to update book");
      setIsLoading(false);
    }
  };

  const onCancel = () => {
    router.push("/");
  };

  useAuth();
  return (
    <Suspense
      fallback={
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      }
    >
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.700")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            Edit Book
          </Heading>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormControl id="imageUrl" isRequired>
                <FormLabel>Upload an Image</FormLabel>
                <Center>
                  <FileUpload
                    endpoint="bookImage"
                    value={form.watch("imageUrl")}
                    onChange={(url) => form.setValue("imageUrl", url || "")}
                  />
                </Center>
              </FormControl>
              <FormControl id="bookUrl" isRequired>
                <FormLabel>Upload a Book</FormLabel>
                <Center>
                  <FileUpload
                    endpoint="bookUrl"
                    value={form.watch("bookUrl")}
                    onChange={(url) => form.setValue("bookUrl", url || "")}
                  />
                </Center>
              </FormControl>
              <FormControl id="name" isRequired>
                <FormLabel>Book Name</FormLabel>
                <Input
                  placeholder="Book Name"
                  _placeholder={{ color: "gray.500" }}
                  {...form.register("name")}
                />
              </FormControl>
              <FormControl id="author" isRequired>
                <FormLabel>Author</FormLabel>
                <Input
                  placeholder="Author"
                  _placeholder={{ color: "gray.500" }}
                  {...form.register("author")}
                />
              </FormControl>
              <FormControl id="releaseDate" isRequired>
                <FormLabel>Release Date</FormLabel>
                <Input
                  type="date"
                  placeholder="Release Date"
                  _placeholder={{ color: "gray.500" }}
                  {...form.register("releaseDate")}
                />
              </FormControl>
              <Flex h={"10vh"} />
              <Stack spacing={6} direction={["column", "row"]}>
                <Button
                  bg={"red.400"}
                  color={"white"}
                  w="full"
                  onClick={onCancel}
                  _hover={{
                    bg: "red.500",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  w="full"
                  type="submit"
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Submit
                </Button>
              </Stack>
            </form>
          </FormProvider>
        </Stack>
      </Flex>
    </Suspense>
  );
}
