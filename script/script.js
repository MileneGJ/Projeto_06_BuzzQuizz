const API = `https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes`;
const parent = document.querySelector('.container1');
const loadCircle = document.querySelector('.lds-ring').style;



//  TELA 1 - Lista de Quizzes

function loadQuizzes() {

    const promise = axios.get(`${API}`);
    promise.then(renderizarQuizzes);

    function renderizarQuizzes(response) {
        loadCircle.display = "none";
        parent.innerHTML = `
        <div class="semQuizz escondido">
        <p>Você não criou nenhum quizz ainda :(</p>
        <button onclick="aparecerCriarQuizz()">Criar Quizz</button>
    </div>

    <div class="comQuizz escondido">
        <div>
            <h1>Seus Quizzes</h1>
            <ion-icon name="add-circle" onclick="aparecerCriarQuizz()">></ion-icon>
        </div>
        
        <div class="ListaQuizzesUser">
            
        </div>

    </div>

    <h1>Todos os Quizzes</h1>

    <div class="ListaQuizzes">
        
    </div>`;
        if (!localStorage.getItem("dataQuiz")) {
            localStorage.setItem('dataQuiz', '{"myID":[],"myKey":[]}');
        }
        const getMyQuizzesID = JSON.parse(localStorage.getItem("dataQuiz")).myID;
        listaTodosQuizzes = response.data;
        let quizzes = document.querySelector(".ListaQuizzes");
        let quizzesUser = document.querySelector(".ListaQuizzesUser");
        let isFromUser
        let ShowListUser
        quizzes.innerHTML = "";
        quizzesUser.innerHTML = "";

        for (let i = 0; i < listaTodosQuizzes.length; i++) {
            getMyQuizzesID.map((x) => {
                if (x === listaTodosQuizzes[i].id) {
                    isFromUser = true;
                    ShowListUser = true;
                }
            });

            if (isFromUser) {
                quizzesUser.innerHTML += `<div class="quizz" id="${listaTodosQuizzes[i].id}" onclick="aparecerQuizz(this)">
                <img src=${listaTodosQuizzes[i].image}>
                <h2>${listaTodosQuizzes[i].title}</h2>
                <div>                
                <ion-icon name="create-outline" onclick="event.stopPropagation();callConfirmEdit(this)">
                    <span class = "escondido">${listaTodosQuizzes[i].id}</span>
                    <span class = "escondido">${listaTodosQuizzes[i].title}</span>
                </ion-icon>

                <ion-icon name="trash-outline" onclick="event.stopPropagation();callConfirmDelete(this)">
                    <span class = "escondido">${listaTodosQuizzes[i].id}</span>
                    <span class = "escondido">${listaTodosQuizzes[i].title}</span>
                </ion-icon>
                </div>

            </div>`
                isFromUser = false;
            } else {
                quizzes.innerHTML += `<div class="quizz" id="${listaTodosQuizzes[i].id}" onclick="aparecerQuizz(this)">
            <img src=${listaTodosQuizzes[i].image}>
            <h2>${listaTodosQuizzes[i].title}</h2>
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
    document.querySelector("header").scrollIntoView();
}

loadQuizzes();






// TELA 2 - Executar Quizz

//Função de randomização
function comparador() {
    return Math.random() - 0.5;
}

//Usar infos do quizz selecionado para criar tela 2
let quizzSelect = [];
let questoes = [];
let InfosquizzSelect;

function aparecerQuizz(element, showType = 0) {
    InfosquizzSelect = element;
    parent.innerHTML = "";
    if (showType === 0) {
        parent.classList.remove('container1');
        parent.classList.add('container2');
        const promise = axios.get(`${API}`);
        loadCircle.display = "inline-block";
        promise.then(exibirQuizzSelect);
    } else {
        parent.classList.remove('container4');
        parent.classList.add('container2');
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

function exibirQuizzSelect(response) {
    quizzSelect = response.data.filter(p => Number(p.id) === Number(InfosquizzSelect.id));
    let tela2 = document.querySelector(".container2")
    loadCircle.display = "none";
    tela2.innerHTML += `<div class="img-titulo">
    <img src=${quizzSelect[0].image}>
    <h2>${quizzSelect[0].title}</h2>
    </div>`;
    questoes = quizzSelect[0].questions;
    for (let i = 0; i < questoes.length; i++) {
        tela2.innerHTML += `<div class="pergunta">
        <span style="background-color:${questoes[i].color};"><h3>${questoes[i].title}</h3></span>
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
    tela2.querySelector(".img-titulo").scrollIntoView({ behavior: 'smooth' });
}

function exibirQuizzCriado() {

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
            if (showType === 0) {
                setTimeout(mostrarResultado, 2000);
                contadorRespostas = 0;
            } else {
                setTimeout(mostrarResultadoCriado, 2000);
                contadorRespostas = 0;
            }

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
    let niveis;
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
       <button class="reinicioQuizz" onclick="reiniciarQuizz()">Reiniciar Quizz</button>
       <button class="home" onclick="voltarHome()">Voltar pra home</button>`
            break
        }
    }

    acertos = 0;
    document.querySelector(".resultadoQuizz").scrollIntoView({ behavior: 'smooth' });
}

function mostrarResultadoCriado() {
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
       <button class="reinicioQuizz" onclick="reiniciarQuizz(1)">Reiniciar Quizz</button>
       <button class="home" onclick="voltarHome()">Voltar pra home</button>`
            break
        }
    }

    acertos = 0;
    document.querySelector(".resultadoQuizz").scrollIntoView({ behavior: 'smooth' });
}


function voltarHome() {
    window.location.reload();
}

function reiniciarQuizz(typeQuiz = 0) {
    if (typeQuiz === 0) {
        aparecerQuizz(InfosquizzSelect);
    } else {
        aparecerQuizz(InfosquizzSelect, 1);
    }

}

// TELA 3 - Criar Quizz


function aparecerCriarQuizz(edit = false) {
    parent.classList.remove('container1');
    parent.classList.add('container3');
    parent.innerHTML = "";
    if (edit) {

        parent.innerHTML += `
        <h1>Comece pelo começo (edição)</h1>
            <div>
                <input class="titulo" type="text" value = "${dataFromServer.title}" placeholder="Título do seu quizz">
                <span class="tituloAlert wrong"></span>

                <input class="imagem" type="url" value = "${dataFromServer.image}"placeholder="URL da imagem do seu quizz">
                <span class="imagemAlert wrong"></span>

                <input class="nPerguntas" type="text" value = "${dataFromServer.questions.length}" placeholder="Quantidade de perguntas do quizz">
                <span class="nPerguntasAlert wrong"></span>
                
                <input class="nNiveis" type="text" value = "${dataFromServer.levels.length}" placeholder="Quantidade de níveis do quizz">
                <span class="nNiveisAlert wrong"></span>
            </div>
        <button type="button" onclick="CriarPerguntas(true)">Prosseguir para editar perguntas</button>`;
    } else {
        parent.innerHTML += `
        <h1>Comece pelo começo</h1>
            <div>
                <input class="titulo" type="text" placeholder="Título do seu quizz">
                <span class="tituloAlert wrong"></span>

                <input class="imagem" type="url" placeholder="URL da imagem do seu quizz">
                <span class="imagemAlert wrong"></span>


                <input class="nPerguntas" type="text" placeholder="Quantidade de perguntas do quizz">
                <span class="nPerguntasAlert wrong"></span>

                <input class="nNiveis" type="text" placeholder="Quantidade de níveis do quizz">
                <span class="nNiveisAlert wrong"></span>

            </div>
        <button type="button" onclick="CriarPerguntas()">Prosseguir para criar perguntas</button>`;
    }


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
    let alertar = false;
    if (titulo.length < 22 || titulo.length > 65) {
        document.querySelector(".titulo")
            .classList.add("fillerrado");

        document.querySelector('.tituloAlert')
            .innerHTML = 'O Título deve conter entre 20 e 65 caracteres.';

        alertar = true;
    } else {
        if (document.querySelector('.titulo').classList.contains('fillerrado')) {
            document.querySelector(".titulo")
                .classList.remove("fillerrado");

            document.querySelector('.tituloAlert')
                .innerHTML = '';
        }

    }

    if (!isValidHttpUrl(imagem)) {
        document.querySelector(".imagem")
            .classList.add("fillerrado");

        document.querySelector('.imagemAlert')
            .innerHTML = 'Insira uma url válida como imagem.';

        alertar = true;
    } else {
        if (document.querySelector('.imagem').classList.contains('fillerrado')) {
            document.querySelector(".imagem")
                .classList.remove("fillerrado");

            document.querySelector('.imagemAlert')
                .innerHTML = '';
        }
    }
    if (Number(nPerguntas) < 3) {
        document.querySelector(".nPerguntas")
            .classList.add("fillerrado");

        document.querySelector('.nPerguntasAlert')
            .innerHTML = 'Adicione pelo menos 3 perguntas.';

        alertar = true;
    } else {
        if (document.querySelector('.nPerguntas').classList.contains('fillerrado')) {
            document.querySelector(".nPerguntas")
                .classList.remove('fillerrado');

            document.querySelector('.nPerguntasAlert')
                .innerHTML = '';
        }
    }
    if (Number(nNiveis) < 2) {
        document.querySelector(".nNiveis")
            .classList.add("fillerrado");

        document.querySelector('.nNiveisAlert')
            .innerHTML = 'Adicione pelo menos 2 níveis.';

        alertar = true;
    } else {
        if (document.querySelector('.nNiveis').classList.contains('fillerrado')) {
            document.querySelector(".nNiveis")
                .classList.remove("fillerrado");

            document.querySelector('.nNiveisAlert')
                .innerHTML = '';
        }
    }

    return !alertar;
}

// Validação completa para iniciar a criação de perguntas
let nNiveis;
function CriarPerguntas(edit = false) {
    let titulo = document.querySelector(".container3 .titulo").value;
    let imagem = document.querySelector(".container3 .imagem").value;
    let nPerguntas = document.querySelector(".container3 .nPerguntas").value;
    nNiveis = document.querySelector(".container3 .nNiveis").value;
    let isValidInputs = VerificarInputsIniciais(titulo, imagem, nPerguntas, nNiveis);

    if (isValidInputs) {
        sendToServer.title = titulo;
        sendToServer.image = imagem
        if (edit) {
            showQuestions(true);
            renderQuestions(nPerguntas, true);
        } else {
            showQuestions();
            renderQuestions(nPerguntas);
        }

    }
}

// Exibir tela de criação de perguntas
function showQuestions(edit = false) {
    parent.classList.remove('container3');
    parent.classList.add('container4');
    parent.innerHTML = "";
    if (edit) {
        parent.innerHTML += `
        <h1>Crie suas perguntas (edição)</h1>
            <div class="questions">
                
            </div>
        <button onclick="nextToMakeLevels(true)">Prosseguir para editar níveis</button>
        `;

    } else {
        parent.innerHTML += `
        <h1>Crie suas perguntas</h1>
            <div class="questions">
                
            </div>
        <button onclick="nextToMakeLevels()">Prosseguir para criar níveis</button>
        `;
    }

}


function renderQuestions(nQuestions, edit = false) {
    const questionHTML = parent.querySelector('.questions');
    questionHTML.innerHTML = '';
    for (let i = 0; i < nQuestions; i++) {
        if (edit) {
            let answSize = dataFromServer.questions[i].answers.length;
            if (i === 0) {
                questionHTML.innerHTML += `
                <div class="question">
                    <h1>Pergunta ${i + 1}</h1>
                    <input class="questionText" type="text" value= "${dataFromServer.questions[i].title}" placeholder="Texto da pergunta">
                    <span class="questionTextAlert wrong"></span>

                    <input class="questionBackground" type="text" value= "${dataFromServer.questions[i].color}" placeholder="Cor de fundo da pergunta">
                    <span class="questionBackgroundAlert wrong"></span>
                    
                    <h1>Resposta correta</h1>
    
                    <input class="rightAnswer" value = "${dataFromServer.questions[i].answers[0].text}" type="text" placeholder="Resposta correta">
                    <span class="rightAnswerAlert wrong"></span>

                    <input class="rightAnswerURL" value = "${dataFromServer.questions[i].answers[0].image}" type="url" placeholder="URL da imagem">
                    <span class="rightAnswerURLAlert wrong"></span>
    
                    <h1>Respostas incorretas</h1>
                    <span class="wrongAnswerMin1Alert wrong"></span>
                </div>
                `;
                if (answSize === 2) {
                    document.querySelector('.question').innerHTML += `
                    <input class="wrongAnswer1" type="text" value = "${dataFromServer.questions[i].answers[1].text}" placeholder="Resposta incorreta 1">
                    <span class="wrongAnswerAlert1 wrong"></span>
                    
                    <input class="wrongAnswerURL1" type="url" value = "${dataFromServer.questions[i].answers[1].image}"placeholder="URL da imagem 1">
                    <span class="wrongAnswerURLAlert1 wrong"></span>

                    <input class="wrongAnswer2" type="text" placeholder="Resposta incorreta 2">
                    <span class="wrongAnswerAlert2 wrong"></span>

                    <input class="wrongAnswerURL2" type="url" placeholder="URL da imagem 2">
                    <span class="wrongAnswerURLAlert2 wrong"></span>


                    <input class="wrongAnswer3" type="text" placeholder="Resposta incorreta 3">
                    <span class="wrongAnswerAlert3 wrong"></span>

                    <input class="wrongAnswerURL3" type="url" placeholder="URL da imagem 3">
                    <span class="wrongAnswerURLAlert3 wrong"></span>
                    `;
                } else if (answSize === 3) {
                    document.querySelector('.question').innerHTML += `
                    <input class="wrongAnswer1" type="text" value = "${dataFromServer.questions[i].answers[1].text}" placeholder="Resposta incorreta 1">
                    <span class="wrongAnswerAlert1 wrong"></span>

                    <input class="wrongAnswerURL1" type="url" value = "${dataFromServer.questions[i].answers[1].image}"placeholder="URL da imagem 1">
                    <span class="wrongAnswerURLAlert1 wrong"></span>

                    <input class="wrongAnswer2" type="text" value = "${dataFromServer.questions[i].answers[2].text}" placeholder="Resposta incorreta 2">
                    <span class="wrongAnswerAlert2 wrong"></span>

                    <input class="wrongAnswerURL2" type="url" value = "${dataFromServer.questions[i].answers[2].image}" placeholder="URL da imagem 2">
                    <span class="wrongAnswerURLAlert2 wrong"></span>
    
                    <input class="wrongAnswer3" type="text" placeholder="Resposta incorreta 3">
                    <span class="wrongAnswerAlert3 wrong"></span>

                    <input class="wrongAnswerURL3" type="url" placeholder="URL da imagem 3">
                    <span class="wrongAnswerURLAlert3 wrong"></span>
                    `;

                } else if (answSize === 4) {
                    document.querySelector('.question').innerHTML += `
                    <input class="wrongAnswer1" type="text" value = "${dataFromServer.questions[i].answers[1].text}" placeholder="Resposta incorreta 1">
                    <span class="wrongAnswerAlert1 wrong"></span>

                    <input class="wrongAnswerURL1" type="url" value = "${dataFromServer.questions[i].answers[1].image}"placeholder="URL da imagem 1">
                    <span class="wrongAnswerURLAlert1 wrong"></span>

                    <input class="wrongAnswer2" type="text" value = "${dataFromServer.questions[i].answers[2].text}" placeholder="Resposta incorreta 2">
                    <span class="wrongAnswerAlert2 wrong"></span>

                    <input class="wrongAnswerURL2" type="url" value = "${dataFromServer.questions[i].answers[2].image}" placeholder="URL da imagem 2">
                    <span class="wrongAnswerURLAlert2 wrong"></span>
    
                    <input class="wrongAnswer3" type="text" value = "${dataFromServer.questions[i].answers[3].text}" placeholder="Resposta incorreta 3">
                    <span class="wrongAnswerAlert3 wrong"></span>

                    <input class="wrongAnswerURL3" type="url" value = "${dataFromServer.questions[i].answers[3].image}" placeholder="URL da imagem 3">
                    <span class="wrongAnswerURLAlert3 wrong"></span>
                    `;
                }
            } else {
                questionHTML.innerHTML += `
                <div class="question" onclick="callNextQuestion(this)">
                    <div class = "editForm" >
                        <h1>Pergunta ${i + 1}</h1>
                        <ion-icon name="create-outline"></ion-icon>
                    </div>
                    <div class="form escondido">
                        <input class="questionText" type="text" value= "${dataFromServer.questions[i].title}" placeholder="Texto da pergunta">
                        <span class="questionTextAlert wrong"></span>

                        <input class="questionBackground" type="text" value= "${dataFromServer.questions[i].color}" placeholder="Cor de fundo da pergunta">
                        <span class="questionBackgroundAlert wrong"></span>
                        
                        <h1>Resposta correta</h1>
        
                        <input class="rightAnswer" value = "${dataFromServer.questions[i].answers[0].text}" type="text" placeholder="Resposta correta">
                        <span class="rightAnswerAlert wrong"></span>

                        <input class="rightAnswerURL" value = "${dataFromServer.questions[i].answers[0].image}" type="url" placeholder="URL da imagem">
                        <span class="rightAnswerURLAlert wrong"></span>
        
                        <h1>Respostas incorretas</h1>
                        <span class="wrongAnswerMin1Alert wrong"></span>
                    </div>
                </div>
                `;

                if (answSize === 2) {
                    document.querySelectorAll(".form")[document.querySelectorAll(".form").length - 1].innerHTML += `
                    <input class="wrongAnswer1" type="text" value = "${dataFromServer.questions[i].answers[1].text}" placeholder="Resposta incorreta 1">
                    <span class="wrongAnswerAlert1 wrong"></span>
                    
                    <input class="wrongAnswerURL1" type="url" value = "${dataFromServer.questions[i].answers[1].image}"placeholder="URL da imagem 1">
                    <span class="wrongAnswerURLAlert1 wrong"></span>

                    <input class="wrongAnswer2" type="text" placeholder="Resposta incorreta 2">
                    <span class="wrongAnswerAlert2 wrong"></span>

                    <input class="wrongAnswerURL2" type="url" placeholder="URL da imagem 2">
                    <span class="wrongAnswerURLAlert2 wrong"></span>


                    <input class="wrongAnswer3" type="text" placeholder="Resposta incorreta 3">
                    <span class="wrongAnswerAlert3 wrong"></span>

                    <input class="wrongAnswerURL3" type="url" placeholder="URL da imagem 3">
                    <span class="wrongAnswerURLAlert3 wrong"></span>
                    `;
                } else if (answSize === 3) {
                    document.querySelectorAll(".form")[document.querySelectorAll(".form").length - 1].innerHTML += `
                    <input class="wrongAnswer1" type="text" value = "${dataFromServer.questions[i].answers[1].text}" placeholder="Resposta incorreta 1">
                    <span class="wrongAnswerAlert1 wrong"></span>

                    <input class="wrongAnswerURL1" type="url" value = "${dataFromServer.questions[i].answers[1].image}"placeholder="URL da imagem 1">
                    <span class="wrongAnswerURLAlert1 wrong"></span>

                    <input class="wrongAnswer2" type="text" value = "${dataFromServer.questions[i].answers[2].text}" placeholder="Resposta incorreta 2">
                    <span class="wrongAnswerAlert2 wrong"></span>

                    <input class="wrongAnswerURL2" type="url" value = "${dataFromServer.questions[i].answers[2].image}" placeholder="URL da imagem 2">
                    <span class="wrongAnswerURLAlert2 wrong"></span>
    
                    <input class="wrongAnswer3" type="text" placeholder="Resposta incorreta 3">
                    <span class="wrongAnswerAlert3 wrong"></span>

                    <input class="wrongAnswerURL3" type="url" placeholder="URL da imagem 3">
                    <span class="wrongAnswerURLAlert3 wrong"></span>
                    `;

                } else if (answSize === 4) {
                    document.querySelectorAll(".form")[document.querySelectorAll(".form").length - 1].innerHTML += `
                    <input class="wrongAnswer1" type="text" value = "${dataFromServer.questions[i].answers[1].text}" placeholder="Resposta incorreta 1">
                    <span class="wrongAnswerAlert1 wrong"></span>

                    <input class="wrongAnswerURL1" type="url" value = "${dataFromServer.questions[i].answers[1].image}"placeholder="URL da imagem 1">
                    <span class="wrongAnswerURLAlert1 wrong"></span>

                    <input class="wrongAnswer2" type="text" value = "${dataFromServer.questions[i].answers[2].text}" placeholder="Resposta incorreta 2">
                    <span class="wrongAnswerAlert2 wrong"></span>

                    <input class="wrongAnswerURL2" type="url" value = "${dataFromServer.questions[i].answers[2].image}" placeholder="URL da imagem 2">
                    <span class="wrongAnswerURLAlert2 wrong"></span>
    
                    <input class="wrongAnswer3" type="text" value = "${dataFromServer.questions[i].answers[3].text}" placeholder="Resposta incorreta 3">
                    <span class="wrongAnswerAlert3 wrong"></span>

                    <input class="wrongAnswerURL3" type="url" value = "${dataFromServer.questions[i].answers[3].image}" placeholder="URL da imagem 3">
                    <span class="wrongAnswerURLAlert3 wrong"></span>
                    `;
                }

            }



        } else {
            if (i === 0) {
                questionHTML.innerHTML += `
                <div class="question">
                    <h1>Pergunta ${i + 1}</h1>
                    <input class="questionText" type="text" placeholder="Texto da pergunta">
                    <span class="questionTextAlert wrong"></span>

                    <input class="questionBackground" type="text" placeholder="Cor de fundo da pergunta">
                    <span class="questionBackgroundAlert wrong"></span>

                    <h1>Resposta correta</h1>
    
                    <input class="rightAnswer" type="text" placeholder="Resposta correta">
                    <span class="rightAnswerAlert wrong"></span>

                    <input class="rightAnswerURL" type="url" placeholder="URL da imagem">
                    <span class="rightAnswerURLAlert wrong"></span>

    
                    <h1>Respostas incorretas</h1>
                    <span class="wrongAnswerMin1Alert wrong"></span>
    
                    <input class="wrongAnswer1" type="text" placeholder="Resposta incorreta 1">
                    <span class="wrongAnswerAlert1 wrong"></span>

                    <input class="wrongAnswerURL1" type="url" placeholder="URL da imagem 1">
                    <span class="wrongAnswerURLAlert1 wrong"></span>


    
                    <input class="wrongAnswer2" type="text" placeholder="Resposta incorreta 2">
                    <span class="wrongAnswerAlert2 wrong"></span>

                    <input class="wrongAnswerURL2" type="url" placeholder="URL da imagem 2">
                    <span class="wrongAnswerURLAlert2 wrong"></span>


    
                    <input class="wrongAnswer3" type="text" placeholder="Resposta incorreta 3">
                    <span class="wrongAnswerAlert3 wrong"></span>

                    <input class="wrongAnswerURL3" type="url" placeholder="URL da imagem 3">
                    <span class="wrongAnswerURLAlert3 wrong"></span>

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
                    <span class="questionTextAlert wrong"></span>

                    <input class="questionBackground" type="text" placeholder="Cor de fundo da pergunta">
                    <span class="questionBackgroundAlert wrong"></span>

                    <h1>Resposta correta</h1>
    
                    <input class="rightAnswer" type="text" placeholder="Resposta correta">
                    <span class="rightAnswerAlert wrong"></span>

                    <input class="rightAnswerURL" type="url" placeholder="URL da imagem">
                    <span class="rightAnswerURLAlert wrong"></span>
    
                    <h1>Respostas incorretas</h1>
                    <span class="wrongAnswerMin1Alert wrong"></span>

                    <input class="wrongAnswer1" type="text" placeholder="Resposta incorreta 1">
                    <span class="wrongAnswerAlert1 wrong"></span>

                    <input class="wrongAnswerURL1" type="url" placeholder="URL da imagem 1">
                    <span class="wrongAnswerURLAlert1 wrong"></span>


    
                    <input class="wrongAnswer2" type="text" placeholder="Resposta incorreta 2">
                    <span class="wrongAnswerAlert2 wrong"></span>

                    <input class="wrongAnswerURL2" type="url" placeholder="URL da imagem 2">
                    <span class="wrongAnswerURLAlert2 wrong"></span>


    
                    <input class="wrongAnswer3" type="text" placeholder="Resposta incorreta 3">
                    <span class="wrongAnswerAlert3 wrong"></span>

                    <input class="wrongAnswerURL3" type="url" placeholder="URL da imagem 3">
                    <span class="wrongAnswerURLAlert3 wrong"></span>
                    </div>
                </div>
                `;
            }
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
function nextToMakeLevels(edit = false) {
    const getQuestion = document.querySelectorAll('.question');
    let check = true;
    for (let i = 0; i < getQuestion.length; i++) {

        //texto da pergunta
        if (getQuestion[i].querySelector('.questionText').value.length < 20) {
            document.querySelector("header").scrollIntoView();
            document.querySelectorAll(".questionText")[i]
                .classList.add("fillerrado");

            document.querySelectorAll('.questionTextAlert')[i]
                .innerHTML = 'O texto da pergunta  precisa ter pelo menos 20 carácteres.';

            check = false;
        } else {
            if (document.querySelectorAll('.questionText')[i].classList.contains('fillerrado')) {
                document.querySelectorAll('.questionText')[i]
                    .classList.remove('fillerrado');

                document.querySelectorAll('.questionTextAlert')[i]
                    .innerHTML = '';
            }
        }

        //Cor de fundo da pergunta

        if (!isValidColor(getQuestion[i].querySelector('.questionBackground').value)) {
            document.querySelector("header").scrollIntoView();
            document.querySelectorAll(".questionBackground")[i]
                .classList.add("fillerrado");

            document.querySelectorAll('.questionBackgroundAlert')[i]
                .innerHTML = 'A cor de fundo deve ser no formato #FFFFFF.';

            check = false;
        } else {
            if (document.querySelectorAll('.questionBackground')[i].classList.contains('fillerrado')) {
                document.querySelectorAll('.questionBackground')[i]
                    .classList.remove('fillerrado');

                document.querySelectorAll('.questionBackgroundAlert')[i]
                    .innerHTML = '';
            }
        }

        //resposta certa
        if (getQuestion[i].querySelector('.rightAnswer').value === '') {
            document.querySelector("header").scrollIntoView();
            document.querySelectorAll(".rightAnswer")[i]
                .classList.add("fillerrado");

            document.querySelectorAll('.rightAnswerAlert')[i]
                .innerHTML = 'A resposta correta não pode estar em branco.';

            check = false;
        } else {
            if (document.querySelectorAll('.rightAnswer')[i].classList.contains('fillerrado')) {
                document.querySelectorAll('.rightAnswer')[i]
                    .classList.remove('fillerrado');

                document.querySelectorAll('.rightAnswerAlert')[i]
                    .innerHTML = '';
            }
        }

        //imagem certa
        if (!isValidHttpUrl(getQuestion[i].querySelector('.rightAnswerURL').value)) {
            document.querySelector("header").scrollIntoView();
            document.querySelectorAll(".rightAnswerURL")[i]
                .classList.add("fillerrado");

            document.querySelectorAll('.rightAnswerURLAlert')[i]
                .innerHTML = 'A URL da imagem é inválida.';

            check = false;
        } else {
            if (document.querySelectorAll('.rightAnswerURL')[i].classList.contains('fillerrado')) {
                document.querySelectorAll('.rightAnswerURL')[i]
                    .classList.remove('fillerrado');

                document.querySelectorAll('.rightAnswerURLAlert')[i]
                    .innerHTML = '';
            }
        }

        if (getQuestion[i].querySelector('.wrongAnswer1').value === ''
            && getQuestion[i].querySelector('.wrongAnswer2').value === ''
            && getQuestion[i].querySelector('.wrongAnswer3').value === '') {
            document.querySelector("header").scrollIntoView();
            getQuestion[i].querySelector('.wrongAnswerMin1Alert')
                .innerHTML = 'Pelo menos uma resposta incorreta deve ser preenchida.';

            check = false;
        } else {
            if (getQuestion[i].querySelector('.wrongAnswerMin1Alert').innerHTML !== '') {

                getQuestion[i].querySelector('.wrongAnswerMin1Alert')
                    .innerHTML = '';
            }
        }



        for (let j = 1; j <= 3; j++) {
            if (getQuestion[i].querySelector(`.wrongAnswer${j}`).value !== '' &&
                !isValidHttpUrl(getQuestion[i].querySelector(`.wrongAnswerURL${j}`).value)) {
                document.querySelector("header").scrollIntoView();
                getQuestion[i].querySelector(`.wrongAnswerURL${j}`)
                    .classList.add("fillerrado");

                getQuestion[i].querySelector(`.wrongAnswerURLAlert${j}`)
                    .innerHTML = 'A URL da imagem é inválida.';

                check = false;
            } else {
                if (getQuestion[i].querySelector(`.wrongAnswerURL${j}`).classList.contains('fillerrado')) {
                    getQuestion[i].querySelector(`.wrongAnswerURL${j}`)
                        .classList.remove("fillerrado");

                    getQuestion[i].querySelector(`.wrongAnswerURLAlert${j}`)
                        .innerHTML = '';

                }
            }




            if (getQuestion[i].querySelector(`.wrongAnswer${j}`).value === '' &&
                getQuestion[i].querySelector(`.wrongAnswerURL${j}`).value !== '') {
                document.querySelector("header").scrollIntoView();
                getQuestion[i].querySelector(`.wrongAnswer${j}`)
                    .classList.add("fillerrado");

                getQuestion[i].querySelector(`.wrongAnswerAlert${j}`)
                    .innerHTML = 'A resposta incorreta está em branco.';

                check = false;
            } else {
                if (getQuestion[i].querySelector(`.wrongAnswer${j}`).classList.contains('fillerrado')) {
                    getQuestion[i].querySelector(`.wrongAnswer${j}`)
                        .classList.remove("fillerrado");

                    getQuestion[i].querySelector(`.wrongAnswerAlert${j}`)
                        .innerHTML = '';

                }
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
        if (edit) {
            renderLevels(nNiveis, true);
        } else {
            renderLevels(nNiveis);
        }


    }
}

function renderLevels(levels, edit = false) {
    const levelsHTML = document.querySelector('.container4');
    levelsHTML.innerHTML = '';
    for (let i = 0; i < levels; i++) {
        if (edit) {
            if (i === 0) {
                levelsHTML.innerHTML += `<h1>Agora, decida os níveis! (edição) </h1>`;
                levelsHTML.innerHTML += `
                <div class="level">
                    <h1>Nível ${i + 1}</h1>
                    <span class="minValAlert wrong"></span>
                    <input class="levelText" type="text" value="${dataFromServer.levels[i].title}" placeholder="Título do nível">
                    <span class="levelTextAlert wrong"></span>

                    <input class="levelmin" type="text" value="${dataFromServer.levels[i].minValue}" placeholder="% de acerto mínima">
                    <span class="levelminAlert wrong"></span>
                    
                    <input class="levelURL" type="url" value="${dataFromServer.levels[i].image}" placeholder="URL da imagem do nível">
                    <span class="levelURLAlert wrong"></span>
    
                    <input class="levelDesc" type="text" value="${dataFromServer.levels[i].text}" placeholder="Descrição do nível">
                    <span class="levelDescAlert wrong"></span>
      
                </div>
                `;
            } else {
                levelsHTML.innerHTML += `
                <div class="level" onclick="callNextQuestion(this)">
                    <div class = "editForm" >
                        <h1>Nível ${i + 1}</h1>
                        <ion-icon name="create-outline"></ion-icon>
                    </div>
                    <span class="minValAlert wrong"></span>
                    <div class="form escondido">
                        <input class="levelText" type="text" value="${dataFromServer.levels[i].title}" placeholder="Título do nível">
                        <span class="levelTextAlert wrong"></span>

                        <input class="levelmin" type="text" value="${dataFromServer.levels[i].minValue}" placeholder="% de acerto mínima">
                        <span class="levelminAlert wrong"></span>
                        
                        <input class="levelURL" type="url" value="${dataFromServer.levels[i].image}" placeholder="URL da imagem do nível">
                        <span class="levelURLAlert wrong"></span>
        
                        <input class="levelDesc" type="text" value="${dataFromServer.levels[i].text}" placeholder="Descrição do nível">
                        <span class="levelDescAlert wrong"></span>
                    </div>
                </div>
                `;

            }

        } else {

            if (i === 0) {
                levelsHTML.innerHTML += `<h1>Agora, decida os níveis!</h1>`;
                levelsHTML.innerHTML += `
                <div class="level">
                    <h1>Nível ${i + 1}</h1>
                    <span class="minValAlert wrong"></span>
                    <input class="levelText" type="text" placeholder="Título do nível">
                    <span class="levelTextAlert wrong"></span>

                    <input class="levelmin" type="text" placeholder="% de acerto mínima">
                    <span class="levelminAlert wrong"></span>

                    <input class="levelURL" type="url" placeholder="URL da imagem do nível">
                    <span class="levelURLAlert wrong"></span>

                    <input class="levelDesc" type="text" placeholder="Descrição do nível">
                    <span class="levelDescAlert wrong"></span>
      
                </div>
                `;
            } else {
                levelsHTML.innerHTML += `
                <div class="level" onclick="callNextQuestion(this)">
                    <div class = "editForm" >
                        <h1>Nível ${i + 1}</h1>
                        <ion-icon name="create-outline"></ion-icon>
                    </div>
                    <span class="minValAlert wrong"></span>
                    <div class="form escondido">
                        <input class="levelText" type="text" placeholder="Título do nível">
                        <span class="levelTextAlert wrong"></span>

                        <input class="levelmin" type="text" placeholder="% de acerto mínima">
                        <span class="levelminAlert wrong"></span>

                        <input class="levelURL" type="url" placeholder="URL da imagem do nível">
                        <span class="levelURLAlert wrong"></span>

                        <input class="levelDesc" type="text" placeholder="Descrição do nível">
                        <span class="levelDescAlert wrong"></span>
                    </div>
                </div>
                `;

            }
        }


    }
    if (edit) {
        levelsHTML.innerHTML += `<button onclick="nextToSucessQuizz(true)">Editar Quizz</button>`;
    } else {
        levelsHTML.innerHTML += `<button onclick="nextToSucessQuizz()">Finalizar Quizz</button>`;
    }


}

function nextToSucessQuizz(edit = false) {
    const getLevel = document.querySelectorAll('.level');
    let check = true;
    let isZero = false;
    for (let i = 0; i < getLevel.length; i++) {

        if (getLevel[i].querySelector('.levelText').value.length < 10) {
            document.querySelector("header").scrollIntoView();
            getLevel[i].querySelector(".levelText")
                .classList.add("fillerrado");

            getLevel[i].querySelector('.levelTextAlert')
                .innerHTML = 'O título precisa ter pelo menos 10 caracteres.';
            check = false;
        } else {
            if (getLevel[i].querySelector(".levelText")
                .classList.contains("fillerrado")) {

                getLevel[i].querySelector(".levelText")
                    .classList.remove("fillerrado")
                getLevel[i].querySelector('.levelTextAlert')
                    .innerHTML = '';
            }

        }


        if (isNaN(getLevel[i].querySelector('.levelmin').value) ||
            getLevel[i].querySelector('.levelmin').value === '' ||
            parseInt(getLevel[i].querySelector('.levelmin').value) > 100 ||
            parseInt(getLevel[i].querySelector('.levelmin').value) < 0) {
            document.querySelector("header").scrollIntoView();
            getLevel[i].querySelector(".levelmin")
                .classList.add("fillerrado");

            getLevel[i].querySelector('.levelminAlert')
                .innerHTML = 'A % de acerto mínimo precisa ser um número de 0 a 100.';
            check = false;
        } else {
            if (getLevel[i].querySelector(".levelmin")
                .classList.contains("fillerrado")) {
                getLevel[i].querySelector(".levelmin")
                    .classList.remove("fillerrado");
                getLevel[i].querySelector('.levelminAlert')
                    .innerHTML = '';
            }
        }

        if (parseInt(getLevel[i].querySelector('.levelmin').value) === 0) {
            isZero = true;
        }

        if (!isValidHttpUrl(getLevel[i].querySelector('.levelURL').value)) {
            document.querySelector("header").scrollIntoView();
            getLevel[i].querySelector(".levelURL")
                .classList.add("fillerrado");

            getLevel[i].querySelector('.levelURLAlert')
                .innerHTML = 'A URL da imagem é inválida.';
            check = false;
        } else {
            if (getLevel[i].querySelector(".levelURL")
                .classList.contains("fillerrado")) {
                getLevel[i].querySelector(".levelURL")
                    .classList.remove("fillerrado");
                getLevel[i].querySelector('.levelURLAlert')
                    .innerHTML = '';
            }
        }

        if (getLevel[i].querySelector('.levelDesc').value.length < 30) {
            document.querySelector("header").scrollIntoView();
            getLevel[i].querySelector(".levelDesc")
                .classList.add("fillerrado");

            getLevel[i].querySelector('.levelDescAlert')
                .innerHTML = 'A descrição precisa ter pelo menos 30 carácteres.';
            check = false;
        } else {
            if (getLevel[i].querySelector(".levelDesc")
                .classList.contains("fillerrado")) {
                getLevel[i].querySelector(".levelDesc")
                    .classList.remove("fillerrado");
                getLevel[i].querySelector('.levelDescAlert')
                    .innerHTML = '';
            }
        }

    }
    for (let i = 0; i < getLevel.length; i++) {
        if (!isZero) {
            document.querySelector("header").scrollIntoView();
            getLevel[i].querySelector('.minValAlert')
                .innerHTML = 'É obrigatório existir pelo menos um nível cuja % de acerto mínima seja 0%.';
            check = false;

        } else {
            getLevel[i].querySelector('.minValAlert')
                .innerHTML = '';
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
        if (edit) {
            SaveEditedQuizz(dataFromServer.id);
        } else {
            HandleSendDataToServer(sendToServer);
        }


    }
}

function HandleSendDataToServer(data) {
    const send = axios.post(`${API}`, data);
    parent.innerHTML = '';
    loadCircle.display = "inline-block";
    send.then(SaveMyQuizz);

    function SaveMyQuizz(response) {

        let dataQuiz, dataQuizS, dataQuizD;


        dataQuiz = localStorage.getItem("dataQuiz");
        dataQuizD = JSON.parse(dataQuiz);

        dataQuizD.myID.push(response.data.id);
        dataQuizD.myKey.push(response.data.key);

        dataQuizS = JSON.stringify(dataQuizD);
        localStorage.setItem('dataQuiz', dataQuizS);

        nextToSucess();
    }

}





function nextToSucess() {
    const getMyQuizzes = JSON.parse(localStorage.getItem("dataQuiz")).myID;
    const getMyLastQuizz = getMyQuizzes[getMyQuizzes.length - 1];

    getMyQuizIdInServer(getMyLastQuizz);
}


let dataFromServer;
function getMyQuizIdInServer(idQuizz, edit = false) {
    const getMyQuiz = axios.get(`${API}/${idQuizz}`);
    getMyQuiz.then(renderSucess);

    function renderSucess(getData) {

        dataFromServer = getData.data;
        console.log(dataFromServer);
        if (edit) {
            aparecerCriarQuizz(true);

        } else {
            loadCircle.display = "none";
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
}
function mostrarQuizz(typeQuiz = 0) {
    if (typeQuiz === 0) {
        aparecerQuizz(dataFromServer);
    } else {
        aparecerQuizz(dataFromServer, 1);
    }
}




function callConfirmDelete(element) {

    const id = parseInt(element.querySelectorAll('span')[0].innerHTML);

    const titulo = element.querySelectorAll('span')[1].innerHTML;
    const isConfirm = confirm(`Gostaria de deletar o quiz "${titulo}"?`);
    const getKeyIndex = JSON.parse(localStorage.getItem("dataQuiz")).myID.indexOf(id);
    const key = JSON.parse(localStorage.getItem("dataQuiz")).myKey[getKeyIndex];

    if (isConfirm) {
        sendDeleteRequest(id, key);
    } else {
        console.log('no');
    }

}

function sendDeleteRequest(myId, myKey) {
    //Só é possível deletar o quizz se houver uma chave
    //correspondente ao mesmo no localstorage!
    const sendHeader = { headers: { "Secret-Key": `${myKey}` } };
    const sendDelete = axios.delete(`${API}/${myId}`, sendHeader);
    parent.innerHTML = '';
    loadCircle.display = "inline-block";
    sendDelete.then(loadQuizzes);
}

function callConfirmEdit(element) {
    const id = parseInt(element.querySelectorAll('span')[0].innerHTML);
    const titulo = element.querySelectorAll('span')[1].innerHTML;
    const isConfirm = confirm(`Gostaria de editar o quiz "${titulo}"?`);

    if (isConfirm) {
        getMyQuizIdInServer(id, true);
    }

}

function SaveEditedQuizz(myID) {
    const getKeyIndex = JSON.parse(localStorage.getItem("dataQuiz")).myID.indexOf(myID);
    const key = JSON.parse(localStorage.getItem("dataQuiz")).myKey[getKeyIndex];
    const sendHeader = { headers: { "Secret-Key": `${key}` } };
    const sendDelete = axios.put(`${API}/${myID}`, sendToServer, sendHeader);
    parent.innerHTML = '';
    loadCircle.display = "inline-block";
    sendDelete.then(nextToSucess);

}


function debugAcessQuizz(n) {
    //chamar no console
    parent.innerHTML = "";
    parent.classList.remove('container1');
    parent.classList.add('container4');
    // id do quizz que voce quer
    getMyQuizIdInServer(n);
}

function debugLevels() {
    //chamar no console
    parent.innerHTML = "";
    parent.classList.remove('container1');
    parent.classList.add('container4');
    // id do quizz que voce quer
    renderLevels(2);
}

function debugQuestions() {
    showQuestions();
    renderQuestions(3);
}