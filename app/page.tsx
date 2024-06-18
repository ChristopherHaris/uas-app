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
  Spinner,
  Box,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  ArrowForwardIcon,
  HamburgerIcon,
  EditIcon,
  DeleteIcon,
  ViewIcon,
  UnlockIcon,
  SunIcon,
  MoonIcon,
} from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import useAuth from "@/app/hooks/useAuth";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const { colorMode, toggleColorMode } = useColorMode();
  const buttonColor = useColorModeValue("black", "white");
  

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

  const onEdit = (book: Book) => {
    router.push(`/edit?id=${book.id}`);
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

  const printPDF = () => {
    const pdf = new jsPDF();
    let yOffset = 10;
    let pageHeight = pdf.internal.pageSize.height;
  
    const addBookToPDF = async (book: Book, index: number) => {
      try {
        const canvas = await html2canvas(document.querySelector(`#image-${book.id}`)!, { scale: 10 }); // Adjust scale as needed
        const imgData = canvas.toDataURL("image/png");
        pdf.addImage(imgData, "PNG", 10, yOffset, 60, 60, "", "FAST");
        yOffset += 80;
  
        pdf.text(`ID: ${book.id}`, 10, yOffset);
        yOffset += 10;
  
        pdf.text(`Name: ${book.name}`, 10, yOffset);
        yOffset += 10;
  
        pdf.text(`Author: ${book.author}`, 10, yOffset);
        yOffset += 10;
  
        pdf.text(`Release Date: ${book.releaseDate}`, 10, yOffset);
        yOffset += 10;
  
        pdf.line(10, yOffset, 200, yOffset);
        yOffset += 20;
  
        // Check if adding another book will exceed page height
        if (yOffset > pageHeight - 20) { // Leave some margin for footer
          pdf.addPage();
          yOffset = 10;
        }
  
        if (index === data.length - 1) {
          const pdfBlob = pdf.output("blob");
          const blobUrl = URL.createObjectURL(pdfBlob);
          window.open(blobUrl, "_blank");
        }
      } catch (error) {
        console.error("Error adding book to PDF:", error);
      }
    };
  
    data.forEach((book, index) => {
      addBookToPDF(book, index);
    });
  };
  
  const logout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
    toast.success("Successfully logged out");
  };

  useAuth();
  return (
    <div>
      <div className="flex justify-end gap-2 pt-10 px-8 lg:px-24 w-full">
        <Button onClick={onClick} rightIcon={<ArrowForwardIcon />} colorScheme="teal">
          Add Books
        </Button>
        <Button onClick={printPDF} rightIcon={<ViewIcon />} colorScheme="blue">
          Show PDF
        </Button>
        <Button
          onClick={toggleColorMode}
          rightIcon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          bg={buttonColor}
          color={colorMode === "light" ? "white" : "black"}
        >
          {colorMode === "light" ? "Dark" : "Light"} Mode
        </Button>
      </div>
      <div className="container justify-center mx-auto py-10">
        {isLoading ? (
          <div className="flex w-full justify-center">
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
          </div>
        ) : (
          <TableContainer id="table-to-print">
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
                      <Image id={`image-${book.id}`} src={book.imageUrl} height="50" width="50" alt={book.name} />
                    </Td>
                    <Td>{book.name}</Td>
                    <Td>{book.author}</Td>
                    <Td isNumeric>{book.releaseDate}</Td>
                    <Td>
                      <Menu>
                        <MenuButton as={IconButton} aria-label="Options" icon={<HamburgerIcon />} variant="outline" />
                        <MenuList>
                          <MenuItem onClick={() => onView(book.bookUrl as string)} icon={<ViewIcon />}>
                            View
                          </MenuItem>
                          <MenuItem onClick={() => onEdit(book)} icon={<EditIcon />}>
                            Edit
                          </MenuItem>
                          <MenuItem onClick={() => onDelete(book.id as string)} icon={<DeleteIcon />}>
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
      <Box className="fixed bottom-0 right-0 flex justify-end pb-10 pr-10">
        <Button onClick={logout} rightIcon={<UnlockIcon />} colorScheme="red">
          Logout
        </Button>
      </Box>
    </div>
  );
}
