
exports.up = function(knex, Promise) { //create table
  return Promise.all([ ////begin of promise.all; this function returns a promise
    knex.schema.table('palettes', function(table) { //start creating changed to palette table;
      table.string('color1'); //add column for color1
      table.string('color2'); //add column for color2
      table.string('color3'); //add column for color3
      table.string('color4'); //add column for color4
      table.string('color5'); //add column for color5
    })
  ]);
};

exports.down = function(knex, Promise) { //drop table
  return Promise.all([
    knex.schema.table('palettes', function(table) {
      table.dropColumn('color1');
      table.dropColumn('color2');
      table.dropColumn('color3');
      table.dropColumn('color4');
      table.dropColumn('color5');
    })
  ]);
};
