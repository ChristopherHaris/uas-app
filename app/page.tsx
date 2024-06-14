"use client";

import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  IconButton,
} from "@chakra-ui/react";
import {
  ArrowForwardIcon,
  HamburgerIcon,
  EditIcon,
  DeleteIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";

interface Book {
  bookUrl: string;
  id: string;
  imageUrl: string;
  name: string;
  author: string;
  releaseDate: string;
}

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Book[]>([]);

  const onClick = () => {
    router.push("/add");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/get");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const onView = (bookUrl: string) => {
    window.open(bookUrl, "_blank");
  };

  const onEdit = (bookUrl: string) => {
    window.open(bookUrl, "_blank");
  };

  const onDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await axios.delete("/api/delete", {
        data: { id },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
    window.location.reload();
    toast.success("successfully deleted books");
  };

  return (
    <div>
      <div className="flex justify-end gap-2 pt-10 px-8 lg:px-24 w-full">
        <Button
          onClick={onClick}
          rightIcon={<ArrowForwardIcon />}
          colorScheme="teal"
        >
          Add Books
        </Button>
      </div>
      <div className="container justify-center mx-auto py-10">
        {isLoading ? (
          <div className="flex w-full justify-center">Loading...</div>
        ) : (
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Image</Th>
                  <Th>Name</Th>
                  <Th>Author</Th>
                  <Th isNumeric>Release Date</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((book) => (
                  <Tr key={book.id}>
                    <Td>{book.id}</Td>
                    <Td>
                      <Image
                        src={book.imageUrl}
                        height="50"
                        width="50"
                        alt={book.name}
                      />
                    </Td>
                    <Td>{book.name}</Td>
                    <Td>{book.author}</Td>
                    <Td isNumeric>{book.releaseDate}</Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          aria-label="Options"
                          icon={<HamburgerIcon />}
                          variant="outline"
                        />
                        <MenuList>
                          <MenuItem
                            onClick={() => onView(book.bookUrl as string)}
                            icon={<ViewIcon />}
                          >
                            View
                          </MenuItem>
                          <MenuItem icon={<EditIcon />}>Edit</MenuItem>
                          <MenuItem
                            onClick={() => onDelete(book.id as string)}
                            icon={<DeleteIcon />}
                          >
                            Delete
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
              <Tfoot></Tfoot>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
}
