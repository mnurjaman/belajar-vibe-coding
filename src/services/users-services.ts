import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { db, schema } from "../db";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export type RegisterUserResult =
  | { success: true; data: "OK" }
  | { success: false; error: string };

export async function registerUser(input: RegisterUserInput): Promise<RegisterUserResult> {
  const { name, email, password } = input;

  // Cek apakah email sudah terdaftar
  const existingUser = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return {
      success: false,
      error: "email sudah terdaftar",
    };
  }

  // Hash password menggunakan bcrypt
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Simpan user baru ke database
  await db.insert(schema.users).values({
    name,
    email,
    password: hashedPassword,
  });

  return {
    success: true,
    data: "OK",
  };
}
