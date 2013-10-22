
$(document).ready(function ()
{
    Parse.initialize("cumLBO8rBloI9peNr7TuU2q6TOJdqL7mMz5faNFi", "YSfUfo6hXUwYPbPelzhO1v78i7C4pBv1RTFVSWJW");
    var NoteObject = Parse.Object.extend("NoteObject");

    setMapSize();
    var count = 15;
    var interval = 30;
    var val = $('#ride').val();
    var map = getRide(NoteObject, val, map);

    timer = $.timer(function ()
    {
        count--;
        $('#counter').html('<p><b>Refresh in:</b> ' + count + ' seconds</p>');
        if (count< 1)
        {
            location.reload();
        }
    });
    timer.set({ time: 1000, autostart: true });

    $('#change').click(function ()
    {
        val = $('#ride').val();
        map = getRide(NoteObject, val, map);

    });

    $('#clear').click(function ()
    {
        location.reload();
    });


    $("#notes").height('500px');

});

function getRide(NoteObject, val, map)
{
    $.get('ride_data.csv', function (csv)
    {
        var rides = $.csv.toObjects(csv);

        $.each(rides, function (i, json)
        {
            if (json.name === val)
            {
                var map = createMap(json, NoteObject, val);
                getLine(NoteObject, map, val);
                getLocation(NoteObject, map, val);
                getNotes(NoteObject, val);
            }
        });
    }); 

}


function getNotes(NoteObject, val) {
    
    var query = new Parse.Query(NoteObject);
    query.equalTo("title", val);
    query.limit(1);
    query.descending("count");
    //query.count({
    //    success: function(count) {
    //       $("#notes").append('<p>Returned notes ' + count +'</p>');
    //    }
    //});

    query.find({
	    success:function(results) {
		    console.dir(results);
		    var s = "";
		    for(var i=0, len=results.length; i<len; i++) {
			    var note = results[i];
			    s += "<p><b>Current location</b><br>";
			    //s += "<b>"+note.get("title")+"</b><br/>
			    //s += note.get("body")+ "<br/>";
                if(note.has("location")) {
                    var pos = note.get("location");
                    s += "Lng:" + pos.longitude + "<br/>Lat:" + pos.latitude+"<br/>";
                }
                s += note.createdAt + "<br/></p>";
		    }
		    $("#notes").append(s);
	    },
	    error:function(note,error) {
				console.log( error.description);
			}
    });
  }


  function getLocation(NoteObject, map, val) {

   
    var query = new Parse.Query(NoteObject);
    query.equalTo("title", val);
    query.limit(1);
    query.descending("count");
    query.find({
        success: function (results)
        {

            for (var i = 0, len = results.length; i < len; i++)
            {
                var result = results[i];
                var point = new L.LatLng(result.attributes.location.latitude, result.attributes.location.longitude);
                console.log(point.toString());

                 if (!marker)
                        var marker = L.userMarker(point, { pulsing: true, accuracy: 500, smallIcon: true
                 }).addTo(map);

            }

        },
        error: function (note, error)
        {
            console.log(error.description);
        }
    });
  }

  function getLine(NoteObject, map, val) {
    
    var query = new Parse.Query(NoteObject);
    query.equalTo("title", val);
    query.find({
        success: function (results)
        {
            console.dir(results);

            var latlng = new Array;
            for (var i = 0, len = results.length; i < len; i++)
            {
                var note = results[i];
                var point = new L.LatLng(note.attributes.location.latitude, note.attributes.location.longitude);
                latlng.push(point);
   
            }

            query.count({
            success: function(count) {
               if(count>1)
               {
                   var polyline = L.polyline(latlng, { color: 'red', smoothFactor: 2.0, "weight": 5,
                        "opacity": 0.65 }).addTo(map);
                    map.fitBounds(polyline.getBounds());
               }
            }
        });

            

        },
        error: function (note, error)
        {
            console.log(error.description);
        }
    });
  }


  
  