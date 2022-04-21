let listaQuizzes = [];
let promise = axios.get("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes");
promise.then(renderizarQuizzes);
promise.catch(tratarErro);
let listaQuizzesUser = {id:""};
if(listaQuizzesUser.id.length!==0){
    const semQuizz = document.querySelector(".semQuizz");
    semQuizz.classList.add("escondido");
    const comQuizz = document.querySelector(".comQuizz");
    comQuizz.classList.remove("escondido");
}

function renderizarQuizzes(response){
    listaQuizzes = response.data;
    let quizzes = document.querySelector(".ListaQuizzes");
    quizzes.innerHTML = "";
    for(let i = 0; i<response.data.length;i++){
        quizzes.innerHTML += `<div class="quizz" id="${response.data[i].id}" onclick="aparecerQuizz(this)">
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
    const titulo = document.querySelector(".container3 .titulo").value;
    const imagem = document.querySelector(".container3 .imagem").value;
    const nPerguntas = document.querySelector(".container3 .nPerguntas").value;
    const nNiveis = document.querySelector(".container3 .nNiveis").value;

    let isValidInputs = true;

    if(titulo.length<22||titulo.length>65){
        alert("Titulo deve conter entre 20 e 65 caracteres");
        isValidInputs = false;
    } 
    if(!isValidHttpUrl(imagem)){
        alert("Insira um url válido como imagem");
        isValidInputs = false;
    } 
    if(Number(nPerguntas)<3){
        alert("Adicione pelo menos 3 perguntas");
        isValidInputs = false;
    } 
    if(Number(nNiveis)<2){
        alert("Adicione pelo menos 2 níveis");
        isValidInputs = false;
    }

    if(isValidInputs) {
        showQuestions();
        renderQuestions(titulo,imagem,nPerguntas,nNiveis);
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
function aparecerQuizz(element){
    const quizzSelect = listaQuizzes.filter(p=>Number(p.id)===Number(element.id));
    const tela1 = document.querySelector(".container1");
    tela1.classList.add("escondido");
    const tela2 = document.querySelector(".container2");
    tela2.classList.remove("escondido");
}

function showQuestions(){
    const tela1 = document.querySelector(".container3");
    tela1.classList.add("escondido");
    const tela2 = document.querySelector(".container4");
    tela2.classList.remove("escondido");
}

function renderQuestions(title,img,nQuestions,nLevels) {
    const questionHTML = document.querySelector('.container4 div');
    questionHTML.innerHTML = '';
    for(let i = 0; i < nQuestions; i++) {
        if(i === 0){
            questionHTML.innerHTML += `
            <div class="question">
                <span class="index escondido">${i}</span>
                <h2>Pergunta ${i+1}</h2>
                <input class="questionText" type="text" placeholder="Texto da pergunta">
                <input class="questionBackground" type="text" placeholder="Cor de fundo da pergunta">
                
                <h3>Resposta correta</h3>

                <input class="rightAnswer" type="text" placeholder="Resposta correta">
                <input class="rightAnswerURL" type="url" placeholder="URL da imagem">

                <h4>Respostas incorretas</h4>

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
                    <h2>Pergunta ${i+1}</h2>
                    <ion-icon name="create-outline"></ion-icon>
                </div>
                <div class="form escondido">
                <input class="questionText" type="text" placeholder="Texto da pergunta">
                <input class="questionBackground" type="text" placeholder="Cor de fundo da pergunta">
                
                <h3>Resposta correta</h3>

                <input class="rightAnswer" type="text" placeholder="Resposta correta">
                <input class="rightAnswerURL" type="url" placeholder="URL da imagem">

                <h4>Respostas incorretas</h4>

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

function isValidColor(color){
    const regExp = new RegExp(/^#[0-9A-F]{6}$/i);
    if (!regExp.test(color)){   
        return false;
    }       
    return true;   
}

function callNextQuestion(element) {
    element.querySelector('.form').classList.remove('escondido'); 

}
function nextToMakeLevels(){
    const getQuestion = document.querySelectorAll('.question');
    let check = true;
    for(let i = 0 ; i< getQuestion.length ; i++) {

        if(getQuestion[i].querySelector('.questionText').value.length < 20 ) {
            console.log(`O texto da pergunta ${i} precisa ser menor que 20 carácteres`);
            check = false;
        }

        if(!isValidColor(getQuestion[i].querySelector('.questionBackground').value )) {
            console.log(`A cor de fundo da pergunta ${i} deve ser no formato "#FFFFFF`);
            check = false;
        }
        
        if(getQuestion[i].querySelector('.rightAnswer').value === '') {
            console.log(`A resposta correta da pergunta ${i} não pode estar em branco`);
            check = false;
        }

        if(getQuestion[i].querySelector('.wrongAnswer1').value === '' 
        && getQuestion[i].querySelector('.wrongAnswer2').value === '' 
        && getQuestion[i].querySelector('.wrongAnswer3').value === '') {
            console.log(`Pelo menos uma resposta incorreta deve ser preenchida`);
            check = false;
        }
          
        if(!isValidHttpUrl(getQuestion[i].querySelector('.rightAnswerURL').value)) {
            console.log(`A URL da imagem da resposta correta da pergunta ${i} é inválido`);
            check = false;
        }

        if(getQuestion[i].querySelector(`.wrongAnswer${i+1}`).value !== '' &&
        !isValidHttpUrl(getQuestion[i].querySelector(`.wrongAnswerURL${i+1}`).value)) {
            console.log(`A URL da imagem da resposta incorreta da pergunta ${i} é inválido`);
            check = false;
        }

        
    }

    if(check) {
        alert('niceeee');
    }
}