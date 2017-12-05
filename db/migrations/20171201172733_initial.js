
exports.up = function(knex, Promise) { //create table
  return Promise.all([        //begin of promise.all; this function returns a promise
    knex.schema.createTable('projects', function(table) {  //start creating a table to database projects;
      table.increments('id').primary();  //assign a unique id to every project that is created
      table.string('name');  //add a colum for name, each project will have a name

      table.timestamps(true, true);  // create time stamp for when project was created and updated
    }),//end projects table;

    knex.schema.createTable('palettes', function(table) { //begin to create table palettes
      table.increments('id').primary();  //give each palette a unique id as its created
      table.string('name');  //add a column for name, each palette will have a name
      table.integer('project_id').unsigned();
      table.foreign('project_id')  //foreign key will be added to each palette relating to the project that it belongs to
        .references('projects.id'); //references which project the palette is related to

      table.timestamps(true, true); //timestamps for when palette is created and updated
    })
  ]) //end promise.all;
};

exports.down = function(knex, Promise) { //drop table
  return Promise.all([
    knex.schema.dropTable('palettes'),
    knex.schema.dropTable('projects')
  ]);
};
