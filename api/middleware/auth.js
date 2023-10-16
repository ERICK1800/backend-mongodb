import { Jwt } from "jsonwebtoken";

export default async function auth(req, res, next){
    const token = req.header('access-token') || req.headers['x-access-token']
    if (!token) return res.status(401).json({mensagem: 'Acesso negado. É obrigatório o envio do token JWT'}) // 401 - Unauthorized
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        /* O decoded irá conter:
        usuário (playload do usuário)
        exp (expiration) - Data de expedição
        iat (issued at) - Data de criação
        */
        req.usuario = await decoded.usuario
        next() // direcionamos para o endpoint
    } catch (e) {
        res.status(403).send({ error: `Token inválido: ${e.mensagem}`})
        console.error(e.mensagem)
    }
}
