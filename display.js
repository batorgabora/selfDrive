function updateLaneDisplay() {
    document.getElementById("laneCount").textContent = lanes;
    document.getElementById("aiCars").textContent = aicarnum;
    document.getElementById("mutationRate").textContent = mutationvalue.toFixed(2)
    document.getElementById("trafficCount").textContent = trafficcounter*lanes;
    document.getElementById("sensorCount").textContent = raysofsensor;
    document.getElementById("sensorSpread").textContent = toDegree(raysspreadofsensor).toFixed(2) + "°";
    document.getElementById("hiddenLayer").textContent = hiddenlayer;
    document.getElementById("inputLayer").textContent = raysofsensor;
}


function lanesplus() {
    lanes++;
    // Save updated lane count in localStorage
    localStorage.setItem("laneCount", lanes);
    console.log(`lanes increased to: ${lanes-1}`);
    updateLaneDisplay();
}
function lanesminus() {
    lanes--;
    // Save updated lane count in localStorage
    localStorage.setItem("laneCount", lanes);
    console.log(`lanes decreased to: ${lanes-1}`);
    updateLaneDisplay();
}

function aiplus() {
    aicarnum+=100;
    // Save updated lane count in localStorage
    localStorage.setItem("aiCars", aicarnum);
    console.log(`ai carn num increased to: ${aicarnum}`);
    updateLaneDisplay();
}
function aiminus() {
    aicarnum-=100;
    // Save updated lane count in localStorage
    localStorage.setItem("aiCars", aicarnum);
    console.log(`ai car num decreased to: ${aicarnum}`);
    updateLaneDisplay();
}

function mutationplus() {
    mutationvalue += 0.01;
    // Save updated lane count in localStorage
    localStorage.setItem("mutationRate", mutationvalue);
    console.log(`mutation value increased to: ${mutationvalue}`);
    updateLaneDisplay();
}
function mutationminus() {
    mutationvalue -= 0.01;
    // Save updated lane count in localStorage
    localStorage.setItem("mutationRate", mutationvalue);
    console.log(`mutation value decreased to: ${mutationvalue}`);
    updateLaneDisplay();
}

function trafficplus() {
    trafficcounter += 1;
    // Save updated lane count in localStorage
    localStorage.setItem("trafficCount", trafficcounter);
    console.log(`traffic counter increased to: ${trafficcounter*lanes}`);
    updateLaneDisplay();
}
function trafficminus() {
    trafficcounter -= 1;
    // Save updated lane count in localStorage
    localStorage.setItem("trafficCount", trafficcounter);
    console.log(`traffic counter decreased to: ${trafficcounter*lanes}`);
    updateLaneDisplay();
}

function sensorcountplus() {
    raysofsensor += 1;
    // Save updated lane count in localStorage
    localStorage.setItem("sensorCount", raysofsensor);
    console.log(`sensor count increased to: ${raysofsensor}`);
    updateLaneDisplay();
    discard();
}
function sensorcountminus() {
    raysofsensor -= 1;
    // Save updated lane count in localStorage
    localStorage.setItem("sensorCount", raysofsensor);
    console.log(`sensor count decreased to: ${raysofsensor}`);
    updateLaneDisplay();
    discard();
}

function sensorspreadplus() {
    raysspreadofsensor += Math.PI/6;
    // Save updated lane count in localStorage
    localStorage.setItem("sensorSpread", raysspreadofsensor);
    console.log(`sensor spread increased to: ${raysspreadofsensor}`);
    updateLaneDisplay();
}
function sensorspreadminus() {
    raysspreadofsensor -= Math.PI/6;
    // Save updated sensor spread in localStorage
    localStorage.setItem("sensorSpread", raysspreadofsensor);
    console.log(`sensor spread decreased to: ${raysspreadofsensor}`);
    updateLaneDisplay();
}

function hiddenplus() {
    hiddenlayer += 1;
    // Save updated lane count in localStorage
    localStorage.setItem("hiddenLayer", hiddenlayer);
    console.log(`hidden neurons count increased to: ${hiddenlayer}`);
    updateLaneDisplay();
    discard();
}
function hiddenminus() {
    hiddenlayer -= 1;
    // Save updated lane count in localStorage
    localStorage.setItem("hiddenLayer", hiddenlayer);
    console.log(`hidden neurons count decreased to: ${hiddenlayer}`);
    updateLaneDisplay();
    discard();
}

document.addEventListener("DOMContentLoaded", updateLaneDisplay);
