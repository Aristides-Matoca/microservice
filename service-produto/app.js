const express = require('express')
const sqlite3 = require('sqlite3')
const axios = require('axios')

const app = express()
app.use(express.json())

//Cria uma base de dados 'produtos' no sqlite
const db = new sqlite3.Database('produtos.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message)
    }
    console.log('Connected to the SQL db')
    //cria uma tabela produtos caso nao exista e define os atributos da tabela
    db.run('CREATE TABLE IF NOT EXISTS produtos (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, userId STRING)')
})


app.post('/produto', async (req, res) => { //adicionar os dados do produto
    const { userId, name, description } = req.body //recebe os dados
    try {
        const userResponse = await axios.get(`http://localhost:3001/user/${userId}`) //usa o userId para veificar se o user existe
        if (!userResponse.data) {
            return res.status(401).send('User not exists')
        }

        //insere os dados na tabela produtos
        db.run('INSERT INTO produtos (name, description, userId) VALUES (?, ?, ?)', [name, description, userId], function(err) {
            if(err) {
                return res.status(500).send(err.message)
            }
            res.status(201).send({id: this.lastID})
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send('Error is adding product')
    }
})

const PORT = 3000 //criar uma porta para o back
app.listen(PORT, () => {
    console.log('Products working on ' + PORT)
})