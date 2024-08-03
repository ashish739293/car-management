const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// Get all cars
router.get('/', async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cars' });
    }
});

// Add a new car
router.post('/', async (req, res) => {
    const { carName, manufacturingYear, price } = req.body;
    try {
        const newCar = new Car({ carName, manufacturingYear, price });
        await newCar.save();
        res.status(201).json(newCar);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add car' });
    }
});

// Update a car by ID
router.put('/:id', async (req, res) => {
    const { carName, manufacturingYear, price } = req.body;
    try {
        const updatedCar = await Car.findByIdAndUpdate(
            req.params.id,
            { carName, manufacturingYear, price },
            { new: true }
        );
        res.json(updatedCar);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update car' });
    }
});

// Delete a car by ID
router.delete('/:id', async (req, res) => {
    try {
        await Car.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete car' });
    }
});

module.exports = router;
