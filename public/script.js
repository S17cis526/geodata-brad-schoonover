window.addEventListener('load', function()
{
  if("geolocation" in Navigator)
  {
    navigator.geolocation.getCurrentPosition(function(position)
    {
      d3.select.('body').insert('div', ':first-child').attr("class", "location-bar").text("You are at: " position.coords.latitude + ", ", position.coords.longitude)
      conosl.log(position)
    })
  }
});

d3.json('/locations.json', function(err, locations)
{
  if(err)
  {
    return console.log(err);
  }
  var table = d3.select('body').append('table');
  table.append('thead')
  .append('th')
  .data(['address', 'latitude', 'longitude'])
    .enter()
    .selectAll('tr')
      .append('th')
      .text(function(d){return d;});

  table.append('body')
    .selectAll('tr')
      .data(locations)
      .enter()
        .append('tr')
        .each(function(d){
          d3.select(this).append('td').text(d.address);
          d3.select(this).append('td').text(d.latitude);
          d3.select(this).append('td').text(d.longitude);
        })
  console.log(locations);
});

d3.json('/united-states.json', function(err, usa)
{
  if(err) return console.log(err);

  var width = 760;
  var height = 480;

  var svg = d3.select('body').append('svg')
    .attr('width',width)
    .attr('height',height)

  var projection = d3.geoAlbersUsa()
    .scale(1000)
    .translate([width/2, height/2]);

  var path = d3.geoPath()
    .projection(projection);

  svg.insert('path', '.land-borders')
    .datum(topojson.feature(usa, usa.objects.land))
    .attr('class', 'land')
    .attr('d', path);

  svg.insert('path', '.state-borders')
    .datum(topojson.feature(usa, usa.objects.states))
    .attr('class', 'state')
    .aatr('d', path);

  d3.json('/locations.json', function(err, locations)
  {
    if(err) return console.log(err);
  })
  svg.selectAll('.pin')
    .data(locations)
    .enter()
      .append('image')
      .attr('xling:href', 'pin.png')
      .attr('class', 'pin')
      .attr('width', 20)
      .attr('height', 20)
      .attr('transform', function(d))
      {
        var coords = [d.latitude, d.longitude]
        coords = projection(coords);
        coords[0] -= 10;
        coords[1] -= 10;
        return 'translate(' + coords + ')';
      })
      .append('svg:title')
})
