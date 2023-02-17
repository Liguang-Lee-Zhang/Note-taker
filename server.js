const express = require('express');
const path = require('path');
const fs = require('fs');
// Helper method for generating unique ids
const { v4: uuidv4 } = require('uuid');

const notes = require('./db/notes.json');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET request for notes
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/db/notes.json'));
    // res.json(notes);
    // Log our request to the terminal
    console.info(`${req.method} request received to get notes`);
});


app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// POST request to add a note
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
            id: uuidv4()
        };
        console.log(newNote);

        // Obtain existing reviews
        fs.readFile('./db/notes.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                // Convert string into JSON object
                const parsedNotes = JSON.parse(data);

                // Add a new review
                parsedNotes.push(newNote);

                // Write updated reviews back to the file
                fs.writeFile(
                    './db/notes.json',
                    JSON.stringify(parsedNotes, null, 4),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully updated notes!')
                );
            }
        });

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        // res.status(201).json(response);
    } else {
        res.status(500).json('The note must have a title and body!');
    }
});

app.listen(PORT, () =>
    console.log(`App listening at ${PORT} 🚀`)
);
