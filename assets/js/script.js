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
  };
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
  document.querySelector(".main-list").scrollIntoView();
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
        <button onclick="restartQuizz()">
          <p>Reiniciar Quizz</p>
        </button>
        <button onclick="returnHome()">
          <p>Voltar para home</p>
        </button>
      `;
  setTimeout(autoScrollQuizzResult, 2000)
}
function restartQuizz(){
    const selectionID= currentQuizzData.data.id
    axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${selectionID}`)
    .then(renderChoosenQuizz);
};
function returnHome(){
  getQuizzes()
  document.querySelector("body").scrollIntoView();
}
function autoScrollQuizzResult(){
      document.querySelector(".resultado-quizz").scrollIntoView();
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
  const elemento1 = document.getElementById('tituloQuizz');
  const elemento2 = document.getElementById('imagemQuizz');
  const elemento3 = document.getElementById('numPerguntasQuizz');
  const elemento4 = document.getElementById('numNiveisQuizz');
  if(!(elemento1.length<20 || elemento1.length>65)){
    tituloQuizz = elemento1.value;
}

  try {
    let url = new URL (elemento2.value)
    imagemQuizzURL = elemento2.value;
  } catch(err) {
    imagemQuizzURL = 0;
  }
  (elemento3.value>=3? numDePerguntas = elemento3.value : numDePerguntas = 0);
  (elemento4.value>=2? numDeNiveis = elemento4.value: numDeNiveis = 0);

  const alerta = document.querySelector('.comecoCriaQuizz .invisible');
  console.log(tituloQuizz, imagemQuizzURL ,numDeNiveis ,numDePerguntas);

  if(tituloQuizz&&imagemQuizzURL&&numDePerguntas&&numDeNiveis){
    document.querySelector('.comecoCriaQuizz').classList.add('hide');
    document.querySelector('.perguntasCriaQuizz').classList.remove('hide');
    elemento1.value = "";
    elemento2.value = "";
    elemento3.value = "";
    elemento4.value = "";
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

function criarPerguntasQuizz(){
  document.querySelector('.perguntasCriaQuizz.comecoCriaQuizz').classList.add('hide');
  document.querySelector('.nivelCriaQuizz').classList.remove('hide');
  criaPaginaDosNiveis();
}

//Pega as informações do nível (3ª página)

let niveis=[];

function criaPaginaDosNiveis(){
  numDeNiveis = Number(numDeNiveis);
  const boxForm = document.querySelector('.nivelCriaQuizz');
  boxForm.innerHTML = '<p class="mb-27">Agora, decida os níveis</p>';
  for(let i = 0; i<numDeNiveis; i++){
    boxForm.innerHTML+=`
      <div class="box-form pt-00">
        <div class="container">
            <p>Nível ${i+1}</p>
            <ion-icon onclick="abreFormulario(this)" name="create-outline"></ion-icon>
        </div>
        <form class="hide">
            <input class="nivel-titulo" type="text" placeholder="Título do nível">
            <input class="nivel-acerto-minimo" type="text" placeholder="% de acerto mínima">
            <input class="nivel-URL" type="url" placeholder="URL da imagem do nível">
            <input class="nivel-descricao" type="text" placeholder="Descrição do nível">
        </form>
      </div>`
  }
  boxForm.innerHTML+=`
  <p class="invisible">Os dados inseridos não são válidos!</p>
  <button onclick="informacoesNivelQuizz()">Prosseguir para criar perguntas</button>`
}

function informacoesNivelQuizz(){
  niveis=[];
  const alerta = document.querySelector('.nivelCriaQuizz .invisible');
  const elemento1 = document.querySelectorAll('.nivel-titulo');
  const elemento2 = document.querySelectorAll('.nivel-acerto-minimo');
  const elemento3 = document.querySelectorAll('.nivel-URL');
  const elemento4 = document.querySelectorAll('.nivel-descricao');
  let aux = true;
  let aux2 = false;
//Validação dos dados
  elemento1.forEach((valor)=>{
    if(valor.value.length<10){
      aux = false;
    }
  });

  elemento2.forEach((valor)=>{
    if(valor.value<0||valor.value>100){
      aux = false;
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
  }
  });

  elemento4.forEach((valor)=>{
    if(valor.value.length<30){
      aux = false;
    }
  });

    if(!(aux&&aux2)){
      mensagemAlerta(alerta);
      return;
    }
  //Validação dos dados

  //Tratamento dos dados
  for(let i=0; i<elemento1.length; i++){
    niveis.push({title: elemento1[i].value,
    image: elemento3[i].value,
    text: elemento4[i].value,
    minValue: elemento2[i].value});
  }
  elemento1.forEach((valor)=> {valor.value = "";});
  elemento2.forEach((valor)=> {valor.value = "";});
  elemento3.forEach((valor)=> {valor.value = "";});
  elemento4.forEach((valor)=> {valor.value = "";});
}

getQuizzes();
