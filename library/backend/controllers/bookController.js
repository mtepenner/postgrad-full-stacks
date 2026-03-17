import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      orderBy: { title: 'asc' }, // Automatically alphabetizes the catalog
      include: { genre: true }   // Joins the Genre table so we get the genre name
    });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch catalog." });
  }
};

export const addBook = async (req, res) => {
  const { title, author, genreId } = req.body;
  
  try {
    const newBook = await prisma.book.create({
      data: { title, author, genreId }
    });
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: "Failed to add book to the database." });
  }
};
