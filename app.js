let map = L.map('map').setView([45.5845,9.2744],13);


L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
{
maxZoom:19
}
).addTo(map);



let routeLine;



async function geocode(place){

let url =
"https://nominatim.openstreetmap.org/search?format=json&q="
+encodeURIComponent(place);


let r = await fetch(url);

let data = await r.json();


return [
data[0].lat,
data[0].lon
];

}




async function calculateRoute(){


let start =
document.getElementById("start").value;


let end =
document.getElementById("end").value;



let a =
await geocode(start);


let b =
await geocode(end);



let url =

`https://router.project-osrm.org/route/v1/driving/${a[1]},${a[0]};${b[1]},${b[0]}?overview=full&geometries=geojson`;



let response =
await fetch(url);


let data =
await response.json();



let coords =
data.routes[0].geometry.coordinates;



let points =
coords.map(x=>[x[1],x[0]]);



if(routeLine)
map.removeLayer(routeLine);



routeLine =
L.polyline(points,{
weight:6
})
.addTo(map);



map.fitBounds(routeLine.getBounds());



let km =
(data.routes[0].distance/1000).toFixed(1);



let warnings = await checkRoadRestrictions(points);


if(warnings.length > 0){

document.getElementById("info").innerHTML =

"⚠️ ATTENZIONE<br><br>"+
"Questo percorso contiene strade non adatte ai ciclomotori:<br><br>"+
warnings.map(w =>
"🚫 "+w.name+" ("+w.type+")"
).join("<br>");

}

else {


document.getElementById("info").innerHTML =

"🟢 Percorso verificato<br><br>"+
"📏 "+km+" km<br>"+
"🛵 Percorribile con ciclomotore";


}



}
