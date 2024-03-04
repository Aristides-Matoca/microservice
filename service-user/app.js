const express = require('express')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/userServiceDB', { //Conectar o back com o mongoDB e criar a base dados userServiceDB
    useNewUrlParser: true,
})

const userSchema = new mongoose.Schema({ //definindo os atributos da tabela user
    username: String,
    password: String
})

const User = mongoose.model('User', userSchema) //criando a tabela e os seus atributos

app.post('/user', async(req, res) => { //logica para adicionar users
    const { username, password } = req.body //recebe os dados
    const user = new User({ username, password }) //E insere-os

    try { //E arnazena da tabela users
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.post('/login', async(req, res) => { //Validar user
    const { username, password } = req.body //recebe os dados do user
    
    try {
        const user = await User.findOne({ username, password }) //verifica se o user existe

        if (!user) {
            return res.status(404).send('User not found')
        }
        res.send({message: 'user logged in'})

    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.get('/user/:id', async(req, res) => { //procurar o user pelo id
    const id = req.params.id //recebe o id enviado
    try {
        const user = await User.findById(id) //procura o user pelo id
        if (!user) {
            return res.status(404).send('User not found')
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

const PORT = 3001 //criar uma porta para o back
app.listen(PORT, () => {
    console.log(`User Service is running on port ${PORT}`)
})