const app = require('./app');

const merge = () => {
    const vehicles = app.readFile();
    const vehiclesWithPriceRaw = vehicles.map(vehicle => {
        const { licencePlate } = vehicle;
        const priceService = app.fullPrice(vehicle);
        return {
            licencePlate,
            employee: '',
            ...priceService,
        }
    });
    vehiclesWithPriceRaw.sort(app.sortVehiclesByPrice);
    app.splitToEmpoys(vehiclesWithPriceRaw);
    console.log(vehiclesWithPriceRaw)

}

merge()