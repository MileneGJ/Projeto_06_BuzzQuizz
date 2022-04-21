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
    const titulo = document.querySelector(".container3 .titulo").value;
    const imagem = document.querySelector(".container3 .imagem").value;
    const nPerguntas = document.querySelector(".container3 .nPerguntas").value;
    const nNiveis = document.querySelector(".container3 .nNiveis").value;

    const isValidInputs = [false,false,false,false];

    if(titulo.length<22||titulo.length>65){
        alert("Titulo deve conter entre 20 e 65 caracteres");
        isValidInputs[0] = false;
    } else {
        isValidInputs[0] = true;
    }
    if(!isValidHttpUrl(imagem)){
        alert("Insira um url válido como imagem");
        isValidInputs[1] = false;
    } else {
        isValidInputs[1] = true;
    }
    if(Number(nPerguntas)<3){
        alert("Adicione pelo menos 3 perguntas");
        isValidInputs[2] = false;
    } else {
        isValidInputs[2] = true;
    }
    if(Number(nNiveis)<2){
        alert("Adicione pelo menos 2 níveis");
        isValidInputs[3] = false;
    } else {
        isValidInputs[3] = true;
    }

    function isAllowCreateQuestions(){
        const isAllowed = (isValidInputs[0] && isValidInputs[1] &&
            isValidInputs[2] && isValidInputs[3]);
        
        return isAllowed;
    }   

    if(isAllowCreateQuestions()) {
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

  
function aparecerQuizz(){
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
                <input class="wrongAnswer1URL" type="url" placeholder="URL da imagem 1">

                <input class="wrongAnswer2" type="text" placeholder="Resposta incorreta 2">
                <input class="wrongAnswer2URL" type="url" placeholder="URL da imagem 2">

                <input class="wrongAnswer3" type="text" placeholder="Resposta incorreta 3">
                <input class="wrongAnswer3URL" type="url" placeholder="URL da imagem 3">
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
                <input class="wrongAnswer1URL" type="url" placeholder="URL da imagem 1">

                <input class="wrongAnswer2" type="text" placeholder="Resposta incorreta 2">
                <input class="wrongAnswer2URL" type="url" placeholder="URL da imagem 2">

                <input class="wrongAnswer3" type="text" placeholder="Resposta incorreta 3">
                <input class="wrongAnswer3URL" type="url" placeholder="URL da imagem 3">
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
    const teste = document.querySelectorAll('.question');
    for(let i = 0 ; i< teste.length ; i++) {
        if(teste[i].querySelector('.questionText').value.length < 20 ) {
            console.log(`errorText ${i}`);
        }

        if(!isValidColor(teste[i].querySelector('.questionBackground').value )) {
            console.log(`errorColor ${i}`);
        }

        if(teste[i].querySelector('.rightAnswer').value === '' || (teste[i].querySelector('.wrongAnswer1').value === '' 
        && teste[i].querySelector('.wrongAnswer2').value === '' && teste[i].querySelector('.wrongAnswer3').value === '')) {
            console.log(`ErrorAnswers ${i}`);
        }
    }
}