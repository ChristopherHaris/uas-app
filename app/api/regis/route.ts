import { db } from "@/db";
import { NextResponse } from "next/server";
import { users } from "@/db/schema";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Username is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, password } = formSchema.parse(body);

    const user = await db.insert(users).values({ name, password });

    if (!user) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.log("USER_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
