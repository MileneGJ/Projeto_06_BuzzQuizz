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

function VerificarInputsTela3() {
    const titulo = document.querySelector(".container3 .titulo");
    const imagem = document.querySelector(".container3 .imagem");
    const nPerguntas = document.querySelector(".container3 .nPerguntas");
    const nNiveis = document.querySelector(".container3 .nNiveis");
    let msgAlerta = "";
    let alertar = false
    if (titulo.value.length < 22 || titulo.value.length > 65) {
        msgAlerta += "Titulo deve conter entre 20 e 65 caracteres\n";
        alertar = true;
    }
    if (!isValidHttpUrl(imagem.value)) {
        msgAlerta += "Insira um url válido como imagem\n";
        alertar = true;
    }
    if (Number(nPerguntas.value) < 3) {
        msgAlerta += "Adicione pelo menos 3 perguntas\n";
        alertar = true;
    }
    if (Number(nNiveis.value) < 2) {
        msgAlerta += "Adicione pelo menos 2 níveis\n";
        alertar = true;
    }
    if (alertar) {
        alert(msgAlerta);
    }
}
//Achei essa função aqui https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
// não sei se é a melhor forma, depois vou olhar melhor
function isValidHttpUrl(string) {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}


//Função de randomização
function comparador() {
    return Math.random() - 0.5;
}
function aparecerQuizz(element) {
    const quizzSelect = listaQuizzes.filter(p => Number(p.id) === Number(element.id));
    const tela1 = document.querySelector(".container1");
    tela1.classList.add("escondido");
    const tela2 = document.querySelector(".container2");
    tela2.classList.remove("escondido");
    tela2.innerHTML = ""
    tela2.innerHTML += `<div class="img-titulo">
    <img src=${quizzSelect[0].image}>
    <h2>${quizzSelect[0].title}</h2>
    </div>`;
    const questoes = quizzSelect[0].questions;
    for (let i = 0; i < questoes.length; i++) {
        tela2.innerHTML += `<div class="pergunta">
        <h3 style="background-color:${questoes[i].color};">${questoes[i].title}</h3>
        <div></div>
        </div>`
        const DivPergunta = tela2.querySelector(".pergunta:last-child div");
        let respostas = questoes[i].answers;
        respostas.sort(comparador);
        for (let j = 0; j < respostas.length; j++) {
            DivPergunta.innerHTML += `<div class="resposta ${respostas[j].isCorrectAnswer}Select" onclick="validarResposta(this)">
                <img src=${respostas[j].image}>
                <p>${respostas[j].text}</p>
                <div></div>
            </div>`
        }
    }

}

function validarResposta(element){
    let descricao = element.querySelector("p");
    if(descricao.classList.contains("selectCerto")||
    descricao.classList.contains("selectErrado")){
    }else{
    let AllAnswers = element.parentNode.querySelectorAll(".resposta > div");
    for(let i=0;i<AllAnswers.length;i++){
        AllAnswers[i].classList.add("esbranquicado");
        let respostaInteira = AllAnswers[i].parentNode;
        let respostaDescricao = respostaInteira.querySelector("p");
        if(respostaInteira.classList.contains("trueSelect")){
            respostaDescricao.classList.add("selectCerto");
        }
        if(respostaInteira.classList.contains("falseSelect")){
            respostaDescricao.classList.add("selectErrado");
        }
    }
    element.querySelector("div").classList.remove("esbranquicado");
    setTimeout(function(){ScrollPerguntaSeguinte(element)},2000);
}   
}

function ScrollPerguntaSeguinte(element){
    let pergunta = element.parentNode.parentNode;
    if(pergunta.nextElementSibling!==null){
    pergunta.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
    }
}