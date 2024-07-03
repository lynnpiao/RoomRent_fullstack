const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const toggleLike = async (req, res) => {
    const {roomId, userId} = req.body;

    try {
        const found = await prisma.like.findUnique({
            where: {
                roomId_userId: {
                    roomId: parseInt(roomId),
                    userId: parseInt(userId),
                },
            },
        });

        if (!found) {
            await prisma.like.create({
                data: {
                    roomId: parseInt(roomId),
                    userId: parseInt(userId),
                },
            });
            res.json({ liked: true });
        } else {
            await prisma.like.delete({
                where: {
                    roomId_userId: {
                        roomId: parseInt(roomId),
                        userId: parseInt(userId),
                    },
                },
            });
            res.json({ liked: false });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });}
 }

 module.exports = {
    toggleLike
 }

