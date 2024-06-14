import { db } from "@/db";
import { NextResponse } from "next/server";
import { books } from "@/db/schema";
import * as z from "zod";

const formSchema = z.object({
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, author, releaseDate, bookUrl, imageUrl } = formSchema.parse(body);

    const book = await db.insert(books).values({ name, author, releaseDate, bookUrl, imageUrl });

    if (!book) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.log("BOOK_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
