/* API REST dos prestadores */
import express from "express"
import { connectToDatabase } from '../utils/mongodb.js'
import { check, ExpressValidator, validationResult } from "express-validator"

const router = express.Router()
const {db, ObjectId} = await connectToDatabase()
const nomeCollection = 'prestadores'

const validaPrestador = [
    check('cnpj').not()
    .isEmpty().trim().withMessage('É obrigatório informar o CNPJ')
    .isNumeric().withMessage('O CNPJ só deve conter números')
    .isLength({min: 14, max: 14}).withMessage('O CNPJ deve conter 14 n°s'),
    check('razao_social').not()
    .isEmpty().trim().withMessage('É obrigatório informar a razão social')
    .isAlphanumeric('pt-BR', {ignore: '/. '}).withMessage('A razão social não deve conter caracteres especiais')
    .isLength({min: 5}).withMessage('A razão social é muito curta. Minimo de 5 caracteres')
    .isLength({max: 200}).withMessage('A razão social é muito longa. Maximo de 200 caracteres'),
    check('cnae_fiscal')
    .isNumeric().withMessage('O código do CENAE deve ser um número'),
    check('nome_fantasia').optional({nullable: true})
]

/*
* GET /api/prestadores
* Lista todos os prestadores do serviço
*/
router.get('/', async(req, res) => {
    try{
        db.collection(nomeCollection).find().sort({razao_sosial: 1}).toArray((err, docs) => {
            if(!err){
                res.status(200).json(docs)
            }
        })
    }catch(err){
        res.status(500).json({
            errors: [{
                value: `${err.message}`,
                msg: 'Erro ao obter a lista dos prestadores',
                param: '/'
            }]
        })
    } 
})

/*
* GET /api/prestadores/id/:id
* Lista todos os prestadores do serviço
*/
router.get('/id/:id', async(req, res) => {
    try{
        db.collection(nomeCollection).find({'_id': {$eq: ObjectId(req.params.id)}}).toArray((err, docs) => {
            if(err){
                res.status(400).json(err) // bad request
            }else{
                res.status(200).json(docs) // retorna o documento
            }
        })
    }catch(err){
        res.status(500).json({"error": err.message})
    }
})

/*
* GET /api/prestadores/razao/:razao
* Lista todos os prestadores do serviço pela razao social
*/
router.get('/razao/:razao', async(req, res) => {
    try{
        db.collection(nomeCollection).find({'razao_social': {$regex: req.params.razao, $options: "i"}}).toArray((err, docs) => {
            if(err){
                res.status(400).json(err) // bad request
            }else{
                res.status(200).json(docs) // retorna o documento
            }
        })
    }catch(err){
        res.status(500).json({"error": err.message})
    }
})

/*
* DELET /api/prestadores/:id
* Apaga o prestadore de serviço pela id
*/
router.delete('/:id', async(req, res) => {
    await db.collection(nomeCollection)
    .deleteOne({"_id": {$eq: ObjectId(req.params.id)}})
    .then(result => res.status(200).send(result))
    .catch(err => res.status(400).json(err))
})

/*
* POST /api/prestadores
* Insere um novo prestador de serviço
*/
router.post('/', validaPrestador, async(req, res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json(({
            errors: errors.array()
        }))
    }else{
        await db.collection(nomeCollection)
        .insertOne(req.body)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).json(err))
    }
})

/*
* PUT /api/prestadores
* Altera um prestador de serviço
*/
router.put('/', validaPrestador, async(req, res) =>{
    let idDocumento = req.body._id // armazena o id do documento
    delete req.body._id // iremos remover o id do body

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json(({
            errors: errors.array()
        }))
    }else{
        await db.collection(nomeCollection)
        .updateOne({'_id': {$eq: ObjectId(idDocumento)}},{$set: req.body})
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).json(err))
    }
})

export default router
