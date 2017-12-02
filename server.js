const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}));

app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.get('/api/v1/projects', (request, response) => {
  database(`projects`).select()
  .then(projects => response.status(200).json(projects))
  .catch(error => response.status(500).json({ error }));
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;
  if(!project.name) {
    return response.status(422).json({ error: `Project is missing a name` });
  }
  database(`projects`).insert(project, '*')
  .then(project => response.status(201).json(project[0]))
  .catch(error => response.status(500).json(error));
});

app.post('/api/v1/projects/:id/palettes', (request, response) => {
  let palette = request.body;
  const projectID = request.params.id;

  for(let requiredParameter of [
    'name',
    'color1',
    'color2',
    'color3',
    'color4',
    'color5'
  ]) {
    if(!palette[requiredParameter]) {
      return response.status(422).json({ error: `Palette is missing ${requiredParameter} property` });
    }
  }
  palette = Object.assign({}, palette, { project_id: projectID });

  database('palettes').insert(palette, '*')
  .then(palette => response.status(201).json({ id: palette[0] }))
  .catch(error => response.status(500).json({ error }));
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  database('palettes').where('project_id', request.params.id).select()
  .then(palettes => {
    return palettes.length
           ? response.status(200).json(palettes)
           : response.status(404).json({ error: `No palettes found for this project.`});
  })
  .catch(error => response.status(500).json({ error }));
});

app.delete('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;

  database('palettes').where({ id }).del()
  .then(palette => {
    return palette
           ? response.sendStatus(204)
           : response.status(422).json({ error: `Palette not found` })
  })
  .catch(error => response.status(500).json({ error }));
});

app.delete('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params;

  database('projects').where({ id }).del()
  .then(project => {
    return project
           ? response.sendStatus(204)
           : response.status(422).json({ error: `Project not found` })
  })
  .catch(error => response.status(500).json({ error }));
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});