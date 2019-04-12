var cron = require('node-cron');
var userControl = require('./../controller/userControl')
class CronJob {

    constructor() {
        var pointsObj = new Object()
    }

    cronJobs() {
        // cron.schedule('0 0 * * *',async function () {
        //    console.log("Today Scores will be formatted")
        //     this.pointsObj = {todayScore:0}
        //     const zeroRes = await Promise.resolve(
        //         userControl.zeroPoints(this.pointsObj)
        //     )
        //     console.log(zeroRes)
        // },  undefined, true, "America/New_Work");

        // cron.schedule('0 0 * * 0',async function () {
        //     console.log('This Week Scores will be formatted')
        //     this.pointsObj = {thisWeekScore:0}
        //     const zeroRes = await Promise.resolve(
        //         userControl.zeroPoints(this.pointsObj)
        //     )
        //     console.log(zeroRes)         
        // }, {
        //     scheduled: true,
        //     timezone: "America/Sao_Paulo"
        // });

        // cron.schedule('0 0 30 * *',async function () {
        //     console.log('This Month Scores will be formatted')
        //     this.pointsObj = {thisMonthScore:0}
        //     const zeroRes = await Promise.resolve(
        //         userControl.zeroPoints(this.pointsObj)
        //     )
        //     console.log(zeroRes)         
        // }, {
        //     scheduled: true,
        //     timezone: "America/Sao_Paulo"
        // });

        // cron.schedule('0 0 31 12 *',async function () {
        //     console.log('This Year Scores will be formatted')
        //     this.pointsObj = {thisYearScore:0}
        //     const zeroRes = await Promise.resolve(
        //         userControl.zeroPoints(this.pointsObj)
        //     )
        //     console.log(zeroRes)         
        // }, {
        //     scheduled: true,
        //     timezone: "America/Sao_Paulo"
        // });
        cron.schedule('* * * * *', async function () {
            console.log('Token refresh every minute');
            userControl.refreshToken();
            // this.pointsObj = {thisYearScore:0}
            // const zeroRes = await Promise.resolve(
            //     userControl.zeroPoints(this.pointsObj)
            // )
            // console.log(zeroRes)         
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
