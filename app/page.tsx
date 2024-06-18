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
  Spinner
} from "@chakra-ui/react";
import {
  ArrowForwardIcon,
  HamburgerIcon,
  EditIcon,
  DeleteIcon,
  ViewIcon,
  DownloadIcon, 
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
    const input = document.getElementById("table-to-print");
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        const pdfBlob = pdf.output("blob");
        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl, "_blank");
      });
    }
  };

  useAuth();
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
        <Button
          onClick={printPDF}
          rightIcon={<DownloadIcon />}
          colorScheme="blue"
        >
          Download PDF
        </Button>
      </div>
      <div className="container justify-center mx-auto py-10">
        {isLoading ? (
          <div className="flex w-full justify-center">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </div>
        ) : (
          // <MyDocument>
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
                          <MenuItem
                            onClick={() => onEdit(book)}
                            icon={<EditIcon />}
                          >
                            Edit
                          </MenuItem>
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
          // </MyDocument>
        )}
      </div>
    </div>
  );
}
