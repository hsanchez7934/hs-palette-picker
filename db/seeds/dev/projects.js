
exports.seed = function(knex, Promise) { //begin data seeding for dev environment
  return knex('palettes').del() // Deletes ALL existing entries in palettes table
  .then(() => knex('projects').del())  // Deletes ALL existing entries in projects table
  .then(() => {
    return Promise.all([  //return promise
      knex('projects').insert({  //insert project with name Project 1 and id
        name: 'Project 1'
      }, 'id')
      .then( project => {  //return promise
        return knex('palettes').insert([ //insert palettes Summer and Winter that relate to Project 1
          { name: 'Summer',
            project_id: project[0],
            color1: "#F264DE",
            color2: "#9F51D9",
            color3: "#B54E1D",
            color4: "#310B41",
            color5: "#B6DDB0"
          },
          { name: 'Winter',
            project_id: project[0],
            color1: "#84E670",
            color2: "#D529F6",
            color3: "##28BC75",
            color4: "##A2656D",
            color5: "#A1C7E9"
          }
        ])
      })
      .then(() => console.log('Seeding dev complete!'))  //console log is seeding was successful
      .catch(error => console.log(`Error seeding data: ${error}`)) // console log if seeding was unsuccessful
    ])
  })
  .catch(error => console.log(`Error seeding data: ${error}`));
};
