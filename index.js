const yargs = require('yargs');
const app = require('./lib/parking');
const chalk = require('chalk');
const log = console.log;
const merge = () => {
    try {
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
        log(chalk.green("Vehicles and parking...."))
        vehiclesWithEmployee.forEach(vehicle => { 
            log(vehicle)
        })

    } catch (err) {
        log(chalk.bold.red(err))
    }
}

yargs.command({
    command: 'parking',
    describe: 'run the cli application',
    handler() {
        merge()
    }
})

yargs.parse();