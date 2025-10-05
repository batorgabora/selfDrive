let lanes = localStorage.getItem("laneCount");
lanes = lanes !== null ? Math.max(2, parseInt(lanes)) : 2;

let aicarnum = localStorage.getItem("aiCars");
aicarnum = aicarnum !== null ? Math.max(50, parseInt(aicarnum)) : 100;

let mutationvalue = localStorage.getItem("mutationRate");
mutationvalue = mutationvalue !== null ? parseFloat(mutationvalue) : 0.1;

let trafficcounter = localStorage.getItem("trafficCount");
trafficcounter = trafficcounter !== null ? Math.max(1, parseInt(trafficcounter)) : 15;

let raysofsensor = localStorage.getItem("sensorCount");
raysofsensor = raysofsensor !== null ? Math.max(2, parseInt(raysofsensor)) : 5;

let raysspreadofsensor = localStorage.getItem("sensorSpread");
raysspreadofsensor = raysspreadofsensor !== null 
    ? Math.min(Math.PI*2, Math.max(1, parseFloat(raysspreadofsensor))) 
    : Math.PI/2;

rayslength = 150;

let hiddenlayer = localStorage.getItem("hiddenLayer");
hiddenlayer = hiddenlayer !== null ? Math.max(3, parseInt(hiddenlayer)) : 6;


const carCanvas = document.getElementById("carCanvas");
carCanvas.height=window.innerHeight;
carCanvas.width=lanes*66.6666666;   //setting up canvas

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = Math.max(300, 90 + (raysofsensor > hiddenlayer ? raysofsensor : hiddenlayer) * 30);

const carCtx = carCanvas.getContext("2d");                    //car basics --> for drawing on canvas (context is needed)
const networkCtx = networkCanvas.getContext("2d")

const road = new Road(carCanvas.width/2, carCanvas.width*0.9, lanes)

const car = new Car(road.getLaneCenter(Math.round(lanes/3)), 300, 30, 50, "keys", 4, "darkgreen");

const N = aicarnum;
const cars = generateCars(N);       //ai car generations
let bestCar = cars[0];
if(localStorage.getItem("bestBrain")){
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
        if (i!=0) {
            NeuralNetwork.mutate(cars[i].brain, mutationvalue);
        }
    }
}

let traffic = [];
generateRandomTraffic(lanes*trafficcounter)
//car.draw(ctx)                                                             it cannot draw before updating cuz sensors would have an empty rays[] array

animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain)
    );
}

function discard(){
    localStorage.removeItem("bestBrain")
}

function generateCars(N){           //ai car gen
    const cars = [];
    for (let i = 1; i < N; i++) {
        cars.push(new Car(road.getLaneCenter(Math.round(lanes/3)), 100, 30, 50, "ai", 3, "#435849"));
    }
    return cars;
}

function animate(time){
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);        //maybe without borders even            it also c annot interact with itself (traffic not damaging itself)
    }
    //ai cars:
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);   
    }
    
    //general:
    car.update(road.borders, traffic);

    bestCar=cars.find(
        c => c.y == Math.min(           //fitness functions
            ...cars.map(c => c.y))      //--> spreading y values and then choosing min --> modern js syntax
    );

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    //general:
    if(bestCar.y<car.y){
        carCtx.translate(0, -bestCar.y+carCanvas.height*0.7);
    }
    else{
        carCtx.translate(0, -car.y+carCanvas.height*0.7)    //moving road instead of car (- road move)
    }

    //carCtx.translate(0, -bestCar.y+carCanvas.height*0.7)        //moving canvas based on best ai car (with min y value)

    //drawing road first
    road.draw(carCtx);
    //traffic
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "pink");        //drawing every traffic car
    }
    
    
    //ai cars drawing
    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, "black");           //drawing every ai car      
    }
    carCtx.globalAlpha = 1;
    
    bestCar.draw(carCtx, "green", true);

    //general:
    car.draw(carCtx, "red", true);


    carCtx.restore();

    

    networkCtx.lineDashOffset = -time/85;
    //general:
    //Visualizer.drawNetwork(networkCtx, car.brain);

    Visualizer.drawNetwork(networkCtx, bestCar.brain);       //printing brain of just first car

    requestAnimationFrame(animate);                     //calls it many times per second --> illusion of moving
    //however top positions stay there so we move line 14 from line 2 to continuously update  :D
}