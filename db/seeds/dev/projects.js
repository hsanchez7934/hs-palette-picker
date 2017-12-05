
exports.seed = function(knex, Promise) {
  return knex('palettes').del()
  .then(() => knex('projects').del())
  .then(() => {
    return Promise.all([
      knex('projects').insert({
        name: 'Project 1'
      }, 'id')
      .then( project => {
        return knex('palettes').insert([
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
      .then(() => console.log('Seeding dev complete!'))
      .catch(error => console.log(`Error seeding data: ${error}`))
    ])
  })
  .catch(error => console.log(`Error seeding data: ${error}`));
};
