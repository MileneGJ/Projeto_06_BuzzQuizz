let promise = axios.get("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes");
promise.then(renderizarQuizzes);
promise.catch(tratarErro);
let listaQuizzesUser = {};
if(listaQuizzesUser.length===0){
    const semQuizz = document.querySelector(".semQuizz");
    semQuizz.classList.add("escondido");
    const comQuizz = document.querySelector(".comQuizz");
    comQuizz.classList.remove("escondido");
}

function renderizarQuizzes(response){
    let quizzes = document.querySelector(".ListaQuizzes")
    quizzes.innerHTML = ""
    for(let i = 0; i<response.data.length;i++){
        quizzes.innerHTML += `<div class="quizz" onclick="aparecerQuizz(this)">
        <img src=${response.data[i].image}>
        <h2>${response.data[i].title}</h2>
    </div>`
    }
}
function tratarErro(erro){
    alert("Deu o erro " + erro.response.status);
}

function aparecerCriarQuizz(){
    const tela1 = document.querySelector(".container1");
    tela1.classList.add("escondido");
    const tela3 = document.querySelector(".container3");
    tela3.classList.remove("escondido");
}

function CriarPerguntas(){
    const titulo = document.querySelector(".container3 .titulo");
    const imagem = document.querySelector(".container3 .imagem");
    const nPerguntas = document.querySelector(".container3 .nPerguntas");
    const nNiveis = document.querySelector(".container3 .nNiveis");

    if(titulo.value.length<22||titulo.value.length>65){
        alert("Titulo deve conter entre 20 e 65 caracteres");
    }
    if(!isValidHttpUrl(imagem.value)){
        alert("Insira um url válido como imagem");
    }
    if(Number(nPerguntas.value)<3){
        alert("Adicione pelo menos 3 perguntas");
    }
    if(Number(nNiveis.value)<2){
        alert("Adicione pelo menos 2 níveis");
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

  
function aparecerQuizz(){
    const tela1 = document.querySelector(".container1");
    tela1.classList.add("escondido");
    const tela2 = document.querySelector(".container2");
    tela2.classList.remove("escondido");
}