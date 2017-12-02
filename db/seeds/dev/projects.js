
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('palettes').del()
  .then(() => knex('projects').del())
  .then(() => {
    return Promise.all([
      knex('projects').insert({
        name: 'Project 1'
      }, 'id')
      .then( project => {
        return knex('palettes').insert([
          { name: 'Summer', project_id: project[0] },
          { name: 'Coolers', project_id: project[0] }
        ])
      })
      .then(() => console.log('Seeding complete!'))
      .catch(error => console.log(`Error seeding data: ${error}`))
    ])
  })
  .catch(error => console.log(`Error seeding data: ${error}`));
};
