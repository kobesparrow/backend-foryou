const express = require('express');
const cors = require('cors');

const app = express()
app.use(cors())
app.use(express.json())

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.get('/api/v1/papers', (request, response) => {
  database('papers').select()
    .then((papers) => {
      response.status(200).json(papers);
    })
    .catch((error) => {
      response.status(404).json({ error });
    });
});

app.get('/api/v1/footnotes', (request, response) => {
  database('footnotes').select()
    .then((footnotes) => {
      response.status(200).json(footnotes); 
    })
    .catch((error) => {
      response.status(404).json({ error })
    });
});

app.post('/api/v1/papers', (request, response) => {
  const paper = request.body;

  for (let requiredParameter of ['title', 'author']) {
    if (!paper[requiredParameter]) {
      return response.status(422).send({ error: `Expected format: { title: <String>, author: <String> }. You're missing a "${requiredParameter}" property.` })
    }
  }

  database('papers').insert(paper, 'id')
    .then(paper => {
      response.status(201).json({ id: paper[0] })
    })
    .catch(error => {
      response.status(500).json({ error })
    });
});

app.post('/api/v1/footnotes', (request, response) => {
  const footnote = request.body

  for (let requiredParameter of ['note', 'paper_id']) {
    if (!footnote[requiredParameter]) {
      return response.status(422).send({ error: `Expected format: { note: <String>, paper_id: <Number> }. You're missing a "${requiredParameter}" property.` })
    }
  }

  database('footnotes').insert(footnote, 'id')
    .then(footnote => {
      response.status(201).json({ id: footnote[0] })
    })
    .catch(error => {
      response.status(500).json({ error })
    });
});

app.get('/api/v1/papers/:id', (request, response) => {
  database('papers').where('id', request.params.id).select()
    .then(papers => {
      if (papers.length) {
        response.status(200).json(papers)
      } else {
        response.status(404).json('Item Not Found, idiot')
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    })
});

app.get('/api/v1/papersNotes/:id', (request, response) => {
  database('footnotes').where('paper_id', request.params.id).select()
    .then(footnotes => {
      if (footnotes.length) {
        response.status(200).json(footnotes)
      } else {
        response.status(404).json('Footnotes not found, bro')
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    });
});

app.delete('/api/v1/papers/:id', (request, response) => {
  const toDelete = request.params.id;

  database('papers').where('id', toDelete).del()
    .then(() => {
      response.status(200).json('deleted man!')
    })
    .catch(error => {
      response.status(500).json({ error })
    })
    
})

module.exports = app;