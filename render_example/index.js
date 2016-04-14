exports.gmaps = function(req, res) {

  if (req.body.CityID && req.body.CityID.length > 0 && req.body.CityID != 'undefined') {
    var CityID = req.body.CityID.split(',');
    dbconnect.selectMarkers(CityID, 'selectMarker')
    .then(function(data) {
      data = data.reduce(function(a, b) {
      return a.concat(b);
    }, []);
      res.render('./outlet/googlemaps.ejs', {
              textMain: 'Google maps',
              data: data,
              user: req.user
            });
    })
    .catch(function(e) {
      console.log(e);
    });
  } else {
    res.set('Content-Type', 'text/html');
    res.sendFile(__dirname + '/pages/index.html');
  }
};
