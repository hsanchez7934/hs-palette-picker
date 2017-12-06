const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const requireHTTPS = (request, response, next) => {
  if (request.header('x-forwarded-proto') !== 'https') {
    return response.redirect(`https://${request.header('host')}${request.url}`);
  }
  return next();
};

if (process.env.NODE_ENV === 'production') { app.use(requireHTTPS); }

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.locals.title = 'Palette Picker';

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => response.status(200).json(projects))
    .catch(error => response.status(500).json({ error }));
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;
  if (!project.name) {
    return response.status(422).json({ error: 'Project is missing a name' });
  }
  return database('projects').insert(project, '*')
    .then(resProject => response.status(201).json(resProject[0]))
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

  return database('palettes').insert(palette, '*')
  .then(palette => response.status(201).json(palette[0]))
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

module.exports = app;
