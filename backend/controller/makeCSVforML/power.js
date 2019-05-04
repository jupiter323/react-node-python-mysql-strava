// Copyright (c) j.c. jansen klomp. All rights reserved.

/*
P(total) = P(rolling resistance) + P(wind) + P(gravity) + P(acceleration)

P(rolling resistance)
The power required to overcome rolling resistance can be described by the formula P = Crr x N x v, where

P is the power required (W).
Crr is the rolling resistance coefficient. We define this based on the type of bike (road, mtb, cross) you used. (0.01)
N is the normal force of the bike and the athlete against gravity (N).
v is the rider velocity (m/s).
For more information about rolling resistance, see http://en.wikipedia.org/wiki/Rolling_resistance.

Example: v=36km/h, weight=80kg, crr=0.008
P =  36/3.6 * 80 * 9.8 * 0.008 = 62.7 W

Testresult on https://www.bicyclerollingresistance.com/road-bike-reviews/schwalbe-durano-2015
Schwalbe durano (4.1 bar, 29km/h, 42.5kg): P= 29/3.6 * 42.5 * 9.81 * crr = 24.7W  --> crr = 24.7/(29/3.6 * 42.5 * 9.81) = 0.0074
Schwalbe durano (5.5 bar, 29km/h, 42.5kg): P= 29/3.6 * 42.5 * 9.81 * crr = 21W    --> crr = 21/(29/3.6 * 42.5 * 9.81)   = 0.0063
Schwalbe durano (8.3 bar, 29km/h, 42.5kg): P= 29/3.6 * 42.5 * 9.81 * crr = 18W    --> crr = 18/(29/3.6 * 42.5 * 9.81)   = 0.0054

P(wind)
The power required to overcome wind resistance (drag) can be described by the formula P = 0.5 x ρ x v3 x Cd x A, where

P is the power required.
ρ is the density of air.
v is the rider velocity, relative to the wind.
Cd is the drag coefficient.
A is the the surface area of the rider facing the wind.
Because we do not know wind speed or air density during your ride, we assume no environmental wind conditions and an outside temperature of 15C. The drag coefficient is determined by the type of bike you are riding (TT bikes have less drag than mountain bikes). We use a constant for surface area.
 
For more information about wind drag, see http://en.wikipedia.org/wiki/Drag_(physics)

P(gravity)
The power required to overcome the pull of gravity while riding up an incline can be described by the formula P = m x g x sin(arctan(grade)) x v, where

P is the power required.
m is the mass of the rider and the bicycle.
g is the gravitational constant, 9.8.
grade is the slope of the hill.


P(acceleration)
The power required to accelerate from one speed to another within a ride sampling window can be described the the formula P = m x a x v, where
P is the power required.
m is the mass of the rider and the bicycle.
a is the acceleration between your starting speed and your ending speed within the sampling window.

*/

// http://www.tribology-abc.com/calculators/cycling.htm

/*
Speed	20  km/hr	 
Cycling time t	60  min
Weight of cyclist 75  kg
Weight of the bicycle 15  kg
Rolling resistance coefficient Cr 0.005
Air resistance coefficient Cw	0.9
Frontal surface area Af	0.6 m2
Uphill slope k	3%
 
Cw·Af 0.54  m2
Air resistance Fair = ½ ρ v2 Cw Af	10.8 N
Rolling resistance Frol = mtot g Cr	4.4 N
Force for climbing Fclimb = mtot g sinφ	26.5 N
Energy per minute E = Ftot v t, t=60 s 13.9 kJ/min 3.3 kcal/min
Energy "burned" per minute 67.3 kJ/min 16.1 kcal/min
Efficiency of the cyclist 20.6 %	 
Driving power P = F v	231 W	 
Energy delivered E = P t 833 kJ 199 kcal
Energy consumed (burned) 1) 4041 kJ	964 kcal
1) The energy burned is approached using reference tables of different web sites like source1. Reference values are correlated to the energy delivered by cycling.
2) The dimension kcal (1 kcal=4.19 kJ) is the old dimension for Joules.
3) The energy delivered by the muscles is small compared to the energy burned, only 12.5% with a cycling speed of 20 km/h and 20% at 30 km/hr.
4) In comparison, the efficiency of a large electric powered motor is about 90%, of a diesel engine 40% and a petrol engine 25%. In the calculation of the efficiency of an electric powered motor one should consider the efficiency of power stations that transform fossil fuels in electricity. The efficiency of a coal power plant is about 40%, that of a gas power plant 45%. This actually reduces the efficiency of an electric powered motor to 0.45 0.9 = 40%, not more than that of a diesel engine.
www.engineering-abc.com
*/

/*
relatieve wind
- α (azimuth) is de richting waarin de fietser rijdt met snelheid v 
- β (bearing) is de richting waar de wind vandaan komt met snelheid w.
- de richting wordt opgegeven als een hoek van 0-360 graden, met 0 graden = N
De relatieve snelheid v': v' = v + w cos(α-β) 
Bij wind tegen is α-β = 0 en is v' = v + w
Bij wind mee is  α-β = 180 en is v' = v - w
*/

/*
function solve(form){
    v = eval(form.v.value)/3.6;
    T = eval(form.T.value)*60;
    Cw = eval(form.Cw.value);
    Af = eval(form.Af.value);
    Cr = eval(form.Cr.value);
    mp = eval(form.mp.value);
    mf = eval(form.mf.value);
    helling = eval(form.helling.value)/100;

    CwAf = Cw*Af;
    Flucht=0.5*1.29*v*v*Cw*Af;
    Frol = (mp+mf)*9.81*Cr;

    phi = Math.atan(helling);
    Fklim=(mp+mf)*9.81*Math.sin(phi);

    P = (Frol+Flucht+Fklim)*v;
    E_kJ = P*T/1000;
    E_kcal = E_kJ/4.19;
    E_min = P*60/1000;
    E_minc = E_min/4.19;

    k=-1.24*Math.pow(10,-5)*P*P+0.039*P+4.5;
    E_min2c = k*mp/60;
    E_min2 = E_min2c*4.19;
    E_kcal2=E_min2c*T/60;
    E_kJ2=E_kcal2*4.19;
}
*/

// density air vs temperature
// 0 C  = 1.2922
// 35 C = 1.1455
// d = 1.2922 - T * (1.2922 - 1.1455) / 35 = 1.2922 - T * 0.004191

// desity air vs altitude
// 0 m  = 1.2922
// 2000 m = 1.0203
// d = 1.2922 - alt * (1.2922 - 1.0203) / 2000 = 1.2922 - alt * 0.000136



function calcEnergy(params, time, dist, eledif, azimuth, bearing, windspeed, temperature, altitude){ 
    // time in s, dist in m, eledif in m, azimuth in deg, bearing in deg, windspeed in m/s
    let mass=params.gewicht              // 85kg
    let cw = params.airresistance        // 0.7   // Air resistance coefficient // 0.9
    let af = params.surfacearea          // 0.5   // surface area (m2)  // 0.6
    let crr = params.rollingresistance   // 0.006 // Rolling resistance coefficient
    let v = dist / time                  // (m/s)
    let vrel = v + windspeed * Math.cos((bearing-azimuth)* Math.PI / 180)
    let density = 1.2922 - temperature * 0.004191 - altitude * 0.000136
    let f_air = 0.5 * density * vrel * vrel * cw * af;  // (N) density air = 1.29 kg/m3 // P = 0.5 * rho * cw * vrel^2 * v
    let f_rol = mass * 9.81 * crr;       // (N)
    let phi = Math.atan(eledif/dist);
    //let f_slope=mass * 9.81 * Math.sin(phi); // (N)
    //let p = (f_rol + f_air + f_slope) * v; // (W)
    //let energ1 = p * time // (J)
    let epot = mass * 9.81 * eledif // potential energy
    let p = (f_rol + f_air) * v // (W)
    let energ2 = p * time // + epot // (J)
    return energ2
}

function accelerationPower(params, v1, v2, time){ // v1 and v2 in m/s, time in sec
    return 0.5 * params.gewicht * (v2 * v2 - v1 * v1) / time 
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//                           Calculation of Functional Threshold Power 
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////

function calcFTP(segments, slottime, movingavgtime, corfac){ // times in second units
    let timeslots = []
    let buffer = {time:0,energy:0,calcenergy:0}
    for (var i=0; i < segments.length; i++){
        let segment = segments[i]
        buffer.time += segment.time
        buffer.energy += segment.energy
        buffer.calcenergy += segment.calcenergy
        while (buffer.time > slottime){
            let slot = {}
            slot.time = slottime;
            slot.energy  = buffer.energy * slottime/buffer.time
            slot.power4 = Math.pow(slot.energy / slot.time,4)
            slot.calcenergy = buffer.calcenergy * slottime/buffer.time
            slot.calcpower4 = Math.pow(slot.calcenergy / slot.time,4)
            slot.timestamp = segment.gpxtimestamp
            timeslots.push(slot)
            buffer.time -= slottime
            buffer.energy -= slot.energy
            buffer.calcenergy -= slot.calcenergy
        }
    }

    // normalized power

    var normpower = 0
    var normcalcpower = 0

    if (timeslots.length > 0) {
        var sum1 = 0;
        var sum2 = 0;
        for (var i=0; i < timeslots.length; i++){
            sum1 += timeslots[i].power4
            sum2 += timeslots[i].calcpower4
        }
        normpower = Math.round(Math.pow(sum1 / timeslots.length, 0.25))
        normcalcpower = Math.round(Math.pow(sum2 / timeslots.length, 0.25))
    }

    // max moving average
        
    var maxavg = 0
    var maxavgcalc = 0

    var sum1 = 0
    var sum2 = 0
    let avgcount = movingavgtime / slottime 

    if (avgcount < timeslots.length) {
        for (var i = 0; i < avgcount; i++ ) {
            sum1 += timeslots[i].energy
            sum2 += timeslots[i].calcenergy
            timeslots[i].avgenergy = 0
            timeslots[i].avgcalcenergy = 0
        }

        for (var i = avgcount; i < timeslots.length; i++){
            var value = sum1 / avgcount
            if (value > maxavg) maxavg = value
            timeslots[i].avgenergy = value
            value = sum2 / avgcount
            if (value > maxavgcalc) maxavgcalc = value
            timeslots[i].avgcalcenergy = value 

            sum1 -= timeslots[i-avgcount].energy
            sum2 -= timeslots[i-avgcount].calcenergy 
            sum1 += timeslots[i].energy
            sum2 += timeslots[i].calcenergy 
        }
        
        value = sum1 / avgcount
        if (value > maxavg) maxavg = value  
        value = sum2 / avgcount
        if (value > maxavgcalc) maxavgcalc = value  
    }
    
    return {
        timeslots:timeslots, 
        maxAvgPower: Math.round(maxavg * corfac / slottime),
        maxAvgCalcPower : Math.round(maxavgcalc * corfac / slottime),
        normpower : normpower,
        normcalcpower : normcalcpower
    }
}

function toCSV(ftp){
    let slots = ftp.timeslots
    // convert slots[] to csv-string
    var str = "slotTime;power;estPower;avgPower;estAvgPower;timeStamp" + '\r\n'
    for (var i=0; i < slots.length; i++){
        var s=""
        var slot = slots[i]
        s += slot.time + ';'
        s += Math.round(slot.energy / slot.time) + ';'
        s += Math.round(slot.calcenergy / slot.time) + ';'
        s += Math.round(slot.avgenergy / slot.time) + ';'
        s += Math.round(slot.avgcalcenergy / slot.time) + ';'
        s += slot.timestamp + ';'
        str += s + '\r\n'
    }
    return str
}

module.exports = {
    calc : calcEnergy,
    accelerationPower : accelerationPower,
    calcFTP : calcFTP,
    toCSV : toCSV
}