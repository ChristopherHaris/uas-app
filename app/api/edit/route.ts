import { db } from "@/db";
import { NextResponse } from "next/server";
import { books } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as z from "zod";

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

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, author, releaseDate, bookUrl, imageUrl } =
      formSchema.parse(body);

    const book = await db
      .update(books)
      .set({ name, author, releaseDate, bookUrl, imageUrl })
      .where(eq(books.id, id));

    if (!book) {
      return new NextResponse("Edit Failed", { status: 401 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.log("BOOK_PUT", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
