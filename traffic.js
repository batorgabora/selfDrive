function generateRandomTraffic(numCars) {
    backCars = Math.floor(numCars /4 * (Math.random()+0.5));
    numCars = numCars - backCars;

    const laneNum = [];  // Assuming 3 lanes
    for (let i = 0; i < lanes; i++) {
        laneNum.push(i);
    }
    const minDistance = 1000;  // Starting point for first car
    const maxDistance = -7500; // Farthest distance

    for (let i = 0; i < numCars; i++) {
        const randomLane = laneNum[Math.floor(Math.random() * laneNum.length)];
        const lanee = randomLane === 0 ? 1 : randomLane;  // Random lane except 0
        let yPosition = Math.floor(Math.random() * (maxDistance - minDistance) + minDistance); // Random y position

    //handling so that it doesnt spawn kill
        let flip = 1;
        if (Math.abs(yPosition-car.y) <= 300) {
        if (yPosition>=0) {
            flip = -1; 
        }
        yPosition = flip * 400;
        }
        const speed = Math.floor(Math.random() * 2) + 1;  // Random speed between 1 and 3
        const color = randomcolor(); // Assuming this function exists
        traffic.push(new Car(road.getLaneCenter(lanee), yPosition, 30, 50, "dummy", speed, color));
    }

    for (let i = 0; i < backCars; i++) {
        const lanee = 0
        let yPosition = Math.floor(Math.random() * (maxDistance - minDistance) + minDistance); // Random y position

    //handling so that it doesnt spawn kill
        let flip = 1;
        if (Math.abs(yPosition-car.y) <= 300) {
        if (yPosition>=0) {
            flip = -1; 
        }
        yPosition = flip * 400;
        }
        const speed = Math.floor(Math.random() * 2) + 1;  // Random speed between 1 and 3
        const color = randomcolor(); // Assuming this function exists
        traffic.push(new Car(road.getLaneCenter(lanee), yPosition, 30, 50, "dummy back", speed, color));
    }


    return traffic;
}