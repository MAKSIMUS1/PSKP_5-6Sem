const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = 3000;

app.use(bodyParser.json());
/**
 * @swagger
 * components:
 *   schemas:
 *     PhoneBookEntry:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - phone
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the phone entry
 *         name:
 *           type: string
 *           description: Name of the person
 *         phone:
 *           type: string
 *           description: Phone number of the person
 *       example:
 *         id: 1
 *         name: John Doe
 *         phone: 123-456-7890
 */

/**
 * @swagger
 * tags:
 *   name: PhoneBook
 *   description: The phone book managing API
 */

let phoneBook = [
  { id: 1, name: "John Doe", phone: "123-456-7890" },
  { id: 2, name: "Jane Doe", phone: "098-765-4321" }
];

/**
 * @swagger
 * /TS:
 *   get:
 *     summary: Returns the list of all the phone book entries
 *     tags: [PhoneBook]
 *     responses:
 *       200:
 *         description: The list of the phone book entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PhoneBookEntry'
 */
app.get('/TS', (req, res) => {
  res.json(phoneBook);
});

/**
 * @swagger
 * /TS:
 *   post:
 *     summary: Create a new phone book entry
 *     tags: [PhoneBook]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PhoneBookEntry'
 *     responses:
 *       201:
 *         description: The phone book entry was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PhoneBookEntry'
 *       500:
 *         description: Some server error
 */
app.post('/TS', (req, res) => {
  const newEntry = req.body;
  phoneBook.push(newEntry);
  res.status(201).json(newEntry);
});

/**
 * @swagger
 * /TS:
 *   put:
 *     summary: Update an existing phone book entry
 *     tags: [PhoneBook]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PhoneBookEntry'
 *     responses:
 *       200:
 *         description: The phone book entry was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PhoneBookEntry'
 *       404:
 *         description: The entry was not found
 *       500:
 *         description: Some error happened
 */
app.put('/TS', (req, res) => {
  const { id, name, phone } = req.body;
  const entry = phoneBook.find(entry => entry.id === id);
  if (entry) {
    entry.name = name;
    entry.phone = phone;
    res.json(entry);
  } else {
    res.status(404).json({ message: 'Entry not found' });
  }
});

/**
 * @swagger
 * /TS:
 *   delete:
 *     summary: Remove an existing phone book entry
 *     tags: [PhoneBook]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       204:
 *         description: The phone book entry was deleted
 *       404:
 *         description: The entry was not found
 *       500:
 *         description: Some error happened
 */
app.delete('/TS', (req, res) => {
  const { id } = req.body;
  phoneBook = phoneBook.filter(entry => entry.id !== id);
  res.status(204).send();
});

const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Phone Book API',
        version: '1.0.0',
        description: 'A simple Express Phone Book API'
      },
      servers: [
        {
          url: 'http://localhost:3000',
        },
      ],
    },
    apis: ['./index.js'],
  };

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
