const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const getLikesByRoom = async (req, res)=>{
    const { roomId } = req.params;
    try {
        const likeCount = await prisma.like.count({
            where: { roomId: parseInt(roomId) },
          });
        
          // Fetch the details of each like
        const likeDetails = await prisma.like.findMany({
            where: { roomId: parseInt(roomId) },
            include: {
                user: {
                    select: {
                        email: true,
                        // Include other user fields if needed
                    }
                }
            }
        });

        res.status(200).json({likeCount, likeDetails});

    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
}


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
    getLikesByRoom, 
    toggleLike
 }

