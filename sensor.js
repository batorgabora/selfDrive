class Sensor{
    constructor(car){
        this.car = car;
        this.rayCount=raysofsensor;
        this.rayLength=rayslength;
        this.raySpread=raysspreadofsensor;

        this.rays = [];
        this.readings=[];
    }


    update(roadBorders, traffic)
    {
        this.#castRays();    

        this.readings=[];
        for (let i = 0; i < this.rays.length; i++) {
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders, traffic)
            );
        }
    }

    #getReading(ray, roadBorders, traffic){
        let touches = [];

        for (let i = 0; i < roadBorders.length; i++) {
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]
            );
            if (touch) {
                touches.push(touch);
            }    
        }

        for (let i = 0; i < traffic.length; i++) {
            const poly = traffic[i].polygon;
            for (let j = 0; j < poly.length; j++) {
                const value = getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j+1)%poly.length]
                );
                if (value) {
                    touches.push(value);
                }  
            }
        }

        if (touches.length==0) {
            return null;
        }
        else{                                               //points touched have different lengths from ray[0]
            const offsets = touches.map(e => e.offset);
            const minOffset = Math.min(...offsets)             //we need the closest touch intersection point  --> ... spreads the array to different singular values
            return touches.find(e => e.offset == minOffset)         //return only the closest one
        }
    }

    #castRays(){
        this.rays = [];
        for (let i=0; i<this.rayCount; i++) 
        {
            const rayAngle= this.car.angle + lerp(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount==1?0.5:i/(this.rayCount-1)
            );

            const start={x:this.car.x, y:this.car.y};
            const end={
                x:this.car.x-Math.sin(rayAngle)*this.rayLength,
                y:this.car.y-Math.cos(rayAngle)*this.rayLength
            };
            this.rays.push([start, end]);
        }  
    }

    draw(ctx)
    {
        for(let i=0; i<this.rayCount; i++) 
        {
            //drawing ray intersections
            let end = this.rays[i][1]
            if (this.readings[i]) {
                end = this.readings[i];
            }
            //til intersection
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="blue";
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
            //how far it would go
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="green";
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.stroke();
        }
    }
}