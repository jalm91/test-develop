const fs = require('fs')
const path = require('path');
const { fileDataName, fileDataPath,
    defaultMinimumPercentCapacity, fuelFixedRate,
    employExpensive, employCheaper,
    largePrice, smallPrice } = require('../constants/constants')
const chalk = require('chalk');
const { throws } = require('assert');
const log = console.log;

const readFile = () => {
    try {
        const fullPathDataFile = path.join(__dirname, '../', fileDataPath, fileDataName);
        const dataBuffer = fs.readFileSync(fullPathDataFile);
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (err) {
        log(chalk.bold.red(`Error to get Input data ${err}`))
        throw err
    }
};
const getPriceOfParking = (vehicle) => {
    const size = { large: largePrice, small: smallPrice };
    return size[vehicle.size];
};

const getFuelPercentage = (capacity, level) => {
    try {
        if (capacity == 0) {
            throw new Error('Invalida Capacity')
        }
        const percentage = (level * 100) / capacity;
        return percentage;
    } catch (err) {
        log(chalk.bold.red(`Error on [getFuelPercentage][parking.js]. Capacity: ${capacity} Level: ${level}.`));
        throw err
    }
}

const getFuelToCompete = (capacity, level) => {
    let fueltoComplete = capacity - level;
    fueltoComplete = (fueltoComplete < 0) ? 0 : fueltoComplete;
    return fueltoComplete;
}

const getFuelToCompetePrice = (fuel) => {
    return fuel * fuelFixedRate
}
const fullPrice = (vehicle) => {
    const { capacity, level } = vehicle.fuel;
    const priceOfParking = getPriceOfParking(vehicle);
    const fuelPercentage = getFuelPercentage(capacity, level);
    let fuelAdded = 0;
    if (fuelPercentage <= defaultMinimumPercentCapacity) {
        fuelAdded = getFuelToCompete(capacity, level);
        const fuelToCompetePrice = getFuelToCompetePrice(fuelAdded);
        const price = fuelToCompetePrice + priceOfParking;
        return { fuelAdded, price };
    }
    return { fuelAdded, price: priceOfParking };
}

const sortVehiclesByPrice = (a, b) => {
    return (a.price > b.price) ? 1 : -1;
}

const splitToEmpoys = (vehicles) => {
    const vehiclesLength = vehicles.length
    const upPositionToSplit = Math.floor(vehiclesLength / 2);
    const vehiclesWithEmployee = [];
    for (let i = 0; i < vehiclesLength; i++) {
        const employee = (i < upPositionToSplit) ? employExpensive : employCheaper;
        const { licencePlate, fuelAdded, price } = vehicles[i]
        vehiclesWithEmployee.push({ licencePlate, employee, fuelAdded, price });
    }
    return vehiclesWithEmployee;
}


module.exports = {
    readFile,
    getPriceOfParking,
    getFuelPercentage,
    getFuelToCompete,
    getFuelToCompetePrice,
    fullPrice,
    sortVehiclesByPrice,
    splitToEmpoys,
}