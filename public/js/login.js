const urlBase = 'http://localhost:4000/api'

//monitorando o submit do formulário
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault() //evita o recarregamento do form
    //obteno os valores do form
    const login = document.getElementById('login').value
    const senha = document.getElementById('senha').value
    //Criando o objeto para autenticar
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
            const errorMessages = data.errors.map(error = error.msg).json('\n')
            alert('Falha ao efetuar o login:\n'+errorMessages)
        }else{
            alert('Não foi possivel efetuar o l9ogin no servidor')
        }
    }).catch(error => {
        console.error(`Erro no login ${error}`)
    })
})
