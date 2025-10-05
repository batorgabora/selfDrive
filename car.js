class Car{
    constructor(x, y, width, height, controlType, maxSpeed=3,color="green"){
        this.x = x;
        this.y = y;                         //so that car "remembers" its paraneters
        this.width = width;
        this.height = height;

        this.speed=0;
        this.acceleration=0.25;
        this.maxSpeed=maxSpeed;
        this.friction=0.04;
        this.angle=0;
        this.damaged=false;

        this.useBrain=controlType=="ai";            //if control type correct --> true

        if (controlType!="dummy") {
            this.sensor=new Sensor(this);           //Equip with sensor
            this.brain=new NeuralNetwork(
                [this.sensor.rayCount, 6, 4]        //input, hidden, output --> neuron counts
            );
            
            //if by updating raycount the neural network input num wouldnt match this fixes it
            if (this.rayCount !== this.brain.levels[0].inputs.length) {
                this.brain = new NeuralNetwork([this.sensor.rayCount, hiddenlayer, 4]);
            }
        }


        this.controls=new Controls(controlType)

        this.img = new Image();
        this.img.src = "car.png"
        this.mask = document.createElement("canvas");
        this.mask.width = width;
        this.mask.height = height;
        const maskCtx = this.mask.getContext("2d");
        this.img.onload = () => {
            maskCtx.fillStyle = color;
            maskCtx.rect(0, 0, this.width, this.height);
            maskCtx.fill();
            maskCtx.globalCompositeOperation = "destination-atop";
            maskCtx.drawImage(this.img, 0, 0, this.width, this.height);
        }
    }

    update(roadBorders, traffic){
        if (!this.damaged) {
            this.#move();
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders, traffic);
        }
        if(this.sensor){
            this.sensor.update(roadBorders, traffic);

            const offset = this.sensor.readings.map(                   //getting input sensor readings
                s=>s==null?0:1-s.offset                                 //if no object (intersection) --> null, if object 1-offset(length from object(intersection))
            );                                                          //low values iffar, high if far away --> like a flashlight
            const outputs = NeuralNetwork.feedForward(offset, this.brain);
            //console.log(outputs);

            if (this.useBrain) {                                        //connecting neural output to keyboard input
                this.controls.forward=outputs[0];
                this.controls.left=outputs[1];
                this.controls.right=outputs[2];
                this.controls.reverse=outputs[3]
            }
        }
    }

    #createPolygon(){
        const points=[];
        const rad = Math.hypot(this.width,this.height)/2;        //hypertenuse of a triangle        _____    --> width
        const alpha = Math.atan2(this.width, this.height);       //arc tangent                      |  /                --> rad(hypertenuse)
        points.push({                                            //                                 |a/       --> height
            x:this.x - Math.sin(this.angle-alpha)*rad*0.9,
            y: this.y - Math.cos(this.angle-alpha)*rad*0.9
        });
        points.push({
            x:this.x - Math.sin(this.angle+alpha)*rad*0.9,
            y: this.y - Math.cos(this.angle+alpha)*rad*0.9
        });
        points.push({
            x:this.x - Math.sin(Math.PI+this.angle-alpha)*rad*0.9,
            y: this.y - Math.cos(Math.PI+this.angle-alpha)*rad*0.9
        });
        points.push({
            x:this.x - Math.sin(Math.PI+this.angle+alpha)*rad*0.9,
            y: this.y - Math.cos(Math.PI+this.angle+alpha)*rad*0.9
        });
        return points;
    }

    #assessDamage(roadBorders, traffic){
        for (let i = 0; i < roadBorders.length; i++) {
            if(polysIntersect(this.polygon, roadBorders[i])){
                return true;
            }         
        }
        for (let i = 0; i < traffic.length; i++) {
            if(polysIntersect(this.polygon, traffic[i].polygon)){
                return true;
            }         
        }
        return false;
    }

    #move(){
        if(this.controls.forward){
            //this.y-=2;      old one                //0,0,0 point is at upper left pixel of the canvas (- y coords)
            this.speed += this.acceleration;
        }
        if(this.controls.reverse){
            this.speed -= this.acceleration;
        }

        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        if(this.speed < -(this.maxSpeed/2)){        //it shouldbe slower in reverse
            this.speed=-this.maxSpeed/2;
        }

        if(this.speed > 0){
            this.speed -= this.friction;
        }
        if(this.speed < 0){
            this.speed += this.friction;
        }
        if(Math.abs(this.speed)<this.friction){         //friction bounces it amount and moves it forwards slightly --> now fixed
            this.speed=0;
        }

        if(this.speed != 0){
            const flip = this.speed>0?1:-1;             //flipping controls for reverse (1 or -1)
            if(this.controls.left){                         //rotated unit circle
                //this.x-=2;        old one
                this.angle += 0.03*flip;
            }
            if(this.controls.right){
                this.angle -= 0.03*flip;
            } 
        }
          
        this.x -= Math.sin(this.angle)*this.speed;           //*speed for scaling reasons as -1<=sine<=1
        this.y -= Math.cos(this.angle)*this.speed;
        //this.y-=this.speed;   old one
    }

    draw(ctx, color, drawSensor = false){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle)         //for rotation
        if(!this.damaged){
            ctx.drawImage(this.mask, -this.width/2, -this.height/2, this.width, this.height);
            ctx.globalCompositeOperation = "multiply";
        }
        ctx.drawImage(this.img, -this.width/2, -this.height/2, this.width, this.height);
        ctx.restore();

        //for rectangle or plygon car:

        /* if (this.damaged) {
            ctx.fillStyle="cyan";
        }
        else{
            ctx.fillStyle=color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y)
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill(); */

        if (this.sensor && drawSensor) {
            this.sensor.draw(ctx);            
        }

    }
}