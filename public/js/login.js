const urlBase = 'https://backend-mongodb-erick.vercel.app/api'
//const urlBase = 'http://localhost:4000/api'

//monitorando o submit do formulário
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault()
    const login = document.getElementById("login").value
    const senha = document.getElementById("senha").value
    const resultadoModal = new bootstrap.Modal(document.getElementById("modalMensagem"))

    // Dados do usuário para autenticação
    const dadosLogin = {
        email: login,
        senha: senha
    }

    //Efetuando o post para a API REST
    fetch(`${urlBase}/usuarios/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosLogin)
    }).then(response => response.json()).then(data => {
        //verifica se o teoken foi retornado
        if (data.access_token) {
            //armazena n localstorage
            localStorage.setItem('token', data.access_token)
            window.location.href= 'menu.html'
        }else if(data.errors){ //possui algum erro?
            const errorMessages = data.errors.map(error => error.msg).join('<br>')
            //alert('Falha ao efetuar o login:\n'+errorMessages)
            document.getElementById('mensagem').innerHTML = `<span class='text-danger'>${errorMessages}</span>`
            resultadoModal.show() //abre o modal
        }else{
            document.getElementById("mensagem").innerHTML = `<span class='text-danger'>Não foi possível efetuar o login. Verifique as suas credenciais</span>`
            resultadoModal.show();
        }
    }).catch(error => {
        console.error(`Erro no login ${error}`)
    })
})
