class Visualizer{
    static drawNetwork(ctx, network){
        const margin= 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - margin * 2;
        const height = ctx.canvas.height - margin * 2;

        //Visualizer.drawLevel(ctx, network.levels[0], left, top, width, height);           --> for one level

        const levelHeight = height/network.levels.length;  //declared in car.update()
        for (let i = network.levels.length-1; i >= 0; i--) {           //drawing bottom up originally so we reverse
            const levelTop = top + lerp(height - levelHeight, 0, network.levels.length == 1 ? 0.5 : i/(network.levels.length-1));  //bottom most level start at y that fits in screen (consider margin)
            
            ctx.setLineDash([7, 3]);            //for animation

            Visualizer.drawLevel(ctx, network.levels[i], left, levelTop, width, levelHeight,
                i == network.levels.length-1
                    ? ['↑', '←', '→', '↓']      //only display output labels for last 
                    : []
            );
        }
    }

    static drawLevel(ctx, level, left, top, width, height, outputLabels){
        const right = left + width;
        const bottom = top+height;


        const {inputs, outputs, weights, biases} = level;        //--> only use inputs instead of level.inputs

        //connections
        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < outputs.length; j++) {
                ctx.beginPath();

                ctx.moveTo(Visualizer.#getNodeX(inputs, i, left, right), bottom);
                ctx.lineTo(Visualizer.#getNodeX(outputs, j, left, right), top);

                ctx.lineWidth = 2;
                /* const value = weights[i][j];            //connection is actually the specific weight 
                const alpha=Math.abs(value);            //the transparency is set with |weight| as it will be between 0 and 1
                const R = value < 0 ? 0 : 255;              //red
                const G = R;                                //joined together thus yellow       --> no fucking idea
                const B = value > 0 ? 0 : 255;              //blue
                ctx.strokeStyle = "rgba("+R+","+G+","+B+","+alpha+")";          //--> + yellow      - blue         dim - close to zero */
                ctx.strokeStyle = getRGBA(weights[i][j]*inputs[i]);         // or simply weights[i][j]w
                ctx.stroke();
            }          
        }

        //input nodes
        const nodeRadius=15;
        for (let i = 0; i < inputs.length; i++) {
            const x = lerp(
                left, 
                right, 
                inputs.length == 1
                    ?0.5
                    :i/(inputs.length-1)
            );
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle="black";
            ctx.fill();
            //visual trick for node outline contour
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle=getRGBA(inputs[i]);                       //node is colored as input value
            ctx.fill();
        }
        //output nodes
        for (let i = 0; i < outputs.length; i++) {

            const x = Visualizer.#getNodeX(outputs, i, left, right);            //same as above but with private function
            
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            //visual trick
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle=getRGBA(outputs[i]);                      //node is colored as output value
            ctx.fill();

            //drawing biases as well as a contour
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);

            //output labels
            if (outputLabels[i]) {
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "green";
                ctx.strokeStyle="red";
                ctx.font = (nodeRadius*0.7) + "px Arial";
                ctx.fillText(outputLabels[i], x, top - nodeRadius * 0.1);           //finishing touches
                ctx.lineWidth = 0.5;
                ctx.strokeText(outputLabels[i], x, top - nodeRadius * 0.1);
            }
        }
    }

    static #getNodeX(nodes, index, left, right){
        return lerp(
            left,
            right,
            nodes.length == 1
                    ?0.5
                    :index/(nodes.length-1)
        );
    }
}

