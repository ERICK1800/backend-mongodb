import express from "express"

import cors from 'cors'
const app = express()
const port = 4000
//import das rotasda app
import rotasPrestadores from './routes/prestador.js'
import rotasUsuarios from './routes/usuario.js'

//Habilita o CORS Cross-Origin resource sharing
app.use(cors({
    origin: ['http://127.0.0.1:5500','http://localhost:4000'] //informe outras URL´s se necessário
  }));
app.use(express.json()) // irá fazer o parse do arquivo JSON

// Rotas de contúdo público
app.use('/', express.static('public'))

// Configura o favicon
app.use('/favicon.ico', express.static('public/imagens/pc.png'))

// Rotas da API
app.use('/api/prestadores', rotasPrestadores)
app.use('/api/usuarios', rotasUsuarios)

app.get('/api', (req, res) => {
    res.status(200).json({
        message: 'API Fatec 100% funcional🖐',
        version: '1.0.2'
    })
})

// Rotas de Exeção - deve ser a ultima!
app.use(function(req, res){
    res.status(404).json({
        errors: [{
            value: `${req.originalUrl}`,
            msg: `A rota ${req.originalUrl} não existe nesta API`,
            param: `invalid rout`
        }]
    })
})
app.listen(port, function(){
    console.log(`💻 Servidor rodando na porta ${port}`)
})
