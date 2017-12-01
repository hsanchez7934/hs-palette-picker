$(document).ready(newPaletteOnClick);
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
$('#projects-container').on('click', '.delete-palette-button', deletePalette)
                        .on('click', '.project-delete-button', deleteProject)
                        .on('click', '.saved-palette-card', onPaletteCardClick);

function lockColor() {
  $(this).toggleClass('locked');
}

function onMouseEnter() {
  $('#drop-down-icon').attr('src', './assets/arrow.svg');
}

function onMouseLeave() {
  $('#drop-down-icon').attr('src', './assets/arrow-hover.svg');
}

function projectListOnClick() {
  $('.hidden-list').toggleClass('visible-list')
}

function generateRandomColor() {
  const characters = `0123456789ABCDEF`;
  let color = `#`;
  for (let i = 0; i < 6; i++) {
    color += characters[Math.floor(Math.random() * 16)];
  }
  return color;
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

function enableProjectSaveButton() {
  const userInput = $('#project-name-input').val();
  if(userInput !== '') {
    $('#save-project-button').prop('disabled', false);
  } else {
    $('#save-project-button').prop('disabled', true);
  }
}

function onSaveProjectClick() {
  const userInput = $('#project-name-input').val();
  prependProject(userInput);
  prependProjectLi(userInput);
  $('#project-name-input').val('');
  enableProjectSaveButton();
}

function prependProject(title) {
  $('#projects-container').prepend(
    `<article class="project-cards" id=${title}>
      <div class="project-cards-top-section">
        <h4>${title}</h4>
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

function liOnClick() {
 let text = $(this).text();
 $('#projects-menu').text(text);
 $('.hidden-list').toggleClass('visible-list')
}

function onSavePaletteClick() {
  let userInput = $('#palette-name').val();
  let id = $('#projects-menu').text();
  if(id !== 'Project Name' && userInput !== '') {
    let target = $(`#${id}`);
    appendProjectCard(target, userInput, colorsArray());
    $('#palette-name').val('');
  } else {
    return alert('Please select a project or create one!')
  }
}

function appendProjectCard(target, name, array) {
  target.append(`
  <article class="user-saved-palette">
    <section class='project-cards-left-section'>
      <h5>${name}</h5>
    </section>
    <section class='project-cards-right-section'>
      <div class="saved-palette-card">
        <article class="palette-card-article" style='background-color:${array[0]}'>
          <p class='palette-card-hex-text'>${array[0]}</p>
        </article>
        <article class="palette-card-article" style='background-color:${array[1]}'>
          <p class='palette-card-hex-text'>${array[1]}</p>
        </article>
        <article class="palette-card-article" style='background-color:${array[2]}'>
          <p class='palette-card-hex-text'>${array[2]}</p>
        </article>
        <article class="palette-card-article" style='background-color:${array[3]}'>
          <p class='palette-card-hex-text'>${array[3]}</p>
        </article>
        <article class="palette-card-article" style='background-color:${array[4]}'>
          <p class='palette-card-hex-text'>${array[4]}</p>
        </article>
        <div class="delete-button-div">
          <button type="button" name="delete-palette-button" class='delete-palette-button'></button>
        </div>
      </div>
    </section>
  </article>`
  )
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

function deletePalette() {
  $(this).closest('.user-saved-palette').remove();
}

function deleteProject() {
  let projectTitle = $(this).siblings().text();
  let li = $('.projects');
  li.each(function(index, element) {
    let el = $(element).text();
    if(projectTitle === el) {
      element.remove();
    }
 })
  $(this).closest('.project-cards').remove();
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
