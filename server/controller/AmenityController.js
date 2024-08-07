const { PrismaClient } = require('@prisma/client');
const { validateAmenity, validateApartmentAmenities, validateRoomAmenities } = require('../middlewares/SchemaMiddleware')
const prisma = new PrismaClient();
const Joi = require('joi');


// get AllAmenities
const getAmenities = async (req, res) => {
    const {category} = req.body
    console.log("Category received:", category);

    try {
        const amenities = await prisma.amenity.findMany({
            where: { category }
        })

        if (amenities.length === 0) {
            return res.status(404).json({ msg: 'No amenities found' });
        }
        res.status(200).json(amenities)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

// get AmenitiesByApartment
const getAmenitiesByApartment = async (req, res) => {
    const { apartmentId } = req.params;

    try {
        // Validate apartmentId is a number
        if (isNaN(parseInt(apartmentId))) {
            return res.status(400).json({ msg: 'Apartment ID must be a valid number.' });
        }

        const amenities = await prisma.apartmentAmenity.findMany({
            where: {
                apartmentId: parseInt(apartmentId),
            },
            include: {
                amenity: true,
            },
        });

        if (!amenities || amenities.length === 0) {
            return res.status(404).json({ msg: `No amenities found for Apartment ID ${apartmentId}.` });
        }

        // Extract only the amenity details
        const amenityDetails = amenities.map(item => item.amenity);

        res.status(200).json(amenityDetails);
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error.' });
    }

}
// get AmenitiesByRoom
const getAmenitiesByRoom = async (req, res) => {
    const { roomId } = req.params;

    try {
        // Validate roomId is a number
        if (isNaN(parseInt(roomId))) {
            return res.status(400).json({ msg: 'Room ID must be a valid number.' });
        }

        const amenities = await prisma.roomAmenity.findMany({
            where: {
                roomId: parseInt(roomId),
            },
            include: {
                amenity: true,
            },
        });

        if (!amenities || amenities.length === 0) {
            return res.status(404).json({ msg: `No amenities found for Room ID ${roomId}.` });
        }

        // Extract only the amenity details
        const amenityDetails = amenities.map(item => item.amenity);

        res.status(200).json(amenityDetails);
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ msg: 'Internal server error.' });
    }
};


// create Amenity
const createAmenity = async (req, res) => {
    const { name, category } = req.body

    try {
        // Validate amenity array
        if (typeof name !== 'string' || name.trim() === '' || typeof category !== 'string' || category.trim() === '') {
            return res.status(400).json({ msg: 'Name and category info must be provided' });
        }
        

        // Create amenity in the database
        const createdAmenity = await prisma.amenity.create({
            data: {
                name,
                category
            },
        });

        res.status(201).json({ msg: 'Amenity created successfully.',createdAmenity });
    } catch (error) {
        res.status(500).json({ msg: 'Failed to create amenity.', error: error.message });
    }
};


// create AmenitiesByApartment
const createAmenitiesByApartment = async (req, res) => {
    const { apartmentId } = req.params
    const apartmentAmenities = req.body
    try {
        if (isNaN(parseInt(apartmentId))) {
            return res.status(400).json({ msg: 'Apartment ID must be a valid number.' });
        }

        if (!Array.isArray(apartmentAmenities) || apartmentAmenities.length === 0) {
            return res.status(400).json({ msg: 'Amenities must be provided as a non-empty array.' });
        }

        // Create an array of objects to pass to createMany
        const data = apartmentAmenities.map(amenityId => ({
            apartmentId: parseInt(apartmentId),
            amenityId: parseInt(amenityId),
        }));

        const createdApartmentAmenities = await prisma.apartmentAmenity.createMany({
            data: data,
        })
        res.status(201).json({ msg: 'Apartment amenities created successfully.', apartmentAmenities: createdApartmentAmenities });

    } catch (error) {
        res.status(500).json({ msg: `Failed to create amenities for apartmentID. ${apartmentId}.`, error: error.message });
    }
}


// create AmenitiesByRoom
const createAmenitiesByRoom = async (req, res) => {
    const { roomId } = req.params
    const roomAmenities = req.body

    console.log('Room Id received', roomId);
    console.log('Room Amenity Ids received', roomAmenities);

    try {
        if (isNaN(parseInt(roomId))) {
            return res.status(400).json({ msg: 'Room ID must be a valid number.' });
        }

        if (!Array.isArray(roomAmenities) || roomAmenities.length === 0) {
            return res.status(400).json({ msg: 'Amenities must be provided as a non-empty array.' });
        }

        // Create an array of objects to pass to createMany
        const data = roomAmenities.map(id => ({
            roomId: parseInt(roomId),
            amenityId: parseInt(id),
        }));

        const createdRoomAmenities = await prisma.roomAmenity.createMany({
            data: data,
        })
        res.status(201).json({ msg: 'Room amenities created successfully.', roomAmenities: createdRoomAmenities });

    } catch (error) {
        res.status(500).json({ msg: `Failed to create amenities for roomID. ${roomId}.`, error: error.message });
    }
}


// delete Amenity
const deleteAmenity = async (req, res) => {

    const id = req.params.id;
    const idInt = parseInt(id);

    try {
        if (isNaN(idInt)|| idInt<0) {
            return res.status(400).json({ msg: 'Invalid Amenity Id' });
        }

        const deleteAmenity = await prisma.amenity.delete({
            where: {
                id:idInt
            },
        });

        if (!deleteAmenity) {
            return res.status(404).json({ error: 'Amenity not found' });
        }
        res.status(200).json({ msg: 'Delete Amenity successfully', deleteAmenity });
    } catch (error) {
        res.status(500).json({ msg: 'Failed to delete amenity', error: error.message });
    }
}


// delete AmenityByApartment
const deleteAmenityByApartment = async (req, res) => {
    const { apartmentId, amenityId } = req.params
    try {
        if (isNaN(parseInt(apartmentId)) || isNaN(parseInt(amenityId))) {
            return res.status(400).json({ msg: 'Apartment ID and Amenity ID must be a valid number.' });
        }

        const deleteAmenity = await prisma.apartmentAmenity.delete({
            where: {
                apartmentId_amenityId: {
                    apartmentId: parseInt(apartmentId),
                    amenityId: parseInt(amenityId),
                },
            },
        });
        res.status(200).json({ msg: 'Delete Amenities successfully', deleteAmenity });
    } catch (error) {
        res.status(500).json({ msg: `Failed to delete amenity ${amenityId} from apartment ${apartmentId}`, error: error.message });
    }
}
// delete AmenityByRoom

const deleteAmenityByRoom = async (req, res) => {
    const { roomId, amenityId } = req.params
    try {
        if (isNaN(parseInt(roomId)) || isNaN(parseInt(amenityId))) {
            return res.status(400).json({ msg: 'Room ID and Amenity ID must be a valid number.' });
        }

        const deleteAmenity = await prisma.roomAmenity.delete({
            where: {
                roomId_amenityId: {
                    roomId: parseInt(roomId),
                    amenityId: parseInt(amenityId),
                },
            },
        });
        res.status(200).json({ msg: 'Delete Amenities successfully', deleteAmenity });
    } catch (error) {
        res.status(500).json({ msg: `Failed to delete amenity ${amenityId} from room ${roomId}`, error: error.message });
    }
}


module.exports = {
    getAmenities,
    getAmenitiesByApartment,
    getAmenitiesByRoom,
    createAmenity: [validateAmenity, createAmenity],
    createAmenitiesByApartment: [validateApartmentAmenities, createAmenitiesByApartment],
    createAmenitiesByRoom: [validateRoomAmenities, createAmenitiesByRoom],
    deleteAmenity,
    deleteAmenityByApartment,
    deleteAmenityByRoom
}