//linear interpolation
function lerp(A, B, t){             //for lanes
    return A + (B-A)*t;
}

function getIntersection(A,B,C,D){ 
    const tTop=(D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop=(C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom=(D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);
    
    if(bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x:lerp(A.x,B.x,t),
                y:lerp(A.y,B.y,t),
                offset:t
            }
        }
    }

    return null;
}

function polysIntersect(poly1, poly2){              //check every point of one polygon (even line) for every point of the other (even line)
    for (let i = 0; i < poly1.length; i++) {
        for (let j = 0; j < poly2.length; j++) {
            const touch=getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],       // % so that there is no error with i+1
                poly2[j],
                poly2[(j+1)%poly2.length],
            );
            if (touch) {
                return true;
            }
        }
    }
    return false;
}

function getRGBA(value){
    const alpha=Math.abs(value);            //the transparency is set with |weight| as it will be between 0 and 1
    const R = value < 0 ? 0 : 255;              //red
    const G = R;                                //joined together thus yellow       --> no fucking idea
    const B = value > 0 ? 0 : 255;              //blue                
    return "rgba("+R+","+G+","+B+","+alpha+")";               //--> + yellow      - blue         dim - close to zero
}
function getRGBAbutGreen(value){
    const alpha = Math.abs(value); // Transparency based on strength
    const R = 0; // No red
    const G = value > 0 ? 255 : 0; // Green for positive, none for negative
    const B = value < 0 ? 255 : 0; // Blue for negative, none for positive
    return `rgba(${R},${G},${B},${alpha})`; // Output the color string
}

function getRandomColor(){
    const hue = 290 + Math.random()*260;
    return "hsl("+hue+", 100%, 60%)";
}

function randomcolor(){
    const rando = Math.round(Math.random()*4);
    switch (rando) {
        case 0:
            return "#3ACA77";    //green
            break;
        case 1:
            return "#55C8F0";    //blue
            break;
        case 2:
            return "#CE1DD2";    //red
            break;
        case 3:
            return "#AE6DB2";    //baby blue
            break;   
        case 4:
           return "#CA3A93";    //cyan green
            break; 
    }
}

function toDegree(radians) {
    return radians * (180 / Math.PI);
}