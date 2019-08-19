const papersData = require('../paperData')

const createPaper = (knex, paper) => {
  return knex('papers').insert({
    title: paper.title,
    author: paper.author
  }, 'id')
    .then(paperId => {
      let footnotePromises = [];

      paper.footnotes.forEach(footnote => {
        footnotePromises.push(
          createFootnote(knex, {
            note: footnote,
            paper_id: paperId[0]
          })
        )
      });

      return Promise.all(footnotePromises);
    })
};

const createFootnote = (knex, footnote) => {
  return knex('footnotes').insert(footnote);
};

exports.seed = (knex) => {
  return knex('footnotes').del() // delete footnotes first
    .then(() => knex('papers').del()) // delete all papers
    .then(() => {
      let paperPromises = [];

      papersData.forEach(paper => {
        paperPromises.push(createPaper(knex, paper));
      });

      return Promise.all(paperPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};


// exports.seed = function (knex) {
//   return knex('footnotes').del()
//     .then(() => knex('papers').del())
    
//     .then(() => {
//       return Promise.all([
//         knex('papers').insert({ title: 'Toilets', author: 'Carl', publisher: 'Steve' }, 'id'),
//         knex('papers').insert({ title: 'Big', author: 'Smelly', publisher: 'Farts' }, 'id')
//         .then(paper => {
//           return knex('footnotes').insert([
//             { note: 'Good', paper_id: paper[0] },
//             { note: 'Day', paper_id: paper[0] }
//           ])
//         })
//         .then(() => console.log('Seeding Complete'))
//         .catch(error => Console.log(`Error: ${error}`))
//       ])
//     })
//     .catch(error => Console.log(`error: ${error}`))
// };
