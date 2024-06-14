import { db } from "@/db";
import { NextResponse } from "next/server";
import * as z from "zod";

export async function GET() {
  try {
    const books = await db.query.books.findMany();

    if (!books) {
      return new NextResponse("No Books", { status: 401 });
    }

    return NextResponse.json(books);
  } catch (error) {
    console.log("BOOKS_FIND", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
