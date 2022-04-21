const API = `https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes`;

//  TELA 1 - Lista de Quizzes

let listaQuizzes = [];
let promise = axios.get(`${API}`);
promise.then(renderizarQuizzes);
promise.catch(tratarErro);

/*const getMyQuizzesID = JSON.parse(localStorage.getItem("myID"));
if (getMyQuizzesID.length !== 0) {
    const semQuizz = document.querySelector(".semQuizz");
    semQuizz.classList.add("escondido");
    const comQuizz = document.querySelector(".comQuizz");
    comQuizz.classList.remove("escondido");
}*/

function renderizarQuizzes(response) {
    listaQuizzes = response.data;
    let quizzes = document.querySelector(".ListaQuizzes");
    quizzes.innerHTML = "";
    for (let i = 0; i < response.data.length; i++) {
        quizzes.innerHTML += `<div class="quizz" id="${response.data[i].id}" onclick="aparecerQuizz(this)">
        <img src=${response.data[i].image}>
        <h2>${response.data[i].title}</h2>
    </div>`
    }
}
function tratarErro(erro) {
    alert("Deu o erro " + erro.response.status);
}

function aparecerCriarQuizz() {
    const tela1 = document.querySelector(".container1");
    tela1.classList.add("escondido");
    const tela3 = document.querySelector(".container3");
    tela3.classList.remove("escondido");
}




// TELA 2 - Executar Quizz

//Função de randomização
function comparador() {
    return Math.random() - 0.5;
}

//Usar infos do quizz selecionado para criar tela 2
let quizzSelect = [];
let questoes = [];
function aparecerQuizz(element) {
    quizzSelect = listaQuizzes.filter(p => Number(p.id) === Number(element.id));
    const tela1 = document.querySelector(".container1");
    tela1.classList.add("escondido");
    const tela2 = document.querySelector(".container2");
    tela2.classList.remove("escondido");
    tela2.innerHTML = ""
    tela2.innerHTML += `<div class="img-titulo">
    <img src=${quizzSelect[0].image}>
    <h2>${quizzSelect[0].title}</h2>
    </div>`;
    questoes = quizzSelect[0].questions;
    for (let i = 0; i < questoes.length; i++) {
        tela2.innerHTML += `<div class="pergunta">
        <h3 style="background-color:${questoes[i].color};">${questoes[i].title}</h3>
        <div></div>
        </div>`
        const DivPergunta = tela2.querySelector(".pergunta:last-child div");
        let respostas = questoes[i].answers;
        respostas.sort(comparador);
        for (let j = 0; j < respostas.length; j++) {
            DivPergunta.innerHTML += `<div class="resposta ${respostas[j].isCorrectAnswer}Select" onclick="corrigirResposta(this)">
                <img src=${respostas[j].image}>
                <p>${respostas[j].text}</p>
                <div></div>
            </div>`
        }
    }

}

// Ação de passar para a próxima pergunta
function ScrollPerguntaSeguinte(element) {
    let pergunta = element.parentNode.parentNode;
    if (pergunta.nextElementSibling !== null) {
        pergunta.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
    }
}


// Verifica se a resposta selecionada é correta e passa para a próxima questão
let contadorRespostas = 0
function corrigirResposta(element) {
    let descricao = element.querySelector("p");
    if (descricao.classList.contains("selectCerto") ||
        descricao.classList.contains("selectErrado")) {
    } else {
        contadorRespostas++;
        let AllAnswers = element.parentNode.querySelectorAll(".resposta > div");
        for (let i = 0; i < AllAnswers.length; i++) {
            AllAnswers[i].classList.add("esbranquicado");
            let respostaInteira = AllAnswers[i].parentNode;
            let respostaDescricao = respostaInteira.querySelector("p");
            if (respostaInteira.classList.contains("trueSelect")) {
                respostaDescricao.classList.add("selectCerto");
            }
            if (respostaInteira.classList.contains("falseSelect")) {
                respostaDescricao.classList.add("selectErrado");
            }
        }
        element.querySelector("div").classList.remove("esbranquicado");
        element.classList.add("RespSelecionada");
        setTimeout(function () { ScrollPerguntaSeguinte(element) }, 2000);
        if (contadorRespostas === questoes.length) {
            mostrarResultado();
        }
    }
}
function mostrarResultado() {
    const respostas = document.querySelectorAll(".RespSelecionada");
    let total = respostas.length;
    let acertos = 0;
    for (let i = 0; i < respostas.length; i++) {
        let acertoErro = respostas[i].querySelector("p");
        if (acertoErro.classList.contains("selectCerto")) {
            acertos++;
        }
    }
    let niveis = quizzSelect[0].levels;
    niveis.sort((a, b) => {
        return a.minValue - b.minValue;
    })
    let acertosPorct = (acertos / total) * 100;
    acertosPorct = Math.round(acertosPorct);
    for (let i = (niveis.length - 1); i >= 0; i--) {
        if (acertosPorct >= niveis[i].minValue) {
            let tela2 = document.querySelector(".container2");
            tela2.innerHTML += `<div class="resultadoQuizz">
   <h3 style="background-color:#EC362D;">${acertosPorct}% de acerto: ${niveis[i].title}</h3>
   <div>
   <img src=${niveis[i].image}>
   <p>${niveis[i].text}</p>
   </div>
   </div>`
            break
        }
    }
    document.querySelector(".resultadoQuizz").scrollIntoView({ behavior: 'smooth' })
}




// TELA 3 - Criar Quizz

let sendToServer = {
    title: 'titulo',
    image: 'imagem',
    questions: [],
    levels: []
}
//Verificar url da imagem. Encontrada em https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
function isValidHttpUrl(string) {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

// Verificar requisitos dos inputs iniciais e retornar mensagem de erro quando necessário
function VerificarInputsIniciais(titulo, imagem, nPerguntas, nNiveis) {
    let msgAlerta = "";
    let alertar = false
    if (titulo.length < 22 || titulo.length > 65) {
        msgAlerta += "Titulo deve conter entre 20 e 65 caracteres\n";
        alertar = true;
    }
    if (!isValidHttpUrl(imagem)) {
        msgAlerta += "Insira um url válido como imagem\n";
        alertar = true;
    }
    if (Number(nPerguntas) < 3) {
        msgAlerta += "Adicione pelo menos 3 perguntas\n";
        alertar = true;
    }
    if (Number(nNiveis) < 2) {
        msgAlerta += "Adicione pelo menos 2 níveis\n";
        alertar = true;
    }
    if (alertar) {
        alert(msgAlerta);
    }
    return !alertar;
}

// Validação completa para iniciar a criação de perguntas
    let nNiveis;
function CriarPerguntas() {
    const titulo = document.querySelector(".container3 .titulo").value;
    const imagem = document.querySelector(".container3 .imagem").value;
    const nPerguntas = document.querySelector(".container3 .nPerguntas").value;
    nNiveis = document.querySelector(".container3 .nNiveis").value;

    let isValidInputs = VerificarInputsIniciais(titulo, imagem, nPerguntas, nNiveis);  //Usando a função acima, aparece um único alerta de erro nos inputs

    if (isValidInputs) {
        sendToServer.title = titulo;
        sendToServer.image = imagem
        showQuestions();
        renderQuestions(nPerguntas);
    }
}

// Exibir tela de criação de perguntas
function showQuestions() {
    const tela1 = document.querySelector(".container3");
    tela1.classList.add("escondido");
    const tela4 = document.querySelector(".container4");
    tela4.classList.remove("escondido");
}


function renderQuestions(nQuestions) {
    const questionHTML = document.querySelector('.container4 div');
    questionHTML.innerHTML = '';
    for (let i = 0; i < nQuestions; i++) {
        if (i === 0) {
            questionHTML.innerHTML += `
            <div class="question">
                <h1>Pergunta ${i + 1}</h1>
                <input class="questionText" type="text" placeholder="Texto da pergunta">
                <input class="questionBackground" type="text" placeholder="Cor de fundo da pergunta">
                
                <h1>Resposta correta</h1>

                <input class="rightAnswer" type="text" placeholder="Resposta correta">
                <input class="rightAnswerURL" type="url" placeholder="URL da imagem">

                <h1>Respostas incorretas</h1>

                <input class="wrongAnswer1" type="text" placeholder="Resposta incorreta 1">
                <input class="wrongAnswerURL1" type="url" placeholder="URL da imagem 1">

                <input class="wrongAnswer2" type="text" placeholder="Resposta incorreta 2">
                <input class="wrongAnswerURL2" type="url" placeholder="URL da imagem 2">

                <input class="wrongAnswer3" type="text" placeholder="Resposta incorreta 3">
                <input class="wrongAnswerURL3" type="url" placeholder="URL da imagem 3">
            </div>
            `;
        } else {
            questionHTML.innerHTML += `
            <div class="question" onclick="callNextQuestion(this)">
                <div class = "editForm" >
                    <h1>Pergunta ${i + 1}</h1>
                    <ion-icon name="create-outline"></ion-icon>
                </div>
                <div class="form escondido">
                <input class="questionText" type="text" placeholder="Texto da pergunta">
                <input class="questionBackground" type="text" placeholder="Cor de fundo da pergunta">
                
                <h1>Resposta correta</h1>

                <input class="rightAnswer" type="text" placeholder="Resposta correta">
                <input class="rightAnswerURL" type="url" placeholder="URL da imagem">

                <h1>Respostas incorretas</h1>

                <input class="wrongAnswer1" type="text" placeholder="Resposta incorreta 1">
                <input class="wrongAnswerURL1" type="url" placeholder="URL da imagem 1">

                <input class="wrongAnswer2" type="text" placeholder="Resposta incorreta 2">
                <input class="wrongAnswerURL2" type="url" placeholder="URL da imagem 2">

                <input class="wrongAnswer3" type="text" placeholder="Resposta incorreta 3">
                <input class="wrongAnswerURL3" type="url" placeholder="URL da imagem 3">
                </div>
            </div>
            `;

        }

    }

}

function isValidColor(color) {
    const regExp = new RegExp(/^#[0-9A-F]{6}$/i);
    if (!regExp.test(color)) {
        return false;
    }
    return true;
}

function callNextQuestion(element) {
    element.querySelector('.form').classList.remove('escondido');

}
function nextToMakeLevels() {
    const getQuestion = document.querySelectorAll('.question');
    let check = true;
    for (let i = 0; i < getQuestion.length; i++) {

        if(getQuestion[i].querySelector('.questionText').value.length < 20 ) {
            console.log(`O texto da pergunta ${i+1} precisa ter pelo menos 20 carácteres`);
            check = false;
        }

        if(!isValidColor(getQuestion[i].querySelector('.questionBackground').value )) {
            console.log(`A cor de fundo da pergunta ${i+1} deve ser no formato "#FFFFFF`);
            check = false;
        }
        
        if(getQuestion[i].querySelector('.rightAnswer').value === '') {
            console.log(`A resposta correta da pergunta ${i+1} não pode estar em branco`);
            check = false;
        }

        if(getQuestion[i].querySelector('.wrongAnswer1').value === '' 
        && getQuestion[i].querySelector('.wrongAnswer2').value === '' 
        && getQuestion[i].querySelector('.wrongAnswer3').value === '') {
            console.log(`Pelo menos uma resposta incorreta  da pergunta ${i+1} deve ser preenchida`);
            check = false;
        }
          
        if(!isValidHttpUrl(getQuestion[i].querySelector('.rightAnswerURL').value)) {
            console.log(`A URL da imagem da resposta correta da pergunta ${i+1} é inválido`);
            check = false;
        }

        for(let j= 1; j <=3; j++) {
            if(getQuestion[i].querySelector(`.wrongAnswer${j}`).value !== '' &&
                !isValidHttpUrl(getQuestion[i].querySelector(`.wrongAnswerURL${j}`).value)) {
                console.log(`A URL da imagem da resposta ${j} incorreta da pergunta ${i+1} é inválido`);
                check = false;
            } else if (getQuestion[i].querySelector(`.wrongAnswer${j}`).value === '' &&
            getQuestion[i].querySelector(`.wrongAnswerURL${j}`).value !== '') {
                console.log(`A resposta incorreta ${j} da pergunta ${i+1} está em branco`);
                check = false;
            }

        }
        
        
    }

    if (check) {
        sendToServer.questions = [];
        let question;
        for (let i = 0; i < getQuestion.length; i++) {
            question =
            {
                title: getQuestion[i].querySelector('.questionText').value,
                color: getQuestion[i].querySelector('.questionBackground').value,
                answers: [
                    {
                        text: getQuestion[i].querySelector('.rightAnswer').value,
                        image: getQuestion[i].querySelector('.rightAnswerURL').value,
                        isCorrectAnswer: true
                    }
                ]
            };

            for(let j = 1; j <= 3; j++) {
                if(getQuestion[i].querySelector(`.wrongAnswer${j}`).value !== ''){
                    let wrongAnsw = {
                        text: getQuestion[i].querySelector(`.wrongAnswer${j}`).value,
                        image: getQuestion[i].querySelector(`.wrongAnswerURL${j}`).value,
                        isCorrectAnswer: false
                    }
                    question.answers.push(wrongAnsw);
                }
            }

           sendToServer.questions.push(question);

        }

        renderLevels(nNiveis);

    }
}

function renderLevels(levels) {
    const levelsHTML =document.querySelector('.container4');
    levelsHTML.innerHTML = '';
    levelsHTML.innerHTML += `<h1>Agora, decida os níveis!</h1>`;
    for (let i = 0; i < levels; i++) {
        if (i === 0) {
            levelsHTML.innerHTML += `
            <div class="level">
                <h1>Nível ${i + 1}</h1>
                <input class="levelText" type="text" placeholder="Título do nível">
                <input class="levelmin" type="text" placeholder="% de acerto mínima">
                
                <input class="levelURL" type="url" placeholder="URL da imagem do nível">

                <input class="levelDesc" type="text" placeholder="Descrição do nível">
  
            </div>
            `;
        } else {
            levelsHTML.innerHTML += `
            <div class="level" onclick="callNextQuestion(this)">
                <div class = "editForm" >
                    <h1>Nível ${i + 1}</h1>
                    <ion-icon name="create-outline"></ion-icon>
                </div>
                <div class="form escondido">
                    <input class="levelText" type="text" placeholder="Título do nível">
                    <input class="levelmin" type="text" placeholder="% de acerto mínima">
                    
                    <input class="levelURL" type="url" placeholder="URL da imagem do nível">

                    <input class="levelDesc" type="text" placeholder="Descrição do nível">
                </div>
            </div>
            `;

        }

    }
    levelsHTML.innerHTML += `<button onclick="nextToSucessQuizz()">Finalizar Quizz</button>`;
    
}

function nextToSucessQuizz() {
    const getLevel = document.querySelectorAll('.level');
    let check = true;
    let isZero = false;
    for(let i =0; i < getLevel.length; i++) {
        if(getLevel[i].querySelector('.levelText').value.length < 10) {
            check = false;
            console.log(`O título do nível ${i+1} precisa ter pelo menos 10 carácteres`);
        }

        if(isNaN(getLevel[i].querySelector('.levelmin').value) ||
        parseInt(getLevel[i].querySelector('.levelmin').value) > 100 ||
        parseInt(getLevel[i].querySelector('.levelmin').value) < 0) {
            check = false;
            console.log(`A % de acerto mínimo do nível ${i+1} precisa ser um número de 0 a 100`);
        }

        if(!isValidHttpUrl(getLevel[i].querySelector('.levelURL').value)) {
            check = false;
            console.log(`A URL da imagem do nível ${i+1} é inválido`);
        }

        if(getLevel[i].querySelector('.levelDesc').value.length < 30) {
            check = false;
            console.log(`A descrição do nível ${i+1} precisa ter pelo menos 30 carácteres`);
        }

        if(parseInt(getLevel[i].querySelector('.levelmin').value) === 0) {
            isZero = true;
            
        }
        
        if(!isZero) {
            check = false;
            console.log('É obrigatório existir pelo menos 1 nível cuja % de acerto mínima seja 0%');
        }

        
    }

    if(check){
        sendToServer.levels = [];
        let level;
        for(let i =0 ; i < getLevel.length; i++) {
            level = 
            {
                title: getLevel[i].querySelector('.levelText').value,
                image: getLevel[i].querySelector('.levelURL').value,
                text: getLevel[i].querySelector('.levelDesc').value,
                minValue: parseInt(getLevel[i].querySelector('.levelmin').value)
            };

            sendToServer.levels.push(level);
        }

        HandleSendDataToServer(sendToServer);

    }
}

function HandleSendDataToServer(data) {
    const send = axios.post(`${API}`,data);
    send.then(SaveMyIDQuizz);

}

function SaveMyIDQuizz (response){

    let id,idS,idD;
    
    if(!localStorage.getItem("myID")) {
        localStorage.setItem('myID','[]');
    }
   
    id = localStorage.getItem("myID");
    idD = JSON.parse(id);
    idD.push(response.data.id);

    idS = JSON.stringify(idD);
    localStorage.setItem('myID',idS);

    nextToSucess();
}



function nextToSucess(){
    const getMyQuizzes = JSON.parse(localStorage.getItem("myID"));
    const getMyLastQuizz = getMyQuizzes[getMyQuizzes.length -1];

    getMyQuizIdInServer(getMyLastQuizz);
}

function getMyQuizIdInServer(idQuizz) {
    const getMyQuiz = axios.get(`${API}/${idQuizz}`);
    getMyQuiz.then(renderSucess);

    function renderSucess(getData){

        const dataFromServer = getData.data;
        console.log(dataFromServer);
        const SucessHTML = document.querySelector('.container4')
        SucessHTML.innerHTML = '';
        SucessHTML.innerHTML += `<h1>Seu quizz está pronto!</h1>`;
        SucessHTML.innerHTML+= 
        `<div class="quizz">
            <img src=${dataFromServer.image}>
            <h2>${dataFromServer.title}</h2>
        </div>
        <button class="loadMyQuizz">Acessar Quizz</button>

        <button class="home">Voltar pra home</button>
        `;

        document.querySelector('.home').
        addEventListener('click', () => document.location.reload());

        document.querySelector('.loadMyQuizz').
        addEventListener('click', function() {
            SucessHTML.innerHTML = '';

            
        });
    }
}
