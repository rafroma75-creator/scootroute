async function checkRoadRestrictions(points){


let warnings=[];


let samplePoints =
points.filter((p,index)=>index%5===0);



for(let p of samplePoints){


let lat=p[0];
let lon=p[1];


let query=`

[out:json];

way(around:40,${lat},${lon})
["highway"];

out tags;

`;



let url=

"https://overpass-api.de/api/interpreter?data="
+
encodeURIComponent(query);



let response =
await fetch(url);


let data =
await response.json();



data.elements.forEach(road=>{


let type =
road.tags.highway;



if(forbiddenRoadTypes.includes(type)){


warnings.push({

name:road.tags.name || "Strada non identificata",

type:type

});


}


});


}


return warnings;


}



function calculateScooterScore(warnings,distance){


let score=100;


score -= warnings.length * 20;


if(distance>30000){

score-=10;

}


return Math.max(score,0);


}
