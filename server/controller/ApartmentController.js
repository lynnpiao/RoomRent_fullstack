const { PrismaClient } = require('@prisma/client');
const { validateApartment, validatePartialApartment } = require('../middlewares/SchemaMiddleware');

const prisma = new PrismaClient()

// get ApartmentByRoom
const getApartmentByRoom = async(req, res)=>{
    const { roomId } = req.params;
    try {
        if (isNaN(parseInt(roomId))) {
            return res.status(400).json({ msg: 'Room ID must be a valid number.' });
          }

        const room = await prisma.room.findUnique(
            {
            where:{
                id: parseInt(roomId),
            },
            include: {
                apartment:true,
            }
        })
        if (!room){
            return res.status(404).json({ msg: `Apartment with roomID ${roomId} not found.`});
        }
        res.status(200).json(room.apartment)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }

}

// get ApartmentsByManager 
const getApartmentsByManager = async(req, res)=>{
    const { managerId } = req.params;

    try {
        if (isNaN(parseInt(managerId))) {
            return res.status(400).json({ msg: 'Manager ID must be a valid number.' });
          }

        const managerWithApartments = await prisma.manager.findUnique(
            {
            where:{
                id: parseInt(managerId),
            },
            include: {
                apartments: {
                  include: {
                    apartment: true, // This includes the related apartment details
                  },
                },
              },
        })
        if (!managerWithApartments){
            return res.status(404).json({ msg: `Apartment with managerID ${managerId} not found.`});
        }
        const apartments = managerWithApartments.apartments.map(item => item.apartment);
        res.status(200).json(apartments)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }

}


// create Apartment
const createApartment = async (req, res) => {
    const {address, name, description, zipCode, contact_email, contact_phone} = req.body

    try {
        const createdApartment = await prisma.apartment.create({
            data: {
                address,
                name,
                description,
                zipCode: zipCode || null,
                contact_email,
                contact_phone: contact_phone || null
            },
        })
        res.status(201).json({ msg: 'Create Apartment successfully', createdApartment})
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

// update Apartment
const updateApartment = async (req, res) => {
    const id = req.params.id;
    const idInt = parseInt(id);
    const {description, contact_email, contact_phone} = req.body

    try {

        if (isNaN(idInt) || idInt <= 0 ) {
            return res.status(400).json({ error: 'Invalid ApartmentId' });
        }

        const updatedApartment = await prisma.apartment.update({
            where: {
                    id: idInt,
            },
            data: {
                description,
                contact_email,
                contact_phone: contact_phone || null
            },
        })
        res.status(200).json({ msg: 'Apartment updated successfully', updatedApartment})
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

// delete Apartment
const deleteApartment = async (req, res) => {
    const id = req.params.id;
    const idInt = parseInt(id);

    try {

        if (isNaN(idInt) || idInt <= 0 ) {
            return res.status(400).json({ error: 'Invalid ApartmentId' });
        }

        const deletedApartment = await prisma.apartment.delete({
            where: {
                id: idInt,
            },
        });

        if (!deletedApartment) {
            return res.status(404).json({ error: 'Apartment not found' });
        }
        res.status(200).json({ msg: 'Delete Apartment successfully', deletedApartment}); 
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

module.exports = {
    getApartmentByRoom,
    getApartmentsByManager,
    createApartment: [validateApartment, createApartment],
    updateApartment: [validatePartialApartment, updateApartment],
    deleteApartment
};