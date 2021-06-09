const fs = require('fs');
jest.mock('fs');
const { fileDataName, fileDataPath,
    defaultMinimumPercentCapacity, fuelFixedRate,
    employExpensive, employCheaper,
    largePrice, smallPrice } = require('../constants/constants')

const { getFuelPercentage, getFuelToCompete,
    getPriceOfParking, getFuelToCompetePrice,
    sortVehiclesByPrice, splitToEmpoys,
    readFile, fullPrice,
} = require('../lib/parking');


test('getPriceOfParking price of parking small vehicles sould be 25', () => {
    const vehicle = { size: 'small' };
    expect(getPriceOfParking(vehicle)).toBe(smallPrice)
})

test('getPriceOfParking price of parking small vehicles sould be 35', () => {
    const vehicle = { size: 'large' };
    expect(getPriceOfParking(vehicle)).toBe(largePrice)
})

test('getFuelPercentage 100 capacity and 10 level should be 10 percent', () => {
    expect(getFuelPercentage(100, 10)).toBe(10);
})

test('getFuelPercentage when 0 capacity', () => {
    const error = new Error('Invalida Capacity')
    const functionWithError = () => {
        getFuelPercentage(0, 10)
    }
    expect(functionWithError).toThrowError('Invalida Capacity');
})

test('getFuelToCompete 65 fuel and 10 level should be 55 ', () => {
    expect(getFuelToCompete(65, 10)).toBe(55);
})

test('getFuelToCompete when is less than 0 should be 0 ', () => {
    expect(getFuelToCompete(65, 100)).toBe(0);
})

test('getFuelToCompete when the capacity is equal to level ', () => {
    expect(getFuelToCompete(10, 10)).toBe(0);
})

test('getFuelToCompetePrice to 10 fuel should be 17.5', () => {
    expect(getFuelToCompetePrice(10)).toBe(17.5);
})

test('Should be return an array sorted', () => {
    const vehicles = [{
        licencePlate: 'E',
        employee: 'A',
        fuelAdded: 93.8,
        price: 199.15
    }, {
        licencePlate: 'D',
        employee: 'A',
        fuelAdded: 78.07,
        price: 171.6225
    }]
    const sortedVehicles = [
        {
            licencePlate: 'D',
            employee: 'A',
            fuelAdded: 78.07,
            price: 171.6225
        }, {
            licencePlate: 'E',
            employee: 'A',
            fuelAdded: 93.8,
            price: 199.15
        }
    ]
    expect(vehicles.sort(sortVehiclesByPrice)).toStrictEqual(sortedVehicles);
})

test('Sould be split To Employs equal', () => {
    const vehiclesWithoutEmployee = [
        {
            licencePlate: 'D',
            fuelAdded: 78.07,
            price: 171.6225
        }, {
            licencePlate: 'E',
            fuelAdded: 93.8,
            price: 199.15
        }
    ]
    const vehiclesWithEmployee = [
        {
            licencePlate: 'D',
            employee: 'B',
            fuelAdded: 78.07,
            price: 171.6225
        }, {
            licencePlate: 'E',
            employee: 'A',
            fuelAdded: 93.8,
            price: 199.15
        }
    ]
    expect(splitToEmpoys(vehiclesWithoutEmployee)).toStrictEqual(vehiclesWithEmployee);
})

test('Sould be split To Minimal Cost', () => {
    const vehiclesWithoutEmployee = [
        {
            licencePlate: 'A',
            fuelAdded: 10,
            price: 42.5
        }, {
            licencePlate: 'B',
            fuelAdded: 20,
            price: 70
        },
        {
            licencePlate: 'C',
            fuelAdded: 15,
            price: 51.25
        }
    ]
    const vehiclesWithEmployee = [
        {
            employee: 'B',
            licencePlate: 'A',
            fuelAdded: 10,
            price: 42.5
        },
        {
            employee: 'A',
            licencePlate: 'C',
            fuelAdded: 15,
            price: 51.25
        },
        {
            employee: 'A',
            licencePlate: 'B',
            fuelAdded: 20,
            price: 70
        },
    ]
    vehiclesWithoutEmployee.sort(sortVehiclesByPrice)
    expect(splitToEmpoys(vehiclesWithoutEmployee)).toStrictEqual(vehiclesWithEmployee);
})

test('fullPrice to large size with less than 10 percentaje of level', () => {
    const vehicle = {
        licencePlate: "A",
        size: "large",
        fuel: {
            capacity: 10,
            level: 0.01
        }
    };
    const fuelAdded = (vehicle.fuel.capacity - vehicle.fuel.level);
    const price = fuelAdded * fuelFixedRate + largePrice;
    const expectedPrice = { fuelAdded, price };
    expect(fullPrice(vehicle)).toStrictEqual(expectedPrice);
})

test('fullPrice to large size with more than 10 percentaje of level', () => {
    const vehicle = {
        licencePlate: "A",
        size: "large",
        fuel: {
            capacity: 10,
            level: 2
        }
    };
    const fuelAdded = 0;
    const price = largePrice;
    const expectedPrice = { fuelAdded, price };
    expect(fullPrice(vehicle)).toStrictEqual(expectedPrice);
})

test('fullPrice to small size with less than 10 percentaje of level', () => {
    const vehicle = {
        licencePlate: "A",
        size: "small",
        fuel: {
            capacity: 10,
            level: 0.01
        }
    };
    const fuelAdded = (vehicle.fuel.capacity - vehicle.fuel.level);
    const price = fuelAdded * fuelFixedRate + smallPrice;
    const expectedPrice = { fuelAdded, price };
    expect(fullPrice(vehicle)).toStrictEqual(expectedPrice);
})

test('fullPrice to small size with more than 10 percentaje of level', () => {
    const vehicle = {
        licencePlate: "A",
        size: "small",
        fuel: {
            capacity: 10,
            level: 2
        }
    };
    const fuelAdded = 0;
    const price = smallPrice;
    const expectedPrice = { fuelAdded, price };
    expect(fullPrice(vehicle)).toStrictEqual(expectedPrice);
})

test('should be return a readFile', () => {

    const vehicles = [
        {
            "licencePlate": "A",
            "size": "large",
            "fuel": {
                "capacity": 57,
                "level": 0.07
            }
        },
        {
            "licencePlate": "B",
            "size": "large",
            "fuel": {
                "capacity": 66,
                "level": 0.59
            }
        }];
    const vehiclesToString = JSON.stringify(vehicles);
    const vehiclesBuffer = Buffer.from(vehiclesToString)
    fs.readFileSync.mockImplementation(() => vehiclesBuffer)
    expect(readFile()).toEqual(vehicles);
})

test('should be control an error inside readFile function', () => {

    const vehicles = [
        {
            "licencePlate": "A",
            "size": "large",
            "fuel": {
                "capacity": 57,
                "level": 0.07
            }
        },
        {
            "licencePlate": "B",
            "size": "large",
            "fuel": {
                "capacity": 66,
                "level": 0.59
            }
        }];
    const vehiclesToString = JSON.stringify(vehicles);
    const errMock = new Error('Controled error');
    fs.readFileSync.mockImplementation(() => errMock)
    const funcWithErr = () => {
        readFile()
    }
    expect(funcWithErr).toThrowError();
})