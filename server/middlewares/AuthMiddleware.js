const { verify } = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();


const prisma = new PrismaClient();
const secretKey = process.env.SECRET_KEY;


const validateToken = (req, res, next) => {
  const accessToken = req.cookies["accessToken"];

  if (!accessToken) return res.json({ error: "User not logged in!" });

  try {
    const validToken = verify(accessToken, secretKey);
    req.user = validToken;
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.json({ error: err });
  }
};


const validateRole = (role) => {
    return async (req, res, next) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: req.user.id } });
            if (!user || user.role !== role) {
                return res.status(403).json({ message: 'Access denied' });
            }
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
};


module.exports = { validateToken, validateRole};