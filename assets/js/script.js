let currentQuizzData, currentMinValue, storedValue, storedValueLevel = undefined;
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
    <div class="unanswered question-box">
      <div class="question-declaration">
        <p>${quizzInfo.data.questions[i].title}</p>
      </div>
      <div class="options-of-question-${i}">
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
    selection.parentNode.parentNode.classList.replace("unanswered","answered")
    const acinzentados = document.querySelectorAll("div.answered .unselected")
    //altera as divs irmãs da selecionada
    acinzentados.forEach(div => {
      if (div.outerHTML !== selection.outerHTML){
        div.classList.add("opacidade")
      }
    })
    correctAnswerTextChange();
    incorrectAnswerTextChnge();
    setTimeout(autoQuizzScroll, 2000)
    selectionCounter();
  } else {
    return true;
  }
}
function correctAnswerTextChange(){
  const corretos = document.querySelectorAll("div.answered .true p")
  corretos.forEach(div => {
      div.classList.add("correto")
  })
}
function incorrectAnswerTextChnge(){
  const incorretos = document.querySelectorAll("div.answered .false p")
  incorretos.forEach(div => {
      div.classList.add("incorreto")
  })
}
function autoQuizzScroll(){
  /*
  BUG WARNING: Função está dando scroll automático na "resposta" da questão, e não na caixa da questão em sí!
  */
    if (document.querySelector(".unanswered") == null){
      return true;
    } else {
      document.querySelector(".unanswered").scrollIntoView();
    }
}
function selectionCounter(){
    const answerCounter = document.querySelectorAll(".selected")
    if (answerCounter.length === currentQuizzData.data.questions.length){
      answerCheck();
    }
}

function answerCheck() {
	const correctAnswerCounter = document.querySelectorAll(".selected.true").length
	const correctAnswerPercent = Math.round((correctAnswerCounter / currentQuizzData.data.questions.length) * 100)

	storedValue = currentQuizzData.data.levels[0].minValue;
  storedValueLevel = currentQuizzData.data.levels[0]

	for (let i = 0; i < currentQuizzData.data.levels.length; i++) {
		currentMinValue = currentQuizzData.data.levels[i].minValue;
    if (currentQuizzData.data.levels[i].minValue <= correctAnswerPercent) {
      if (storedValue <= currentMinValue){
        storedValue = currentMinValue;
        storedValueLevel = currentQuizzData.data.levels[i]
      }
    }
		}
  const quizzes = document.querySelector(".allQuizzes");
	quizzes.innerHTML += `
        <div class="resultado-quizz">
          <div>
            <p>${correctAnswerPercent}% de acerto: ${storedValueLevel.title}</p>
          </div>
          <div>
            <img src="${storedValueLevel.image}" alt="">
            <p>${storedValueLevel.text}</p>
          </div>
        </div>
        <div class="quizz-restart">
          <p>Reiniciar Quizz</p>
        </div>
        <div class"post-quizz-home-return>
          <p>Voltar para home</p>
        </div>
      `;
  setTimeout(autoScrollQuizzResult, 2000)
}
function autoScrollQuizzResult(){
      document.querySelector(".resultado-quizz").scrollIntoView();
}
function abreCriacaoQuizz(){
  document.querySelector('.paginaInicial').classList.add('hide');
  document.querySelector('.paginaCriacaoQuizz').classList.remove('hide');
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
    console.log('Erro')
  }
  (elemento3>=3? numDePerguntas = elemento3 : numDePerguntas = 0);
  (elemento4>=2? numDeNiveis = elemento4: numDeNiveis = 0);

  if(tituloQuizz&&imagemQuizzURL&&numDePerguntas&&numDeNiveis){
    console.log('Deu certo!')
    document.getElementById('tituloQuizz').value = "";
    document.getElementById('imagemQuizz').value = "";
    document.getElementById('numPerguntasQuizz').value = "";
    document.getElementById('numNiveisQuizz').value = "";
    
  }
  else{
    console.log("deu erro");
  }
}

getQuizzes();
