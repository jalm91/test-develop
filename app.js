const fs = require('fs')
const path = require('path');
const { fileDataName, fileDataPath,
    defaultMinimumPercentCapacity, fuelFixedRate,
    employExpensive, employCheaper } = require('./constants/constants')


const readFile = () => {
    try {
        const fullPathDataFile = path.join('./', fileDataPath, fileDataName);
        const dataBuffer = fs.readFileSync(fullPathDataFile);
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (e) {
        return []
    }
};
const getPriceOfParking = (vehicle) => {
    const size = { large: 35, small: 25 };
    return size[vehicle.size];
};

const merge = () => {
    const vehicles = readFile();
    const vehiclesWithPriceRaw = vehicles.map(vehicle => {
        const { licencePlate } = vehicle;
        const priceService = fullPrice(vehicle);
        return {
            licencePlate,
            employee: '',
            ...priceService,
        }
    });
    vehiclesWithPriceRaw.sort(sortVehiclesByPrice);
    splitToEmpoys(vehiclesWithPriceRaw);
    console.log(vehiclesWithPriceRaw)

}

const getFuelPercentage = (capacity, level) => {
    const percentage = (level * 100) / capacity;
    return percentage;
}

const getFuelToCompete = (capacity, level) => {
    return capacity - level;
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
    return a.price > b.price;
}

const splitToEmpoys = (vehicles) => {
    const vehiclesLength = vehicles.length
    const upPositionToSplit = Math.floor(vehiclesLength / 2);
    for (let i = 0; i < vehiclesLength; i++) {
        vehicles[i].employee = (i < upPositionToSplit) ? employExpensive : employCheaper;
    }
}

merge();