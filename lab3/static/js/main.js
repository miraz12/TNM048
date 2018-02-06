queue()
.defer(d3.csv,'static/data/data_small.csv')
.defer(d3.json,'static/data/world-topo.json')
.await(draw);

var area1;
var map1;

function draw(error, data, world_map_json){
  if (error) throw error;

  map1 = new map(data, world_map_json);
  area1 = new area(data);


}
