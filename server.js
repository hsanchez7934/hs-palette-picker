const express = require('express');  //require express
const app = express();  //create instance of app
const bodyParser = require('body-parser');  //require body-parser

app.set('port', process.env.PORT || 3000);  //specify which port to set app to, if not port is set default to localhost 3000
app.use(express.static(__dirname + '/public')); //server static html file located inside of public folder
app.use(bodyParser.json())  //parse data to json
app.use(bodyParser.urlencoded({ extended: true}));
app.locals.title = 'Palette Picker';

const environment = process.env.NODE_ENV || 'development';  //declare environment, if node env return falsey default to development environment
const configuration = require('./knexfile')[environment];  //connect to knex file environment section
const database = require('knex')(configuration);  //declare database to be used which is declared inside of knex file


app.get('/api/v1/projects', (request, response) => {  //get all projects from database
  database('projects').select()  //select project database
  .then(projects => response.status(200).json(projects)) //return response status 200 and return json parsed data if fetch is successful
  .catch(error => response.status(500).json({ error })); //return response status 500 if unsuccessful
});

app.post('/api/v1/projects', (request, response) => {  //post project to database
  const project = request.body;  //declare project and assign request body
  if(!project.name) {  //if request body is missing a name property then following code with execute
    return response.status(422).json({ error: `Project is missing a name` }); //return response 422 and notify user that name property is missing
  }
  database(`projects`).insert(project, '*') //insert new project into projects database
  .then(project => response.status(201).json(project[0])) //return response status 201 if successful and return json parsed data
  .catch(error => response.status(500).json(error)); //return response status 500 if unsuccessful
});

app.post('/api/v1/projects/:id/palettes', (request, response) => { //add new palette to palettes database
  let palette = request.body; //declare palette and assign it request body
  const projectID = request.params.id;  //declare projectID and assign it project id

  for(let requiredParameter of [ //being for loop to iterate over request body properties
    'name',
    'color1',
    'color2',
    'color3',
    'color4',
    'color5'
  ]) {
    if(!palette[requiredParameter]) { //if request body is missing a required property execute following code
      return response.status(422).json({ error: `Palette is missing ${requiredParameter} property` }); //return response status 422 and notify user that a property is missing
    }
  }
  palette = Object.assign({}, palette, { project_id: projectID }); //add project_id property to request body and give it a value of projectID

  database('palettes').insert(palette, '*') //insert newly created palette to palettes database
  .then(palette => response.status(201).json(palette[0])) //return response status 201 and parsed data
  .catch(error => response.status(500).json({ error })); //return response status 500 if unsuccessful
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {  //retrieve palettes from targeted project
  database('palettes').where('project_id', request.params.id).select() //query for palettes where project_id matched the projects id
  .then(palettes => {
    return palettes.length  //if palettes are found execute following code
           ? response.status(200).json(palettes) //return response status 200 and parsed data
           : response.status(404).json({ error: `No palettes found for this project.`}); //return response status 404 if no palettes were found
  })
  .catch(error => response.status(500).json({ error })); //return response status 500 if unsuccessful
});

app.delete('/api/v1/palettes/:id', (request, response) => { //destroy palette from palettes database
  const { id } = request.params; //destructure id from request params

  database('palettes').where({ id }).del() //query palettes database for palette which matching id value and destroy
  .then(palette => {
    return palette //if palette was found execute following code
           ? response.sendStatus(204) //return response status 204
           : response.status(422).json({ error: `Palette not found` }) //return response status 422 if no palette was found
  })
  .catch(error => response.status(500).json({ error })); //return response status 500 if unsuccessful
});

app.delete('/api/v1/projects/:id', (request, response) => { //destroy project from projects database
  const { id } = request.params; //destructure id from request params

  database('projects').where({ id }).del()  //query projects database for project which matching id value and destroy
  .then(project => {
    return project  //if project was found execute following code
           ? response.sendStatus(204) //return response status 204
           : response.status(422).json({ error: `Project not found` })  //return response status 422 if no palette was found
  })
  .catch(error => response.status(500).json({ error }));  //return response status 500 if unsuccessful
});

app.listen(app.get('port'), () => {  //run app on specified port
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;  //export app
