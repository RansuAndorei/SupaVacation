import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const { userId } = req.query;

  if (req.method === "GET") {
    try {
      const favorites = await prisma.favorite.findMany({
        where: { userId: userId },
        select: {
          homeId: true,
        },
      });
      res.status(200).json(favorites);
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  } else if (req.method === "POST") {
    try {
      const { addId } = req.body;
      const favorite = await prisma.favorite.createMany({
        data: {
          userId,
          homeId: addId,
        },
      });
      res.status(200).json(favorite);
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { deleteId } = req.body;

      const favoriteId = await prisma.favorite.findFirst({
        select: {
          id: true,
        },
        where: {
          userId: userId,
          homeId: deleteId,
        },
      });
      const favorite = await prisma.favorite.delete({
        where: {
          id: favoriteId.id,
        },
      });
      res.status(200).json(favorite);
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  // HTTP method not supported!
  else {
    res.setHeader("Allow", ["GET"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
