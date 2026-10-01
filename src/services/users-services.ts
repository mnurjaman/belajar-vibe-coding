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

export interface LoginUserInput {
  email: string;
  password: string;
}

export type LoginUserResult =
  | { success: true; data: string }
  | { success: false; error: string };

export async function loginUser(input: LoginUserInput): Promise<LoginUserResult> {
  const { email, password } = input;

  // Cari user berdasarkan email
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  if (!user) {
    return {
      success: false,
      error: "email atau password salah",
    };
  }

  // Verifikasi kecocokan password dengan hash bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return {
      success: false,
      error: "email atau password salah",
    };
  }

  // Generate UUID untuk session token
  const token = crypto.randomUUID();

  // Simpan token ke tabel sessions
  await db.insert(schema.sessions).values({
    token,
    userId: user.id,
  });

  return {
    success: true,
    data: token,
  };
}
