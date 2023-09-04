import express from "express"

const app = express()
const port = 4000

app.use(express.json()) // irá fazer o parse do arquivo JSON
// Rotas de contúdo público
app.use('/', express.static('public'))
// Configura o favicon
app.use('/favicon.ico', express.static('public/imagens/pc.png'))
// Rotas da API
app.get('/api', (req, res) => {
    res.status(200).json({
        message: 'API Fatec 100% funcional🖐',
        version: '1.0.0'
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
