let currentQuizzData, currentMinValue, storedValue, storedValueLevel = undefined;
let userId =[]
let treatedUserId =[]
let purgedUserId = []
function getQuizzes() {
  getlocalStorage()
  const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
  promise.then(purgeUserId);
  promise.then(renderAllQuizzes);
  promise.then(renderUserQuizzes);
};
function renderAllQuizzes(quizzInfo) {
  if (quizzInfo.data.length>0){
  const quizzes = document.querySelector(".allQuizzes");
  quizzes.innerHTML = "";
  for (let i = 0; i < quizzInfo.data.length; i++) {
    quizzes.innerHTML += `

    <li id="${quizzInfo.data[i].id}" onclick="getChoosenQuizzData(this)" class="allQuizzes-card" style="background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${quizzInfo.data[i].image});">
      <p class="allQuizzes-title">${quizzInfo.data[i].title}</p>
    </li>
        `
        ;
//        <img class="allQuizzes-img" src=${quizzInfo.data[i].image} alt="img do quizz">
    }
  }
  };
function getChoosenQuizzData(selection){
    const selectionID= selection.getAttribute("id");
    const promise = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${selectionID}`)
    promise.then(renderChoosenQuizz);
};
function unrenderUserQuizzes(){
  document.querySelector(".user-list").classList.add("hide");
}
function renderChoosenQuizz(quizzInfo){
  unrenderUserQuizzes()
  document.querySelector(".main-title").classList.add("hide");
  document.querySelector(".main-create").classList.add("hide");
  document.querySelector(".user-list").classList.add("hide");
  document.querySelector(".allQuizzes.main-page-width").classList.replace("main-page-width","quizz-page-width")
  const quizzes = document.querySelector(".allQuizzes");
  //Aqui embaixo é inserido o banner que fica no topo do Quizz a imagem e o título do quizz.
  quizzes.innerHTML=`
  <div id="${quizzInfo.data.id}" class="banner-quizz" style="background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.60), rgba(0, 0, 0, 0.60)), url(${quizzInfo.data.image})">
        <p>${quizzInfo.data.title}</p>
  </div>
  <div class="quizz-things">
  </div>
  `
  document.querySelector(".banner-quizz").scrollIntoView();
  const quizzThings = document.querySelector(".quizz-things");
  //Aqui embaixo é inserido cada questão individual do Quizz
  for (let i=0; i<quizzInfo.data.questions.length;i++){
    /*
    Na função abaixo deve ser incluso a cor de cada pergunta individual!
               
    */
    quizzThings.innerHTML+=`
    <div class="unanswered question-box">
      <div class="question-declaration" style="background-color:${quizzInfo.data.questions[i].color}">
        <p>${quizzInfo.data.questions[i].title}</p>
      </div>
      <div class="options-of-question-${i} alternatives-box">
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
        <img class ="unselected-img" src="${quizzInfo.data.questions[i].answers[j].image}" alt="">
        <p class="alternative-text">${quizzInfo.data.questions[i].answers[j].text}</p>
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
      div.classList.remove("alternative-text")
  })
}
function incorrectAnswerTextChnge(){
  const incorretos = document.querySelectorAll("div.answered .false p")
  incorretos.forEach(div => {
      div.classList.add("incorreto")
      div.classList.remove("alternative-text")
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
  const quizzThings = document.querySelector(".quizz-things");
	quizzThings.innerHTML += `
        <div class="resultado-quizz">
          <div class="acerto-e-title">
            <p>${correctAnswerPercent}% de acerto: ${storedValueLevel.title}</p>
          </div>
          <div class="results-image-text">
            <img src="${storedValueLevel.image}" alt="">
            <p>${storedValueLevel.text}</p>
          </div>
        </div>
        <div>
          <button class="restart-quizz" onclick="restartQuizz()">
            Reiniciar Quizz
          </button>
          <button class="return-home" onclick="returnHome()">
            Voltar para home
          </button>
        </div>
      `;
  document.querySelector(".restart-quizz").parentNode.classList.add("result-bottom-buttons")
  setTimeout(autoScrollQuizzResult, 2000)
}
function restartQuizz(){
    if (document.querySelector(".allQuizzes.quizz-page-width")!= null){
      document.querySelector(".allQuizzes.quizz-page-width").classList.replace("quizz-page-width","main-page-width")

    }
    const selectionID= currentQuizzData.data.id
    const promise = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${selectionID}`)
    promise.then(renderChoosenQuizz);
  };
function returnHome(){
  createMain()
  getQuizzes()
  document.querySelector(".paginaInicial").scrollIntoView();
  document.querySelector('.pageSucessoQuizz').classList.add('hide');
  document.querySelector('.paginaInicial').classList.remove('hide')

}
function autoScrollQuizzResult(){
  if (document.querySelector(".resultado-quizz") != null){
      document.querySelector(".resultado-quizz").scrollIntoView()};
}
function abreCriacaoQuizz(){
  document.querySelector('.paginaInicial').classList.add('hide');
  document.querySelector('.comecoCriaQuizz').classList.remove('hide');
}
function abreFormulario(caixa){
  caixa.parentNode.parentNode.querySelector('form').classList.toggle('hide');
}

//======================================================================================================
//Pega as informações básicas do quizz criado (1ª página)
let tituloQuizz;
let imagemQuizzURL;
let numDePerguntas;
let numDeNiveis;

//                                 A VARIÁVEL A BAIXO É A QUE SERÁ ENVIADA PARA O SERVIDOR
let userQuizz = {
  title: "",
  image: "",
  questions: [],
  levels: []
}


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

  //                                  AQUI EMBAIXO SALVA O TITULO E IMAGEM
  userQuizz.title = tituloQuizz;
  userQuizz.image = imagemQuizzURL;

  if(tituloQuizz&&imagemQuizzURL&&numDePerguntas&&numDeNiveis){
    document.querySelector('.comecoCriaQuizz').classList.add('hide');
    document.querySelector('.perguntasCriaQuizz').classList.remove('hide');
    criaPaginaDosNiveis();
    criarPaginaDasPerguntas();
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
  //Verificações dos dados
  let aux = true;
  const cores = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f','A','B','C','D','E','F'];

  const alerta = document.querySelector('.perguntasCriaQuizz .invisible');
  const textoPergunta = document.querySelectorAll('.question-text');
  const corPergunta = document.querySelectorAll('.question-color');
  const imagemPergunta = document.querySelectorAll('.imagemURL');

  let respostaPergunta = [];
  let imagemURLPergunta = [];
//Verifica a existencia de pelo menos duas respostas e duas imagens
  for(let i=0; i<numDePerguntas;i++){
    
    let variavel1 = document.querySelector('.perguntasCriaQuizz').querySelectorAll(`.resposta${i+1}`);
    let variavel2 = document.querySelector('.perguntasCriaQuizz').querySelectorAll(`.imagemQuizz${i+1}`);
    if(!(variavel1[0].value&&variavel2[0].value)){
      aux = false;
      return;
    }
    const guardaValores1 = [];
    const guardaValores2 = [];
    let cont = 0;
    variavel1.forEach((valor)=>{
      guardaValores1.push(valor.value);
      if(!valor.value){
        cont++;
      }
    })
    if(cont>2){
      aux = false;
      console.log('erro');
      return;
    }
    cont = 0;
    variavel2.forEach((valor)=>{
      guardaValores2.push(valor.value);
      if(!valor.value){
        cont++;
      }
    })
    if(cont>2){
      aux = false;
      console.log('erro');
      return;
    }
    respostaPergunta.push(guardaValores1);
    imagemURLPergunta.push(guardaValores2);
  }
  console.log(respostaPergunta);
  console.log(imagemURLPergunta);
  //Verifica tamanho da pergunta
  textoPergunta.forEach((valor)=>{
    if(valor.value.length<20){
      console.log('tamanho da pergunta');
      aux = false;
    }
  });
  //Verifica se a cor está no formato certo
  corPergunta.forEach((valor)=>{
    console.log(valor.value[0]);
    if(!(valor.value[0].includes('#')&&valor.value.length===7)){
      aux=false;
      console.log('cor sem #');
      return;
    }
    for(let i=1;i<7;i++){
      let a = false
      for(let j=0;j<cores.length;j++){
        if(valor.value[i]==cores[j]){
          a = true;
        }
      }
      if(a==false){
        aux = a;
        console.log('cor');
        return;
      }
      }
  });
    //Verifica se as imagens são URL's
  imagemPergunta.forEach((valor)=>{
    if(valor.value){
      try {
        let url = new URL (valor.value)
      } catch(err) {
        aux = false;
        console.log('Url');
        return;
        
      }
    }
  
  });
    //Cria o objeto Pergunta
  
  for(let i=0; i<numDePerguntas;i++){
    let perguntaObject = {title: textoPergunta[i].value,
    color: corPergunta[i].value,
    answers: []};
    for(let j =0; j<4;j++){
      let a = (j===0?true:false);
      if(respostaPergunta[i][j]&&imagemURLPergunta[i][j]){
        let resposta = {
          text: respostaPergunta[i][j],
          image: imagemURLPergunta[i][j],
          isCorrectAnswer: a}
          perguntaObject.answers.push(resposta);
      }
    }
    userQuizz.questions.push(perguntaObject);
  }

  if(!(aux)){
    mensagemAlerta(alerta);
  }else{
    document.querySelectorAll('.perguntasCriaQuizz input').forEach((valor)=>{valor.value = '';});
    document.querySelector('.perguntasCriaQuizz.comecoCriaQuizz').classList.add('hide');
    document.querySelector('.nivelCriaQuizz').classList.remove('hide');
  }
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
  <button onclick="informacoesNivelQuizz()">Finalizar Quizz</button>`
}

function criarPaginaDasPerguntas(){
  const paginaDasPerguntas = document.querySelector('.perguntasCriaQuizz');
  paginaDasPerguntas.innerHTML = `<p class="comecoCriaQuizz-title">Crie suas perguntas</p>`;
  for(let i = 0; i<numDePerguntas; i++){
    paginaDasPerguntas.innerHTML+=`
    <div class="box-form pt-00">
      <div class="container">
        <p>Pergunta ${i+1}</p>
        <ion-icon onclick="abreFormulario(this)" name="create-outline"></ion-icon>
      </div>
      <form class="hide">
        <input class="question-text" type="text" placeholder="Texto da pergunta">
        <input class="question-color" type="url" placeholder="Cor do fundo da pergunta">
        <p class="comecoCriaQuizz-question mt-18">Resposta correta</p>
        <input class="resposta${i+1}" type="text" placeholder="Resposta correta">
        <input class="imagemQuizz${i+1} imagemURL" type="text" placeholder="URL da imagem">
        <p class="comecoCriaQuizz-question mt-18">Resposta incorretas</p>
        <input class="resposta${i+1}" type="text" placeholder="Resposta correta 1">
        <input class="imagemQuizz${i+1} imagemURL" type="text" placeholder="URL da imagem 1">
        <input class="mt-18 resposta${i+1}" type="text" placeholder="Resposta correta 2">
        <input class="imagemQuizz${i+1} imagemURL" type="text" placeholder="URL da imagem 2">
        <input class="mt-18 resposta${i+1}" type="text" placeholder="Resposta correta 3">
        <input class="imagemQuizz${i+1} imagemURL" type="text" placeholder="URL da imagem 3">
      </form>
    </div>`
  }
  paginaDasPerguntas.innerHTML+=`
  <p class="invisible">Os dados inseridos não são válidos!</p>
  <button onclick="criarPerguntasQuizz()">Prosseguir pra criar níveis</button>`
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


  //                       AQUI EMBAIXO ESTÁ SALVANDO OS NÍVEIS
  userQuizz.levels=[]
  userQuizz.levels.push(niveis);
  //Esvazia primeiro pra limpar caso o usuário for querer criar mais um Quizz
  //depois e não recarregar a página
  elemento1.forEach((valor)=> {valor.value = "";});
  elemento2.forEach((valor)=> {valor.value = "";});
  elemento3.forEach((valor)=> {valor.value = "";});
  elemento4.forEach((valor)=> {valor.value = "";});
  document.querySelector('.nivelCriaQuizz').classList.add('hide');
  document.querySelector('.pageSucessoQuizz').classList.remove('hide');
  criaPaginaFinalização();
}

function criaPaginaFinalização(){
  document.querySelector('.pageSucessoQuizz').innerHTML=` 
  <p class="pageSucessoQuizz-title">Seu quizz está pronto!</p>
  <div class="pageSucessoQuizz-img"></div>
  <div class="pageSucessoQuizz-botao">
      <button onclick="">Acessar Quizz</button>
      <div class="botaoVoltar" onclick="returnHome()">Voltar pra home</div>
  </div>`;

  criarQuizz()

  document.querySelector('.pageSucessoQuizz-img').innerHTML = `
  <img src="${imagemQuizzURL}" alt="Imagem do seu quizz">
  <p>${tituloQuizz}</p>
  <div></div>
  `;
}
// ========================================================================================================
function getlocalStorage(){
  const stringuserId = localStorage.getItem("id")
  if (stringuserId !== null){
    userId.push(stringuserId)
    treatedUserId = JSON.parse("[" + userId + "]")
  }
}

function criarQuizz(){
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", userQuizz)
    promise.then(criarQuizzPostProcessing)
}
function criarQuizzPostProcessing(variable){
  const currentID=variable.data.id
  console.log(currentID)
  userId.push(currentID)
  console.log(userId)
  localStorage.setItem("id",userId)
  treatedUserId = JSON.parse("[" + userId + "]")
}

function PlayCreatedQuizz(){
  const idOfLastQuizz = treatedUserId[treatedUserId.length-1];
  const promise = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idOfLastQuizz}`)
  promise.then(renderChoosenQuizz);
}

function renderUserQuizzes(quizzInfo){
  getlocalStorage()
  reducePurgedUserId();
  if (purgedUserId.length>0){
    document.querySelector(".hide.user-list").classList.remove("hide");
    document.querySelector(".main-create").classList.add("hide");
    const quizzes = document.querySelector(".userQuizzes");
    quizzes.innerHTML = "";
    for (let i = 0; i < quizzInfo.data.length; i++) {
        for (let j=0; j<purgedUserId.length;j++){
          if (purgedUserId[j]==quizzInfo.data[i].id){
          quizzes.innerHTML += `
          <li id="${quizzInfo.data[i].id}" onclick="getChoosenQuizzData(this)" class="allQuizzes-card" style="background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${quizzInfo.data[i].image});">
           <p class="userQuizzes-title">${quizzInfo.data[i].title}</p>
          </li>
          `;
        }
    }

  }
}}
function reducePurgedUserId(){
    purgedUserId = purgedUserId.reduce(function (acc, curr) {
      if (!acc.includes(curr))
          acc.push(curr);
      return acc;
  }, []);
  return purgedUserId
};
function purgeUserId(quizz){
  if (treatedUserId.length>0){
    for (let k = 0; k < quizz.data.length; k++){
      for (let w=0; w< treatedUserId.length; w++){
        if (treatedUserId[w]===quizz.data[k].id){
          purgedUserId.push(treatedUserId[w]);
        }
    }
  }}
}
function createMain(){
  const mainContent = document.querySelector("main")
  mainContent.innerHTML=`
  <div class="main-create">
  <p>Você não criou nenhum quizz ainda :(</p>
  <button onclick="abreCriacaoQuizz()">Criar Quizz</button>
</div>

<div class="hide user-list">
  <div class="criaQuizz">
      <p class="user-title">Seus Quizzes</p>
      <button onclick="abreCriacaoQuizz()"><ion-icon name="add-circle"></ion-icon></button>
  </div>
  <ul class="userQuizzes">
  </ul>
</div>

<div class="main-list">
  <p class="main-title">Todos os Quizzes</p>
  <ul class="allQuizzes main-page-width"></ul>
</div>
`
}
createMain()
getQuizzes();
