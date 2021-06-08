const app = require('./app');

const merge = () => {
    const vehicles = app.readFile();
    const vehiclesWithPriceRaw = vehicles.map(vehicle => {
        const { licencePlate } = vehicle;
        const priceService = app.fullPrice(vehicle);
        return {
            licencePlate,
            ...priceService,
        }
    });
    vehiclesWithPriceRaw.sort(app.sortVehiclesByPrice);
    const vehiclesWithEmployee = app.splitToEmpoys(vehiclesWithPriceRaw);
    console.log(vehiclesWithEmployee)

}

merge()