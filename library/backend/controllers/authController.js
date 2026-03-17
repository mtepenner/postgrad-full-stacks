// controllers/authController.js
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const registerUser = async (req, res) => {
  const { email, password, role, adminCode } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'ADMIN') {
      // 1. Validate Admin Code
      if (!adminCode) {
        return res.status(400).json({ error: "Admin code required for this role." });
      }

      const validCode = await prisma.admin_ID.findUnique({ where: { code: adminCode } });
      
      if (!validCode || validCode.isUsed) {
        return res.status(403).json({ error: "Invalid or expired Admin ID." });
      }

      // 2. Create Admin & invalidate code in a transaction
      const newAdmin = await prisma.$transaction([
        prisma.user.create({
          data: { email, password: hashedPassword, role: 'ADMIN' }
        }),
        prisma.admin_ID.update({
          where: { code: adminCode },
          data: { isUsed: true }
        })
      ]);

      return res.status(201).json({ message: "Admin registered successfully." });

    } else {
      // 3. Handle Regular Visitor Registration
      const visitorId = `VIS-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const newUser = await prisma.user.create({
        data: { email, password: hashedPassword, role: 'VISITOR', visitorId }
      });

      return res.status(201).json({ 
        message: "User registered successfully.", 
        visitorId: newUser.visitorId 
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Registration failed." });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials." });

    // Generate a secure JWT containing the user's ID and Role
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );
    
    res.status(200).json({ 
      token, 
      role: user.role, 
      visitorId: user.visitorId 
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed." });
  }
};
