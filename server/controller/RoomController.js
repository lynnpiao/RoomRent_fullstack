const { PrismaClient } = require('@prisma/client');
const {validateRoom, validatePartialRoom} = require('../middlewares/SchemaMiddleware')
const prisma = new PrismaClient();
const Joi = require('joi');


// get AllRooms
const getRooms = async (req, res) => {
    try {
        const rooms = await prisma.room.findMany({
            include: {
                apartment: {
                    select: {
                        name: true,
                        contact_email: true
                    }
                }
            }
        })

        if (!rooms || rooms.length === 0) {
            return res.status(404).json({ msg: 'No rooms found' });
        }
        const roomsWithApartment = rooms.map(room => ({
            ...room,
            name: room.apartment ? room.apartment.name : null,
            contact_email: room.apartment ? room.apartment.contact_email : null,
        }));

        res.status(200).json(roomsWithApartment)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


// get RoomById
const getRoomById = async (req, res) => {
    const { id } = req.params;

    try {
        if (isNaN(parseInt(id))) {
            return res.status(400).json({ msg: 'Room ID must be a valid number.' });
        }

        const room = await prisma.room.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                apartment: {
                    select: {
                        name: true,
                        contact_email: true
                    }
                }
            }
        })

        if (!room) {
            return res.status(404).json({ msg: 'No rooms found' });
        }
        const roomWithApartment = {
            ...room,
            name: room.apartment ? room.apartment.name : null,
            contact_email: room.apartment ? room.apartment.contact_email : null,
        };

        res.status(200).json(roomWithApartment)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }

};


// get RoomsByApartment
const getRoomsByApartment = async (req, res) => {
    const { apartmentId } = req.params;

    try {
        if (isNaN(parseInt(apartmentId))) {
            return res.status(400).json({ msg: 'Apartment ID must be a valid number.' });
        }

        const rooms = await prisma.room.findMany({
            where: {
                apartmentId: parseInt(apartmentId)
            },
            include: {
                apartment: {
                    select: {
                        name: true,
                        contact_email: true
                    }
                }
            }
        })

        if (!rooms || rooms.length === 0) {
            return res.status(404).json({ msg: 'No rooms found' });
        }
        const roomsWithApartment = rooms.map(room => ({
            ...room,
            name: room.apartment ? room.apartment.name : null,
            contact_email: room.apartment ? room.apartment.contact_email : null,
        }));

        res.status(200).json(roomsWithApartment)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }

};


// Define Joi schema for validation
const amenityIdsSchema = Joi.array().items(Joi.number().integer().required()).min(1);


// get RoomsByAmenities
const getRoomsByAmenities = async (req, res) => {
    const { amenityIds } = req.body;
    // console.log('Request body:', req.body);

    try {
        const { error } = amenityIdsSchema.validate(amenityIds);
        if (error) {
            return res.status(400).json({ msg: 'Invalid request data.', error: error.details[0].message });
        }

    
        const rooms = await prisma.room.findMany({
            where: {
                AND: amenityIds.map(amenityId => ({
                    amenities: {
                        some: {
                            amenityId: parseInt(amenityId)
                        }
                    }
                }))
            },
            include: {
                apartment: {
                    select: {
                        name: true,
                        contact_email: true
                    }
                }
            }
        });

        if (!rooms || rooms.length === 0) {
            return res.status(404).json({ msg: 'No rooms found' });
        }
        const roomsWithApartment = rooms.map(room => ({
            ...room,
            name: room.apartment ? room.apartment.name : null,
            contact_email: room.apartment ? room.apartment.contact_email : null,
        }));

        res.status(200).json(roomsWithApartment)
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};



// Define Joi schema for validation
const attributesSchema = Joi.object({
    maxSqFeet: Joi.number().integer().min(1).optional(),
    maxRentPerMonth: Joi.number().integer().min(1).optional(),
    type: Joi.string().optional(),
}).or('maxSqFeet', 'maxRentPerMonth', 'type');


// get RoomsBySeveralImportantAttributes(sqFeet, rentPerMonth, type)
const getRoomsByAttributes = async (req, res) => {
    const { maxSqFeet, maxRentPerMonth, type } = req.body;
    try {
        const { error } = attributesSchema.validate({ maxSqFeet, maxRentPerMonth, type });
        if (error) {
            return res.status(400).json({ msg: 'At least one attribute is required.', error: error.details[0].message });
        }

        // Construct the query object
        let query = {};
        if (maxSqFeet !== undefined) query.sqFeet = { lte: maxSqFeet };
        if (maxRentPerMonth !== undefined) query.rentPerMonth = { lte: maxRentPerMonth };
        if (type !== undefined) query.type = type;

        const rooms = await prisma.room.findMany({
            where: query,
            include: {
                apartment: {
                    select: {
                        name: true,
                        contact_email: true
                    }
                }
            }
        });

        if (!rooms || rooms.length === 0) {
            return res.status(404).json({ msg: 'No rooms found' });
        }
        const roomsWithApartment = rooms.map(room => ({
            ...room,
            name: room.apartment ? room.apartment.name : null,
            contact_email: room.apartment ? room.apartment.contact_email : null,
        }));

        res.status(200).json(roomsWithApartment)

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }

}

// create a room
const createRoom = async (req, res) => {
    const { aptNumber, sqFeet, type, availableDate, rentPerMonth,
        floor, minLeaseLength, apartmentId } = req.body

    try {
        const createdRoom = await prisma.room.create({
            data: {
                aptNumber: parseInt(aptNumber),
                sqFeet: parseInt(sqFeet),
                type,
                availableDate: availableDate || new Date(),
                rentPerMonth: parseInt(rentPerMonth),
                floor: parseInt(floor) || null,
                minLeaseLength: parseInt(minLeaseLength) || null,
                apartmentId: parseInt(apartmentId) || null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
        })
        res.status(201).json({ msg: 'Create Room successfully', createdRoom })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

// update a room 
const updateRoom = async (req, res) => {
    const id = req.params.id;
    const idInt = parseInt(id);
    const {availableDate, rentPerMonth, minLeaseLength} = req.body

    try {
        if (isNaN(idInt) || idInt <= 0 ) {
            return res.status(400).json({ error: 'Invalid RoomId' });
        }

        const updatedRoom = await prisma.room.update({
            where: {
                    id: idInt,
            },
            data: {
                availableDate: availableDate || new Date(),
                rentPerMonth: parseInt(rentPerMonth),
                minLeaseLength: parseInt(minLeaseLength) || null
            },
        })
        res.status(200).json({ msg: 'Room updated successfully', updatedRoom})
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

// delete a room
const deleteRoom = async (req, res) => {
    const id = req.params.id;
    const idInt = parseInt(id);

    try {

        if (isNaN(idInt) || idInt <= 0 ) {
            return res.status(400).json({ error: 'Invalid RoomId' });
        }

        const deletedRoom = await prisma.room.delete({
            where: {
                id: idInt,
            },
        });

        if (!deletedRoom) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.status(200).json({ msg: 'Delete Room successfully', deletedRoom}); 
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

module.exports = {
    getRooms,
    getRoomById,
    getRoomsByApartment,
    getRoomsByAmenities,
    getRoomsByAttributes,
    createRoom: [validateRoom, createRoom],
    updateRoom: [validatePartialRoom, updateRoom],
    deleteRoom
};