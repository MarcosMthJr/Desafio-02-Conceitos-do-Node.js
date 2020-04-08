const express = require("express");
const cors = require("cors");

const {uuid, isUuid} = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// Middleware para verificar se o id é válido.
function validateRepositoryId(requeste, response, next) {
  const {id} = requeste.params;
  if(!isUuid(id)){
    return response.status(400).json({error: "Ivalid repository ID"});
  }
  return next();
}
app.use('/repositories/:id', validateRepositoryId);
app.use('/repositories/:id/like', validateRepositoryId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repository =  {id: uuid(), title, url, techs, likes : 0};
  repositories.push(repository); 
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs, likes} = request.body;
  const repositoryIndex =  repositories.findIndex(
      repository=>repository.id === id
  );

  if(repositoryIndex<0){
    return response.status(400).json({error: "Repository not found!"});
  }

  const repository = {
    id,
    title, 
    url,
    techs,
    likes : repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository;
  return response.json(repository);    
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repositoryIndex = repositories.findIndex(
    repository=>repository.id ===id
  );
  if(repositoryIndex < 0){
    return response.status(400).json({error:"Repository not found!"});
  }
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(
    repository=>repository.id ===id
  );
  if(repositoryIndex < 0){
    return response.status(400).json({error: "Repository not found!"});
  }
  // somando likes ao repositório que foi retornado na busca
  repositories[repositoryIndex].likes++;
  return response.json(repositories[repositoryIndex]);
  
});

module.exports = app;
