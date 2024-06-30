const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const toggleLike = async (req, res) => {
    const {roomId} = req.body;
    const tenantId = req.user.id;
    try {
        const found = await prisma.like.findUnique({
            where: {
                roomId_tenantId: {
                    roomId: parseInt(roomId),
                    tenantId: parseInt(tenantId),
                },
            },
        });

        if (!found) {
            await prisma.like.create({
                data: {
                    roomId: parseInt(roomId),
                    tenantId: parseInt(tenantId),
                },
            });
            res.json({ liked: true });
        } else {
            await prisma.like.delete({
                where: {
                    roomId_tenantId: {
                        roomId: parseInt(roomId),
                        tenantId: parseInt(tenantId),
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

