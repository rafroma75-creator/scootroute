let map = L.map('map')
.setView([45.5845,9.2744],13);



L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
{
maxZoom:19
}
).addTo(map);



let routeLine;



async function geocode(place){


let url=

"https://nominatim.openstreetmap.org/search?format=json&q="
+
encodeURIComponent(place);



let response =
await fetch(url);


if(!response.ok){

throw new Error("Servizio percorso non disponibile");

}



let data =
await response.json();



if(data.length===0){

throw new Error("Indirizzo non trovato");

}


return [

parseFloat(data[0].lat),

parseFloat(data[0].lon)

];

}





async function calculateRoute(){


try{


let start =
document.getElementById("start").value;


let end =
document.getElementById("end").value;



let vehicle =
document.getElementById("vehicle").value;



let a =
await geocode(start);



let b =
await geocode(end);



let url=

`https://router.project-osrm.org/route/v1/driving/${a[1]},${a[0]};${b[1]},${b[0]}?overview=full&geometries=geojson&alternatives=true`;



let response =
await fetch(url);



let data =
await response.json();



let selectedRoute =
data.routes[0];



let coords =
selectedRoute.geometry.coordinates;



let points =
coords.map(x=>[x[1],x[0]]);



if(routeLine){

map.removeLayer(routeLine);

}



routeLine =
L.polyline(points,{
weight:6
})
.addTo(map);



map.fitBounds(routeLine.getBounds());



let km =
(selectedRoute.distance/1000).toFixed(1);



let warnings =
await checkRoadRestrictions(points);



let score =
calculateScooterScore(
warnings,
selectedRoute.distance
);



if(warnings.length>0){


document.getElementById("info").innerHTML=

"⚠️ ATTENZIONE<br><br>"+
"Strade non consigliate:<br>"+
warnings.map(w=>
"🚫 "+w.name+" ("+w.type+")"
).join("<br>")
+
"<br><br>Compatibilità 50cc: "
+score+"/100";


}

else{


document.getElementById("info").innerHTML=

"🟢 Percorso verificato<br><br>"+
"📏 "+km+" km<br>"+
"🛵 Compatibilità 50cc: "
+score+"/100";


}


}

catch(error){


document.getElementById("info").innerHTML=
"❌ Errore: "+error.message;


}


}
