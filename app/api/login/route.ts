import { db } from "@/db";
import { NextResponse } from "next/server";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import * as z from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    const user = await db.query.users.findFirst({
      where: eq(users.name, name),
    });

    if (!user) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    const token = generateToken(user);

    return NextResponse.json({ token });
  } catch (error) {
    console.log("USER_FIND", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

function generateToken(user: { name: string; password: string; id: string | null; }) {
  const payload = { id: user.id, name: user.name };
  const secret = process.env.JWT_SECRET || "your-secret-key";
  const options = { expiresIn: "1h" };

  const token = jwt.sign(payload, secret, options);
  return token;
}
