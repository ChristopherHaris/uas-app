import { db } from "@/db";
import { books } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import * as z from "zod";

const formSchema = z.object({
  id: z.string(),
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const { id } = formSchema.parse(params);

    const book = await db.query.books.findFirst({
      where: eq(books.id, id),
    });

    if (!book) {
      return new NextResponse("No Book Found", { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.log("BOOKS_FIND", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}