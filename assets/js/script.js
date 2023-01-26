let currentQuizzData = undefined;
function getQuizzes() {
  const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
  promise.then(renderAllQuizzes);
};
function renderAllQuizzes(quizzInfo) {
  const quizzes = document.querySelector(".allQuizzes");
  quizzes.innerHTML = "";
  for (let i = 0; i < quizzInfo.data.length; i++) {
    quizzes.innerHTML += `
    <li id="${quizzInfo.data[i].id}" onclick="getChoosenQuizzData(this)">
      <img class="allQuizzes-img" src=${quizzInfo.data[i].image} alt="img do quizz">
      <p class="allQuizzes-title">${quizzInfo.data[i].title}</p>
    </li>
        `;
    }
  } ;
function getChoosenQuizzData(selection){
    const selectionID= selection.getAttribute("id");
    axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${selectionID}`)
    .then(renderChoosenQuizz);
};
function renderChoosenQuizz(quizzInfo){
  const quizzes = document.querySelector(".allQuizzes");
  //Aqui embaixo é inserido o banner que fica no topo do Quizz a imagem e o título do quizz.
  quizzes.innerHTML=`
  <div id="${quizzInfo.data.id}">
        <img src="${quizzInfo.data.image}">
        <p>${quizzInfo.data.title}</p>
  </div>
  `
  //Aqui embaixo é inserido cada questão individual do Quizz
  for (let i=0; i<quizzInfo.data.questions.length;i++){
    quizzes.innerHTML+=`
    <div class="question-box">
      <div class="question-declaration">
        <p>${quizzInfo.data.questions[i].title}</p>
      </div>
      <div class="unanswered options-of-question-${i}">
      </div>
    </div>`
    quizzInfo.data.questions[i].answers.sort(shuffle);
  }
  for (let i=0; i<quizzInfo.data.questions.length;i++){
    //Percorre todas as divs de questões.
    const quizzOptions = document.querySelector(`.options-of-question-${i}`)
    quizzOptions.innerHTML=""
    for (let j=0; j<quizzInfo.data.questions[i].answers.length;j++){
      quizzOptions.innerHTML+=`
      <div class="unselected option ${quizzInfo.data.questions[i].answers[j].isCorrectAnswer}" onclick="selectOption(this)">
        <img src="${quizzInfo.data.questions[i].answers[j].image}" alt="">
        <p>${quizzInfo.data.questions[i].answers[j].text}</p>
      </div>
      `
    }
  }
  currentQuizzData=quizzInfo;
}
function shuffle() {
  return Math.random() - 0.5;
}

function selectOption(selection){
  //console.log(selection)
  //console.log(currentQuizzData)
  if (!selection.parentNode.classList.contains("answered")){
    selection.classList.replace("unselected","selected")
    selection.parentNode.classList.replace("unanswered","answered")


    let acinzentados = document.querySelectorAll("div.answered .unselected")
    //altera as divs irmãs da selecionada
    acinzentados.forEach(div => {
      if (div.outerHTML !== selection.outerHTML){
        div.classList.add("opacidade")
      }
    })
    correctAnswerTextChange();
    incorrectAnswerTextChnge();
    setTimeout(autoQuizzScroll, 2000)
  } else {
    return true;
  }
}
function correctAnswerTextChange(){
  let corretos = document.querySelectorAll("div.answered .true p")
  corretos.forEach(div => {
      div.classList.add("correto")
  })
}
function incorrectAnswerTextChnge(){
  let incorretos = document.querySelectorAll("div.answered .false p")
  incorretos.forEach(div => {
      div.classList.add("incorreto")
  })
}
function autoQuizzScroll(){
    if (document.querySelector(".unanswered") == null){
      return true;
    } else {
      document.querySelector(".unanswered").scrollIntoView();
    }
}


function abreCriacaoQuizz(){
  document.querySelector('.paginaInicial').classList.add('hide');
  document.querySelector('.comecoCriaQuizz').classList.remove('hide');
}
function abreFormulario(caixa){
  caixa.parentNode.parentNode.querySelector('form').classList.toggle('hide');
}
//Pega as informações básicas do quizz criado (1ª página)
let tituloQuizz;
let imagemQuizzURL;
let numDePerguntas;
let numDeNiveis;

function informacoesBasicasQuizz(){
  tituloQuizz = 0;
  imagemQuizzURL = 0;
  numDePerguntas = 0;
  numDeNiveis = 0;
  let elemento1 = document.getElementById('tituloQuizz').value;
  let elemento2 = document.getElementById('imagemQuizz').value;
  let elemento3 = document.getElementById('numPerguntasQuizz').value;
  let elemento4 = document.getElementById('numNiveisQuizz').value;
  if(!(elemento1.length<20 || elemento1.length>65)){
    tituloQuizz = elemento1;
}

  try {
    let url = new URL (elemento2)
    imagemQuizzURL = elemento2;
  } catch(err) {
    elemento2 = 0;
  }
  (elemento3>=3? numDePerguntas = elemento3 : numDePerguntas = 0);
  (elemento4>=2? numDeNiveis = elemento4: numDeNiveis = 0);

  const alerta = document.querySelector('.comecoCriaQuizz .invisible');

  if(tituloQuizz&&imagemQuizzURL&&numDePerguntas&&numDeNiveis){
    document.querySelector('.comecoCriaQuizz').classList.add('hide');
    document.querySelector('.perguntasCriaQuizz').classList.remove('hide');
    document.getElementById('tituloQuizz').value = "";
    document.getElementById('imagemQuizz').value = "";
    document.getElementById('numPerguntasQuizz').value = "";
    document.getElementById('numNiveisQuizz').value = "";
    alerta.classList.remove('alert');
  }
  else{
    mensagemAlerta(alerta);
  }
}

function mensagemAlerta(texto){
  texto.classList.remove('alert');
  setTimeout(() =>{texto.classList.add('alert');}, 300);
}
//Pega as informações do nível (2ª página)
let tituloNivel;
let acertoMinimoNivel;
let urlNivel;
let descricaoNivel;

function criaPaginaDosNiveis(){

}

function informacoesNivelQuizz(){

  const alerta = document.querySelector('.nivelCriaQuizz .invisible');
  let elemento1 = document.querySelectorAll('.nivel-titulo');
  let elemento2 = document.querySelectorAll('.nivel-acerto-minimo');
  let elemento3 = document.querySelectorAll('.nivel-URL');
  let elemento4 = document.querySelectorAll('.nivel-descricao');
  let aux = true;
  let aux2 = false;
//Validação dos dados
  elemento1.forEach((valor)=>{
    if(valor.value.length<10){
      aux = false;
      console.log('aqui');
    }
  });

  elemento2.forEach((valor)=>{
    if(valor.value<0||valor.value>100){
      aux = false;
      console.log('aqui');
    }
    if(valor.value==0){
      aux2 = true;
    }
  });

  elemento3.forEach((valor)=>{
    try {
    let url = new URL (valor.value);
  } catch(err) {
    aux = false;
    console.log('aqui');
  }
});

elemento4.forEach((valor)=>{
  if(valor.value.length<30){
    aux = false;
    console.log('aqui');
  }
});

  if(!(aux&&aux2)){
    mensagemAlerta(alerta);
    return;
  }
//Validação dos dados

}

getQuizzes();
