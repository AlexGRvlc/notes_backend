const express = require("express");
const app = express();
const cors = require('cors')

app.use(express.json());

app.use(cors())

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hola Mundo!</h1>");
});

app.get("/api/notes", (request, response) => {
  response.send(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);

  if (!note) {
    response.status(404).json({
      error: "Not Found",
    });
    // response.status(404).end();
    return;
  }

  response.send(note);
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end();
});

app.post("/api/notes", (request, response) => {
  const note = request.body;

  if (!note) {
    response.status(404).json({
      error: "Note is missing",
    });
    return;
  }

  if (note.content.trim() === "") {
    response.status(404).json({
      error: "The note cannot be empty",
    });
    return;
  }

  const ids = notes.map((note) => note.id);
  const maxId = Math.max(...ids);

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: note.important || false,
  };

  notes = [...notes, newNote];
  response.send(newNote);
});

app.put('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  const { content, important } = req.body;

  const noteIndex = notes.findIndex(note => note.id === id);
  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }

  const updatedNote = { ...notes[noteIndex], content, important };
  notes[noteIndex] = updatedNote;

  res.json(updatedNote);

});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server Running at PORT ${PORT}`);
});
