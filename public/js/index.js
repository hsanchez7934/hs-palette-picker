$(document).ready(function() {
  newPaletteOnClick();
  fetchProjectsFromDB();
});
$('#projects-menu').on('mouseenter', onMouseEnter)
                   .on('mouseleave', onMouseLeave)
                   .on('click', projectListOnClick);
$('#drop-down-icon').on('mouseenter', onMouseEnter)
                    .on('mouseleave', onMouseLeave)
                    .on('click', projectListOnClick);
$('.lock-button').on('click', lockColor);
$('#generate-palette-button').on('click', newPaletteOnClick);
$('#project-name-input').on('input', enableProjectSaveButton);
$('#save-project-button').on('click', onSaveProjectClick);
$('#drop-down-menu-container').on('click', '.projects', liOnClick);
$('#save-palette-button').on('click', onSavePaletteClick);
$('#projects-container').on('click', '.delete-palette-button', deletePaletteOnClick)
                        .on('click', '.project-delete-button', deleteProjectOnClick)
                        .on('click', '.saved-palette-card', onPaletteCardClick);

function Project(name) {
  this.name = name;
}

function Palette(name, array) {
  this.name = name;
  this.color1 = array[0];
  this.color2 = array[1];
  this.color3 = array[2];
  this.color4 = array[3];
  this.color5 = array[4];
}

function addProjectToDB(project) {
  fetch('/api/v1/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: project.name })
  })
  .then(response => {
    if(response.status === 201) {
      return response.json();
    }
  })
  .then(parsedResponse => {
    prependProject(parsedResponse);
    prependProjectLi(parsedResponse.name);
  })
  .catch(error => alert(error));
}

function fetchProjectsFromDB() {
  return fetch(`/api/v1/projects`)
  .then(response => response.json())
  .then(projectsArray => {
    projectsArray.forEach(project => {
      prependProject(project);
      prependProjectLi(project.name);
    })
    fetchProjectPalettesFromDB(projectsArray);
  })
  .catch(error => alert(error));
}

function deleteProjectFromDB(id) {
  fetch(`/api/v1/projects/${id}`, {
    method: 'DELETE'
  })
  .then(response => console.log(response))
  .catch(error => console.log(error))
}

function fetchProjectPalettesFromDB(projects) {
  let target;
  projects.forEach( project => {
    fetch(`/api/v1/projects/${project.id}/palettes`)
    .then(response => {
      if(response.status === 200) {
        return response.json();
      }
    })
    .then(palettesArray => palettesArray.forEach(palette => {
      const { project_id } = palette;
      target = $(`#${project_id}`);
      appendProjectCard(target, palette);
    }))
    .catch(error => console.log(error));
  })
}

function postPaletteToProject(id, palette, target) {
  fetch(`/api/v1/projects/${id}/palettes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(palette)
  })
  .then(response => response.json())
  .then(parsedResponse => appendProjectCard(target, parsedResponse))
  .catch(error => console.log(error));
}

function deletePaletteFromDB(id, target) {
  fetch(`/api/v1/palettes/${id}`, {
    method: 'DELETE'
  })
  .then(response => target.remove())
  .catch(error => console.log(error))
}

function newPaletteOnClick() {
  let color;
  let button;
  for(let i = 1; i < 6; i++) {
    color = generateRandomColor();
    button = $(`#color${i}`).siblings('button').attr('class');
    if(button !== 'lock-button locked') {
      $(`#color${i}`).text(color);
      $(`#color${i}`).closest('.colors').css('background-color', color);
    }
  }
}

function onSaveProjectClick() {
  const userInput = $('#project-name-input').val();
  const newProject = new Project(userInput);
  addProjectToDB(newProject);
  $('#project-name-input').val('');
  enableProjectSaveButton();
}

function deleteProjectOnClick() {
  const id = $(this).closest('.project-cards').attr('id');
  deleteProjectFromDB(id);
  const projectTitle = $(this).siblings().text();
  const li = $('.projects');
  li.each(function(index, element) {
    let elText = $(element).text();
    if(projectTitle === elText) {
      element.remove();
    }
 })
  $(this).closest('.project-cards').remove();
}

function liOnClick() {
 let text = $(this).text();
 $('#projects-menu').text(text);
 $('.hidden-list').toggleClass('visible-list')
}

function onSavePaletteClick() {
  const userInput = $('#palette-name').val();
  const newPalette = new Palette(userInput, colorsArray());
  const projectName = $('#projects-menu').text();
  if(projectName !== 'Project Name' && userInput !== '') {
    let target;
    let projectTitle;
    let id;
    $('#projects-container').children().each(function(index, element) {
      projectTitle = $(element).find('h4').text();
      if(projectTitle === projectName) {
        target = $(element);
        id = $(element).attr('id');
        const duplicate = checkForDuplicatePaletteName(target, userInput);
        return duplicate
               ? alert('Palette name already exits!')
               : postPaletteToProject(id, newPalette, target);
        }
      })
    $('#palette-name').val('');
  } else {
    return alert('Please select a project or create one!')
  }
}

function deletePaletteOnClick() {
  const id = $(this).closest('.user-saved-palette').attr('id');
  const palette = $(this).closest('.user-saved-palette');
  deletePaletteFromDB(id, palette);
}

function onPaletteCardClick() {
  let hexCode;
  const text = $(this).find('.palette-card-hex-text');
  text.each(function(index) {
  hexCode = $(this).text();
  $(`#color${index + 1}`).text(hexCode);
  $(`#color${index + 1}`).closest('.colors').css('background-color', hexCode);
  })
}

function projectListOnClick() {
  $('.hidden-list').toggleClass('visible-list')
}

function prependProject(project) {
  $('#projects-container').prepend(
    `<article class="project-cards" id=${project.id}>
      <div class="project-cards-top-section">
        <h4>${project.name}</h4>
        <button type="button" name="project-delete-button" class='project-delete-button'></button>
      </div>
      <div class="project-cards-bottom-section">
      </div>
    </article>`
  )
}

function prependProjectLi(name) {
  $('.hidden-list, .visible-list').prepend(`
    <li class='projects'>${name}</li>
  `)
}

function appendProjectCard(target, palette) {
  const { name, color1, color2, color3, color4, color5, id} = palette;
  target.append(`
  <article class="user-saved-palette" id='${id}'>
    <section class='project-cards-left-section'>
      <h5>${name}</h5>
    </section>
    <section class='project-cards-right-section'>
      <div class="saved-palette-card">
        <article class="palette-card-article" style='background-color:${color1}'>
          <p class='palette-card-hex-text'>${color1}</p>
        </article>
        <article class="palette-card-article" style='background-color:${color2}'>
          <p class='palette-card-hex-text'>${color2}</p>
        </article>
        <article class="palette-card-article" style='background-color:${color3}'>
          <p class='palette-card-hex-text'>${color3}</p>
        </article>
        <article class="palette-card-article" style='background-color:${color4}'>
          <p class='palette-card-hex-text'>${color4}</p>
        </article>
        <article class="palette-card-article" style='background-color:${color5}'>
          <p class='palette-card-hex-text'>${color5}</p>
        </article>
        <div class="delete-button-div">
          <button type="button" name="delete-palette-button" class='delete-palette-button'></button>
        </div>
      </div>
    </section>
  </article>`
  )
}

function lockColor() {
  $(this).toggleClass('locked');
}

function onMouseEnter() {
  $('#drop-down-icon').attr('src', './assets/arrow.svg');
}

function onMouseLeave() {
  $('#drop-down-icon').attr('src', './assets/arrow-hover.svg');
}

function generateRandomColor() {
  const characters = `0123456789ABCDEF`;
  let color = `#`;
  for (let i = 0; i < 6; i++) {
    color += characters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function enableProjectSaveButton() {
  const userInput = $('#project-name-input').val();
  if(userInput !== '') {
    $('#save-project-button').prop('disabled', false);
  } else {
    $('#save-project-button').prop('disabled', true);
  }
}

function checkForDuplicatePaletteName(target, name) {
  let text;
  let array = [];
  const palettes = $(target).find('.user-saved-palette');
  palettes.each(function(index, element) {
    text = $(element).find('h5').text();
    array.push(text);
  })
  return array.includes(name);
}

function colorsArray() {
  let text;
  let array = [];
  for(let i = 1; i < 6; i++) {
    text = $(`#color${i}`).text();
    array.push(text);
  }
  return array;
}
