
function createMap(json)
{
    
    var map = new L.map('map', 
    {
        center: [json.lng, json.lat],
        zoom: 13
    });

    var osmTile = "http://{s}.tile.cloudmade.com/ba8af3a046054cefaed65ea8ca002dc1/101270/256/{z}/{x}/{y}.png";
    var osmCopyright = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap contributors</a>';
                        '<a href="http://creativecommons.org/licenses/by-sa/2.0/"></a>CC-BY-SA</a>, Imagery Â© <a href="http://cloudmade.com">CloudMade</a>'; 
    var osmLayer = new L.TileLayer(osmTile, { maxZoom: 17, attribution: osmCopyright });  
    map.addLayer(osmLayer);
    //addLocateControl(map);
    showElevation(map, json.gpx_file);
    //$.get(json.html_file, function (data){$("#txt").html(data)});
    return map;
}

function addPath(map,path)
{
    new L.GPX(path, {
        async: true,
        marker_options: {
            startIconUrl: 'pin-icon-start.png',
            endIconUrl: 'pin-icon-end.png',
            shadowUrl: 'pin-shadow.png'
        }
    }).on('loaded', function (e)
    {
        getTitle(e)
    }).addTo(map);

}

function addLocateControl(map)
{
    
    L.control.locate({
        position: 'topleft',  
        drawCircle: true,  
        metric: true,  
        setView: true,
        maxZoom: 16, 
        strings: {
            title: "Show me where I am",  
            popup: "You are within {distance} {unit} from this point",  
            outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
        }
    }).addTo(map);
}

function showElevation(map, path)
{
    
    var el = L.control.elevation({
        position: "topright",
        theme: "lime-theme", 
        width: 125,
        height: 100,
        margins: { top: 10, right: 10, bottom: 20, left: 10 },
        useHeightIndicator: true, 
        interpolation: "linear", 
        hoverNumber: { decimalsX: 3, decimalsY: 0 },
        xTicks: undefined,
        yTicks: undefined
    });

    var g=new L.GPX(path, {async: true});
    g.on("addline", function (e)
    {
        getTitle(e);
        el.addData(e.line);
    });
    g.addTo(map);
    el.addTo(map);

}

function getTitle(e)
{
    $('.brand').text(e.target.get_name() + ' ('
            + Math.round(e.target.get_distance() / 1000) + 'km)');
}

function addPopup(latlng, map)
{
  var popup = L.popup();
    popup
        .setLatLng(latlng)
        .setContent(latlng.toString())
        .openOn(map);
    var ltlng = latlng.toString();
    var marker = L.marker(latlng).addTo(map); 
}


function setMapSize(){
	var res =  screen.availHeight;
	      
	if(res <= 320){
      $("#map").height('150');
	}
	else if(res > 320 && res < 400){
      $("#map").height('175');
    } 
 	else if(res >= 400 && res < 480 ){
      $("#map").height('200');
    }
 	else if(res >= 480 && res < 540 ){
      $("#map").height('300');
 	}
 	else if(res > 540 ){
 	  $("#map").height('600');
 	}
     
}

