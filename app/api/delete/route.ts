import { db } from "@/db";
import { NextResponse } from "next/server";
import { books } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as z from "zod";

const formSchema = z.object({
  id: z.string(),
});

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = formSchema.parse(body);

    const book = await db.delete(books).where(eq(books.id, id));

    if (!book) {
      return new NextResponse("No Books", { status: 401 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.log("BOOK_DELETE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
