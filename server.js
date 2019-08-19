const app = require('./app');

app.set('port', process.env.port || 3000);

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`)
})