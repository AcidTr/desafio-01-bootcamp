const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

let counter = 1;

server.use((req, res, next) => {

  console.log(counter);

  next();

});

function checkIdTitleProjectExist(req, res, next) {
  if (!(req.body.id) && !(req.body.title)) {

    return res.status(400).json({ error: 'Project id and title is required' });

  } else if (!(req.body.id)) {

    return res.status(400).json({ error: 'Project id is required' });

  } else if (!(req.body.title)) {

    return res.status(400).json({ error: 'Project title is required' });

  }

  return next();
}

function checkTitleProjectExist(req, res, next) {
  if (!req.body.title) {

    return res.status(400).json({ error: 'Attribute title is required' })

  }

  return next();
}

function checkIdParamProjectExist(req, res, next) {
  if (!(req.params.id)) {
    return res.status(400).json({ error: 'Project id param is required' });
  }
  const { id } = req.params;

  const index = projects.findIndex((element) => {
    if (element.id === id) {
      return true
    }
    return false;
  });

  if (index === -1) {
    return res.status(400).json({ error: 'Project not found' });
  }
  req.index = index;

  return next();
}

server.post('/projects', checkIdTitleProjectExist, (req, res) => {
  counter++;
  const { id, title } = req.body;
  projects.push({
    id,
    title,
    tasks: []
  });
  return res.json(projects);
});

server.get('/projects', (req, res) => {
  counter++;

  return res.json(projects);

});

server.put('/projects/:id', checkIdParamProjectExist, checkTitleProjectExist, (req, res) => {

  counter++;

  const index = req.index;
  console.log(req.body.title)
  console.log(projects[index]);

  projects[index] = { ...projects[index], title: req.body.title };

  console.log(projects[index]);

  return res.json({ project: projects, index: index });
});

server.delete('/projects/:id', checkIdParamProjectExist, (req, res) => {

  counter++;

  const index = req.index;

  projects.splice(index, 1);

  return res.send();
});

server.post('/projects/:id/tasks', checkIdParamProjectExist, checkTitleProjectExist, (req, res) => {

  counter++;

  const index = req.index;

  projects[index].tasks.push(req.body.title);

  return res.json(projects);
});


server.listen(3000);