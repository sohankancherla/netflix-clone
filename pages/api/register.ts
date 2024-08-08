import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const { email, name, password } = req.body;

    const exisitngUser = await db.user.findUnique({
      where: {
        email
      }
    });

    if (exisitngUser) {
      return res.status(422).json({ error: "Email taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image: "",
        emailVerified: new Date()
      }
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(400).end();
  }
}
