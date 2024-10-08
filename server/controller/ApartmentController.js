const { PrismaClient } = require('@prisma/client');
const { validateApartment, validatePartialApartment } = require('../middlewares/SchemaMiddleware');

const prisma = new PrismaClient()


// get lastest apartments

const getApartments = async (req, res) => {
    try {
        const apartments = await prisma.apartment.findMany({
            include: {
                managers: {
                    include: {
                        user: {
                            select: {
                                email: true
                            }
                        }
                    }
                }
            },

            orderBy: {
                id: 'desc' // Sort by id in descending order
            },
            take: 5 // Limit to the last 5 largest apartments
        });

        if (!apartments || apartments.length === 0) {
            return res.status(404).json({ msg: 'No apartments found' });
        }

        // Map the results to include managerEmails
        const apartmentsWithManagerEmails = apartments.map(apartment => ({
            ...apartment,
            managerEmails: apartment.managers.map(manager => manager.user.email)
        }));

        res.status(200).json(apartmentsWithManagerEmails);

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }

}


const getAllApartments = async (req, res) => {
    try {
        const apartments = await prisma.apartment.findMany({
            include: {
                managers: {
                    include: {
                        user: {
                            select: {
                                email: true
                            }
                        }
                    }
                }
            },
        });

        if (!apartments || apartments.length === 0) {
            return res.status(404).json({ msg: 'No apartments found' });
        }

        // Map the results to include managerEmails
        const apartmentsWithManagerEmails = apartments.map(apartment => ({
            ...apartment,
            managerEmails: apartment.managers.map(manager => manager.user.email)
        }));

        res.status(200).json(apartmentsWithManagerEmails);

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }

}


// get ApartmentById
const getApartmentById = async (req, res) => {
    const { id } = req.params;
    try {
        if (isNaN(parseInt(id))) {
            return res.status(400).json({ msg: 'Apartment ID must be a valid number.' });
        }

        const apartment = await prisma.apartment.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                managers: {
                    include: {
                        user: {
                            select: {
                                email: true
                            }
                        }
                    }
                }
            }
        });

        if (!apartment) {
            return res.status(404).json({ msg: 'No apartment found' });
        }

        // Add managerEmails to the apartment object
        const apartmentWithManagerEmails = {
            ...apartment,
            managerEmails: apartment.managers.map(manager => manager.user.email)
        };

        res.status(200).json(apartmentWithManagerEmails);

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};



// get ApartmentByRoom
const getApartmentByRoom = async (req, res) => {
    const { roomId } = req.params;
    try {
        if (isNaN(parseInt(roomId))) {
            return res.status(400).json({ msg: 'Room ID must be a valid number.' });
        }

        const room = await prisma.room.findUnique(
            {
                where: {
                    id: parseInt(roomId),
                },
                include: {
                    apartment: {
                        include: {
                            managers: {
                                include: {
                                    user: {
                                        select: {
                                            email: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })

        if (!room || !room.apartment) {
            return res.status(404).json({ msg: `Apartment with roomID ${roomId} not found.` });
        }

        const apartmentWithManagerEmails = {
            ...room.apartment,
            managerEmails: room.apartment.managers.map(manager => manager.user.email)
        };

        res.status(200).json(apartmentWithManagerEmails);

    } catch (error) {
        res.status(500).json({ msg: error.message })
    }

}

// get ApartmentsByManager 
const getApartmentsByManager = async (req, res) => {
    const { userId } = req.params;

    try {
        if (isNaN(parseInt(userId))) {
            return res.status(400).json({ msg: 'Manager ID must be a valid number.' });
        }

        const managerWithApartments = await prisma.user.findUnique({
            where: {
                id: parseInt(userId),
            },
            include: {
                apartments: {
                    include: {
                        apartment: {
                            include: {
                                managers: {
                                    include: {
                                        user: {
                                            select: {
                                                email: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
            }
        });

        if (!managerWithApartments) {
            return res.status(404).json({ msg: `Manager with userId ${userId} not found.` });
        }

        const apartments = managerWithApartments.apartments.map(item => ({
            ...item.apartment,
            managerEmails: item.apartment.managers.map(manager => manager.user.email)
        }));

        res.status(200).json(apartments);

    } catch (error) {
        res.status(500).json({ msg: error.message })
    }

}


// create Apartment
const createApartment = async (req, res) => {
    const { address, name, description, zipCode, contact_email, contact_phone } = req.body

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
        res.status(201).json({ msg: 'Create Apartment successfully', createdApartment })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

// create ManageApartment 

const createManageApartment = async (req, res) => {
    const { apartmentId, userId } = req.body

    try {
        if (isNaN(apartmentId) || isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid ApartmentId or UserId' });
        }
        const createdManageApartment = await prisma.manageApartment.create({
            data: {
                userId,
                apartmentId
            },
        })
        res.status(201).json({ msg: 'Create Manage-Apartment relation successfully', createdManageApartment })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}



// update Apartment
const updateApartment = async (req, res) => {
    const id = req.params.id;
    const idInt = parseInt(id);
    const { description, contact_email, contact_phone } = req.body

    try {

        if (isNaN(idInt) || idInt <= 0) {
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
        res.status(200).json({ msg: 'Apartment updated successfully', updatedApartment })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

// delete Apartment
const deleteApartment = async (req, res) => {
    const id = req.params.id;
    const idInt = parseInt(id);

    try {

        if (isNaN(idInt) || idInt <= 0) {
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
        res.status(200).json({ msg: 'Delete Apartment successfully', deletedApartment });
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

// deleteManageApartment 
const deleteManageApartment = async (req, res) => {
    const { apartmentId, userId } = req.body

    try {

        if (isNaN(apartmentId) || isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid ApartmentId or UserId' });
        }

        const deletedManageApartment = await prisma.manageApartment.delete({
            where: {
                userId_apartmentId: {
                    apartmentId,
                    userId
                }
            },
        });

        if (!deletedManageApartment) {
            return res.status(404).json({ error: 'Manage-Apartment relation not found' });
        }
        res.status(200).json({ msg: 'Delete Manage-Apartment relation successfully', deletedManageApartment });
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

// 
const deleteAllManagersByApartment = async (req, res) => {
    const { apartmentId} = req.body

    try {

        if (isNaN(apartmentId)) {
            return res.status(400).json({ error: 'Invalid ApartmentId' });
        }

        const deletedManageApartments = await prisma.manageApartment.deleteMany({
            where: {
                apartmentId    
                
            },
        });

        if (!deletedManageApartments) {
            return res.status(404).json({ error: 'Manage-Apartment relation not found' });
        }
        res.status(200).json({ msg: 'Delete Manage-Apartment relation successfully', deletedManageApartments });
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


module.exports = {
    getApartments,
    getAllApartments,
    getApartmentById,
    getApartmentByRoom,
    getApartmentsByManager,
    createApartment: [validateApartment, createApartment],
    updateApartment: [validatePartialApartment, updateApartment],
    deleteApartment,
    createManageApartment,
    deleteManageApartment,
    deleteAllManagersByApartment
};