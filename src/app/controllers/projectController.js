const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Project = require('../models/project');
const Task = require('../models/task');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const project = await Project.find().populate(['user', 'tasks']);
    res.send({ projects });
  } catch (err) {
    return res.status(400).send({ error: 'Error loading new project.'})
  }
});

router.get('/:projectId', async (req, res)=> {
  try {
    const { title, description, tasks} = req.body;

    const project = await Project.findByIdAndUpdate(req.params.projectId, {
       title, 
       description
      }, { new: true });

    project.task = [];
    await task.remove({ project: project._id })
    await Promise.all(tasks.map( async task => {
      const projectTask = new Task ({...task, project: project._id });

     await projectTask.save(); 
     project.task.push(projectTask);
    }));

    await project.save();

  } catch (err) {
    return res.status(400).send({ error: 'Error updating new project.'})
  }
});

router.post('/', async (req, res)=> {
  try {
    const { title, description, tasks} = req.body;

    const project = await Project.create({ title, description, user: req.userId });

    await Promise.all(tasks.map( async task => {
      const projectTask = new Task ({...task, project: project._id });

     await projectTask.save(); 
     project.task.push(projectTask);
    }));

    await project.save();

  } catch (err) {
    return res.status(400).send({ error: 'Error creating new project.'})
  }
});

router.put('/:projectId', async (req, res)=> {
  try {

  } catch (err) {
    return res.status(400).send({ error: '.'})
  }
});

router.delete('/:projectId', async (req, res)=> {
  try {
    const project = await Project.findByIdAndRemove(req.params.projectId).populate('user');
    
  } catch (err) {
    return res.status(400).send({ error: 'Error deleting a project.'})
  }
});

module.exports = app => app.use('/projects', router);