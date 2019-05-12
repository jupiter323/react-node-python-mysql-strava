var cron = require('node-cron');
var userControl = require('./../controller/userControl')
class CronJob {

    constructor() {
        var pointsObj = new Object()
    }

    cronJobs() {
        cron.schedule('* * * * *', async () => {
            const refresh = await Promise.resolve(
                userControl.refreshToken()
            )
            console.log('Token refresh every minute', refresh);
        }, {
                scheduled: true,
                timezone: "America/Sao_Paulo"
            });

    }

    cronjobConfig() {
        this.cronJobs();
    }
}
module.exports = CronJob;
