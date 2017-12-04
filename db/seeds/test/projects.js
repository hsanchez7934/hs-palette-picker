// knex migrate:latest --env test
// knex seed:run --env test

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('palettes').del()
  .then(() => knex('projects').del())
  .then(() => {
    return Promise.all([
      knex('projects').insert([
        { name: 'Project 2', id: 1},
        { name: 'Project 3', id: 2},
        { name: 'Project 4', id: 3}
        ])
      .then( project => {
        return knex('palettes').insert([
          { name: 'Spring',
            id: 4,
            project_id: 1,
            color1: "#8579E4",
            color2: "#9F51D9",
            color3: "#38182F",
            color4: "#2F394D",
            color5: "#EEE1B3"
          },
          { name: 'Winter',
            id: 5,
            project_id: 1,
            color1: "#9D8DF1",
            color2: "#B8CDF8",
            color3: "#2F394D",
            color4: "#95F2D9",
            color5: "#1CFEBA"
          },
          { name: 'Mountains',
            id: 6,
            project_id: 2,
            color1: "#545F66",
            color2: "#829399",
            color3: "#D0F4EA",
            color4: "#E8FCC2",
            color5: "#B1CC74"
          },
          { name: 'Valleys',
            id: 7,
            project_id: 3,
            color1: "#022F40",
            color2: "#38AECC",
            color3: "#0090C1",
            color4: "#183446",
            color5: "#046E8F"
          }
        ])
      })
      .then(() => console.log('Seeding test complete!'))
      .catch(error => console.log(`Error seeding data: ${error}`))
    ])
  })
  .catch(error => console.log(`Error seeding data: ${error}`));
};
