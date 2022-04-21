

//  TELA 1 - Lista de Quizzes

let listaQuizzes = [];
let promise = axios.get("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes");
promise.then(renderizarQuizzes);
promise.catch(tratarErro);
let listaQuizzesUser = { id: "" };
if (listaQuizzesUser.id.length !== 0) {
    const semQuizz = document.querySelector(".semQuizz");
    semQuizz.classList.add("escondido");
    const comQuizz = document.querySelector(".comQuizz");
    comQuizz.classList.remove("escondido");
}

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
function CriarPerguntas() {
    const titulo = document.querySelector(".container3 .titulo").value;
    const imagem = document.querySelector(".container3 .imagem").value;
    const nPerguntas = document.querySelector(".container3 .nPerguntas").value;
    const nNiveis = document.querySelector(".container3 .nNiveis").value;

    let isValidInputs = VerificarInputsIniciais(titulo, imagem, nPerguntas, nNiveis);  //Usando a função acima, aparece um único alerta de erro nos inputs

    if (isValidInputs) {
        showQuestions();
        renderQuestions(titulo, imagem, nPerguntas, nNiveis);
    }
}

// Exibir tela de criação de perguntas
function showQuestions() {
    const tela1 = document.querySelector(".container3");
    tela1.classList.add("escondido");
    const tela4 = document.querySelector(".container4");
    tela4.classList.remove("escondido");
}


function renderQuestions(title, img, nQuestions, nLevels) {
    const questionHTML = document.querySelector('.container4 div');
    questionHTML.innerHTML = '';
    for (let i = 0; i < nQuestions; i++) {
        if (i === 0) {
            questionHTML.innerHTML += `
            <div class="question">
                <span class="index escondido">${i}</span>
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
                <span class="index escondido">${i}</span>
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
            console.log(`O texto da pergunta ${i} precisa ser menor que 20 carácteres`);
            check = false;
        }

        if (!isValidColor(getQuestion[i].querySelector('.questionBackground').value)) {
            console.log(`A cor de fundo da pergunta ${i} deve ser no formato "#FFFFFF`);
            check = false;
        }

        if (getQuestion[i].querySelector('.rightAnswer').value === '') {
            console.log(`A resposta correta da pergunta ${i} não pode estar em branco`);
            check = false;
        }

        if (getQuestion[i].querySelector('.wrongAnswer1').value === ''
            && getQuestion[i].querySelector('.wrongAnswer2').value === ''
            && getQuestion[i].querySelector('.wrongAnswer3').value === '') {
            console.log(`Pelo menos uma resposta incorreta deve ser preenchida`);
            check = false;
        }

        if (!isValidHttpUrl(getQuestion[i].querySelector('.rightAnswerURL').value)) {
            console.log(`A URL da imagem da resposta correta da pergunta ${i} é inválido`);
            check = false;
        }

        if (getQuestion[i].querySelector(`.wrongAnswer${i + 1}`).value !== '' &&
            !isValidHttpUrl(getQuestion[i].querySelector(`.wrongAnswerURL${i + 1}`).value)) {
            console.log(`A URL da imagem da resposta incorreta da pergunta ${i} é inválido`);
            check = false;
        }


    }

    if (check) {
        alert('niceeee');
    }
}