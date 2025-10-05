class NeuralNetwork{
    constructor(neuronCounts){
        this.levels=[];
        for (let i = 0; i < neuronCounts.length-1; i++) {     //for each level
            this.levels.push(new Level(                     //specify input and output count
                neuronCounts[i], neuronCounts[i+1]          //adding a new level with the neuron counts of the ith index and the neuron counts of the i+1th index
            ));       
        }
    }

    static feedForward(givenInputs, network){
        let outputs = Level.feedForward(givenInputs, network.levels[0]);
        for (let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedForward(outputs, network.levels[i]);             //putting in previous output as input
        }
        return outputs;                                                         //final outputs: forward, left...
    }

    static mutate(network, amount=1){
        network.levels.forEach(level => {
            for (let i = 0; i < level.biases.length; i++) {
                level.biases[i] = lerp(level.biases[i], Math.random()*2-1, amount)
            }
            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; j++) {
                    level.weights[i][j] = lerp(level.weights[i][j], Math.random()*2-1, amount)
                }
            }
        });
    }
}

class Level{
    constructor(inputCount, outputCount){
        this.inputs=new Array(inputCount);
        this.outputs=new Array(outputCount);
        this.biases=new Array(outputCount);

        this.weights=[];
        for (let i = 0; i < inputCount; i++) {          //for each input node an outputCount amount of connections (to ouput nodes)
            this.weights[i]=new Array(outputCount);            
        }

        Level.#randomize(this);                          //random barin for beginning
    }

    static #randomize(level){                                      //for serialization
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
               level.weights[i][j] = Math.random()*2-1;             //value between -1 and 1
            }          
        }

        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random()*2-1;
        }
    } 
    
    //hyperplane equation
    static feedForward(givenInputs, level){
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i]=givenInputs[i]; 
        }

        for (let i = 0; i < level.outputs.length; i++) {            //loops through outputs
            let sum = 0;
            for (let j = 0; j < level.inputs.length; j++) {        //loops through inputs
                sum += level.inputs[j] * level.weights[j][i];       //adds the product between jth input and the weight of the j(input)-i(output) connection
            }

            if (sum>level.biases[i]) {
                level.outputs[i] = 1;                               //turns neuron on - fire!
            }
            else{
                level.outputs[i] = 0;                               //no firing
            }        
        }

        return level.outputs;
    }
}

//https://youtu.be/Ve9TcAkpFgY?list=PLB0Tybl0UNfYoJE7ZwsBQoDIG4YN9ptyY

//tensorflow library
//https://www.songho.ca/math/plane/plane.html
//https://youtu.be/aircAruvnKk
