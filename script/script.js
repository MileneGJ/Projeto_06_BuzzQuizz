const API = `https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes`;
const parent = document.querySelector('.container1');
//  TELA 1 - Lista de Quizzes

let listaQuizzes = [];
let promise = axios.get(`${API}`);
promise.then(renderizarQuizzes);

const getMyQuizzesID = JSON.parse(localStorage.getItem("myID"));

function renderizarQuizzes(response) {
    listaQuizzes = response.data;
    let quizzes = document.querySelector(".ListaQuizzes");
    let quizzesUser = document.querySelector(".ListaQuizzesUser");
    let isFromUser
    let ShowListUser
    quizzes.innerHTML = "";
    quizzesUser.innerHTML = "";

    for (let i = 0; i < response.data.length; i++) {
        getMyQuizzesID.map(function (x) {
            if (x === response.data[i].id) {
                isFromUser = true;
                ShowListUser = true;
            }
        });
        if (isFromUser) {
            quizzesUser.innerHTML += `<div class="quizz" id="${response.data[i].id}" onclick="aparecerQuizz(this)">
            <img src=${response.data[i].image}>
            <h2>${response.data[i].title}</h2>

        </div>`
            isFromUser = false;
        } else {
            quizzes.innerHTML += `<div class="quizz" id="${response.data[i].id}" onclick="aparecerQuizz(this)">
        <img src=${response.data[i].image}>
        <h2>${response.data[i].title}</h2>
    </div>`
        }
    }

    const semQuizz = document.querySelector(".semQuizz");
    const comQuizz = document.querySelector(".comQuizz");
    if (ShowListUser) {
        comQuizz.classList.remove("escondido");
    } else {
        semQuizz.classList.remove("escondido");
    }
}






// TELA 2 - Executar Quizz

//Função de randomização
function comparador() {
    return Math.random() - 0.5;
}

//Usar infos do quizz selecionado para criar tela 2
let quizzSelect = [];
let questoes = [];
let InfosquizzSelect
function aparecerQuizz(element, showType = 0) {
    if(showType === 0) {
        InfosquizzSelect = element
        quizzSelect = listaQuizzes.filter(p => Number(p.id) === Number(element.id));
        parent.classList.remove('container1');
        parent.classList.add('container2');
        parent.innerHTML = "";
        parent.innerHTML += `<div class="img-titulo">
        <img src=${quizzSelect[0].image}>
        <h2>${quizzSelect[0].title}</h2>
        </div>`;
        questoes = quizzSelect[0].questions;
        for (let i = 0; i < questoes.length; i++) {
            parent.innerHTML += `<div class="pergunta">
            <span style="background-color:${questoes[i].color};"><h3>${questoes[i].title}</h3></span>
            <div></div>
            </div>`
            const DivPergunta = parent.querySelector(".pergunta:last-child div");
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
        parent.querySelector(".img-titulo").scrollIntoView({ behavior: 'smooth' });
    } else {
        
        InfosquizzSelect = element;
        
        parent.innerHTML = ""
        parent.innerHTML += `<div class="img-titulo">
        <img src=${InfosquizzSelect.image}>
        <h2>${InfosquizzSelect.title}</h2>
        </div>`;
        questoes = InfosquizzSelect.questions;
        for (let i = 0; i < questoes.length; i++) {
            parent.innerHTML += `<div class="pergunta">
            <span style="background-color:${questoes[i].color};"><h3>${questoes[i].title}</h3></span>
            <div></div>
            </div>`
            const DivPergunta = parent.querySelector(".pergunta:last-child div");
            let respostas = questoes[i].answers;
            respostas.sort(comparador);
            for (let j = 0; j < respostas.length; j++) {
                DivPergunta.innerHTML += `<div class="resposta ${respostas[j].isCorrectAnswer}Select" onclick="corrigirResposta(this,1)">
                    <img src=${respostas[j].image}>
                    <p>${respostas[j].text}</p>
                    <div></div>
                </div>`
            }
        }
        parent.querySelector(".img-titulo").scrollIntoView({ behavior: 'smooth' });
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
function corrigirResposta(element, showType = 0) {
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
            if(showType === 0){
                setTimeout(mostrarResultado, 2000);
                contadorRespostas = 0;
            } else {
                setTimeout(mostrarResultado(1), 2000);
                contadorRespostas = 0;
            }
            
        }
    }
}
function mostrarResultado(showType = 0) {
    const respostas = document.querySelectorAll(".RespSelecionada");
    let total = respostas.length;
    let acertos = 0;
    for (let i = 0; i < respostas.length; i++) {
        let acertoErro = respostas[i].querySelector("p");
        if (acertoErro.classList.contains("selectCerto")) {
            acertos++;
        }
    }
    let niveis;
    if(showType === 0) {
        niveis = quizzSelect[0].levels;
        niveis.sort((a, b) => {
            return a.minValue - b.minValue;
        })
        let acertosPorct = (acertos / total) * 100;
        acertosPorct = Math.round(acertosPorct);
        for (let i = (niveis.length - 1); i >= 0; i--) {
            if (acertosPorct >= niveis[i].minValue) {      
                parent.innerHTML += `<div class="resultadoQuizz">
            <span style="background-color:#EC362D;"><h3>${acertosPorct}% de acerto: ${niveis[i].title}</h3></span>
       <div>
       <img src=${niveis[i].image}>
       <p>${niveis[i].text}</p>
       </div>
       </div>
       <button onclick="reiniciarQuizz()">Reiniciar Quizz</button>
       <button class="home" onclick="voltarHome()">Voltar pra home</button>`
                break
            }
        }
        
        acertos = 0;
        document.querySelector(".resultadoQuizz").scrollIntoView({ behavior: 'smooth' });
    
    } else {

        niveis = dataFromServer.levels;
        niveis.sort((a, b) => {
            return a.minValue - b.minValue;
        })
        let acertosPorct = (acertos / total) * 100;
        acertosPorct = Math.round(acertosPorct);
        for (let i = (niveis.length - 1); i >= 0; i--) {
            if (acertosPorct >= niveis[i].minValue) {      
                parent.innerHTML += `<div class="resultadoQuizz">
            <span style="background-color:#EC362D;"><h3>${acertosPorct}% de acerto: ${niveis[i].title}</h3></span>
       <div>
       <img src=${niveis[i].image}>
       <p>${niveis[i].text}</p>
       </div>
       </div>
       <button onclick="reiniciarQuizz(1)">Reiniciar Quizz</button>
       <button class="home" onclick="voltarHome()">Voltar pra home</button>`
                break
            }
        }
        
        acertos = 0;
        document.querySelector(".resultadoQuizz").scrollIntoView({ behavior: 'smooth' });
    

    }
   
}

function voltarHome() {
    window.location.reload();
}

function reiniciarQuizz(typeQuiz = 0) {
    if(typeQuiz === 0) {
        aparecerQuizz(InfosquizzSelect);
    } else {
        aparecerQuizz(InfosquizzSelect,1);
    }
    
}

// TELA 3 - Criar Quizz


function aparecerCriarQuizz() {
    parent.classList.remove('container1');
    parent.classList.add('container3');
    parent.innerHTML = "";
    parent.innerHTML +=  `
    <h1>Comece pelo começo</h1>
        <div>
            <input class="titulo" type="text" placeholder="Título do seu quizz">
            <input class="imagem" type="url" placeholder="URL da imagem do seu quizz">
            <input class="nPerguntas" type="text" placeholder="Quantidade de perguntas do quizz">
            <input class="nNiveis" type="text" placeholder="Quantidade de níveis do quizz">
        </div>
    <button type="button" onclick="CriarPerguntas()">Prosseguir para criar perguntas</button>`;

}

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
    parent.classList.remove('container3');
    parent.classList.add('container4');
    parent.innerHTML = "";
    parent.innerHTML +=  `
    <h1>Crie suas perguntas</h1>
        <div class="questions">
            
        </div>
    <button onclick="nextToMakeLevels()">Prosseguir para criar níveis</button>
    `;
}


function renderQuestions(nQuestions) {
    const questionHTML = parent.querySelector('.questions');
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

        if (getQuestion[i].querySelector('.questionText').value.length < 20) {
            console.log(`O texto da pergunta ${i + 1} precisa ter pelo menos 20 carácteres`);
            check = false;
        }

        if (!isValidColor(getQuestion[i].querySelector('.questionBackground').value)) {
            console.log(`A cor de fundo da pergunta ${i + 1} deve ser no formato "#FFFFFF`);
            check = false;
        }

        if (getQuestion[i].querySelector('.rightAnswer').value === '') {
            console.log(`A resposta correta da pergunta ${i + 1} não pode estar em branco`);
            check = false;
        }

        if (getQuestion[i].querySelector('.wrongAnswer1').value === ''
            && getQuestion[i].querySelector('.wrongAnswer2').value === ''
            && getQuestion[i].querySelector('.wrongAnswer3').value === '') {
            console.log(`Pelo menos uma resposta incorreta  da pergunta ${i + 1} deve ser preenchida`);
            check = false;
        }

        if (!isValidHttpUrl(getQuestion[i].querySelector('.rightAnswerURL').value)) {
            console.log(`A URL da imagem da resposta correta da pergunta ${i + 1} é inválido`);
            check = false;
        }

        for (let j = 1; j <= 3; j++) {
            if (getQuestion[i].querySelector(`.wrongAnswer${j}`).value !== '' &&
                !isValidHttpUrl(getQuestion[i].querySelector(`.wrongAnswerURL${j}`).value)) {
                console.log(`A URL da imagem da resposta ${j} incorreta da pergunta ${i + 1} é inválido`);
                check = false;
            } else if (getQuestion[i].querySelector(`.wrongAnswer${j}`).value === '' &&
                getQuestion[i].querySelector(`.wrongAnswerURL${j}`).value !== '') {
                console.log(`A resposta incorreta ${j} da pergunta ${i + 1} está em branco`);
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

            for (let j = 1; j <= 3; j++) {
                if (getQuestion[i].querySelector(`.wrongAnswer${j}`).value !== '') {
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
    const levelsHTML = document.querySelector('.container4');
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
    for (let i = 0; i < getLevel.length; i++) {
        if (getLevel[i].querySelector('.levelText').value.length < 10) {
            check = false;
            console.log(`O título do nível ${i + 1} precisa ter pelo menos 10 carácteres`);
        }

        if (isNaN(getLevel[i].querySelector('.levelmin').value) ||
            parseInt(getLevel[i].querySelector('.levelmin').value) > 100 ||
            parseInt(getLevel[i].querySelector('.levelmin').value) < 0) {
            check = false;
            console.log(`A % de acerto mínimo do nível ${i + 1} precisa ser um número de 0 a 100`);
        }

        if (!isValidHttpUrl(getLevel[i].querySelector('.levelURL').value)) {
            check = false;
            console.log(`A URL da imagem do nível ${i + 1} é inválido`);
        }

        if (getLevel[i].querySelector('.levelDesc').value.length < 30) {
            check = false;
            console.log(`A descrição do nível ${i + 1} precisa ter pelo menos 30 carácteres`);
        }

        if (parseInt(getLevel[i].querySelector('.levelmin').value) === 0) {
            isZero = true;

        }

        if (!isZero) {
            check = false;
            console.log('É obrigatório existir pelo menos 1 nível cuja % de acerto mínima seja 0%');
        }


    }

    if (check) {
        sendToServer.levels = [];
        let level;
        for (let i = 0; i < getLevel.length; i++) {
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
    const send = axios.post(`${API}`, data);
    send.then(SaveMyIDQuizz);

}

function SaveMyIDQuizz(response) {

    let id, idS, idD;

    if (!localStorage.getItem("myID")) {
        localStorage.setItem('myID', '[]');
    }

    id = localStorage.getItem("myID");
    idD = JSON.parse(id);
    idD.push(response.data.id);

    idS = JSON.stringify(idD);
    localStorage.setItem('myID', idS);

    nextToSucess();
}



function nextToSucess() {
    const getMyQuizzes = JSON.parse(localStorage.getItem("myID"));
    const getMyLastQuizz = getMyQuizzes[getMyQuizzes.length - 1];

    getMyQuizIdInServer(getMyLastQuizz);
}


let dataFromServer;
function getMyQuizIdInServer(idQuizz) {
    const getMyQuiz = axios.get(`${API}/${idQuizz}`);
    getMyQuiz.then(renderSucess);

    function renderSucess(getData) {

        dataFromServer = getData.data;
        console.log(dataFromServer);
    
        parent.innerHTML = '';
        parent.innerHTML += `<h1>Seu quizz está pronto!</h1>`;
        parent.innerHTML +=
            `<div class="quizz" id="${dataFromServer.id}" >
            <img src=${dataFromServer.image}>
            <h2>${dataFromServer.title}</h2>
        </div>
        <button onclick="mostrarQuizz(1)" class="loadMyQuizz">Acessar Quizz</button>

        <button onclick="voltarHome()" class="home">Voltar pra home</button>
        `;
    }
}
function mostrarQuizz(typeQuiz = 0) {
    if(typeQuiz ===0 ) {
        aparecerQuizz(dataFromServer);
    } else {
        aparecerQuizz(dataFromServer,1);
    }
}

function debugAcessQuizz() {
    //chamar no console
    parent.innerHTML = "";
    parent.classList.remove('container1');
    parent.classList.add('container4');
    // id do quizz que voce quer
    getMyQuizIdInServer(29);
}