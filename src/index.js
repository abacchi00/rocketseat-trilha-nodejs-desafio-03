const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

const findRepositoryByParamsId = (request, response, next) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repositoryIndex = repositoryIndex;
  request.repository = repositories[repositoryIndex];

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", findRepositoryByParamsId, (request, response) => {
  const { repository } = request;
  const updatedRepository = request.body;

  const newRepository = { ...repository, ...updatedRepository, likes: repository.likes };

  repositories[repositoryIndex] = newRepository;

  return response.json(newRepository);
});

app.delete("/repositories/:id", findRepositoryByParamsId, (request, response) => {
  const { repositoryIndex } = request;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", findRepositoryByParamsId, (request, response) => {
  const { repository } = request;

  repository.likes++;

  return response.json(repository);
});

module.exports = app;
