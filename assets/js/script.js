let globalQuizzInfo = undefined;
function getQuizzes() {
  const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
  promise.then(renderAllQuizzes);
}
function renderAllQuizzes(quizzInfo) {
  const quizzes = document.querySelector(".allQuizzes");
  quizzes.innerHTML = "";
  for (let i = 0; i < quizzInfo.data.length; i++) {
    quizzes.innerHTML += `
        <li id="${quizzInfo.data[i].id}" onclick="renderChoosenQuizz(this)">
        <img class="allQuizzes-img" src=${quizzInfo.data[i].image} alt="">
        <p class="allQuizzes-title">${quizzInfo.data[i].title}</p>
        </li>
        `;
  }
  globalQuizzInfo = quizzInfo.data;
}
function renderChoosenQuizz(selection) {
  const selectionID = selection.getAttribute("id")
  const quizzes = document.querySelector(".allQuizzes");
  for (let i = 0; i < globalQuizzInfo.length; i++) {
    if (selectionID == globalQuizzInfo[i].id) {
      quizzes.innerHTML = `
            <li>
            <img src="${globalQuizzInfo[i].image}">
            <p>${globalQuizzInfo[i].title}</p>
            </li>
            `
    }
  }
};
getQuizzes();

//Ação do botão de criar quizz
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
    elemento2 = 0;
  }
  (elemento3>=3? numDePerguntas = elemento3 : numDePerguntas = 0);
  (elemento4>=2? numDeNiveis = elemento4: numDeNiveis = 0);

  const alerta = document.querySelector('.comecoCriaQuizz .invisible');

  if(tituloQuizz&&imagemQuizzURL&&numDePerguntas&&numDeNiveis){
    document.querySelector('.comecoCriaQuizz').classList.add('hide');
    document.getElementById('tituloQuizz').value = "";
    document.getElementById('imagemQuizz').value = "";
    document.getElementById('numPerguntasQuizz').value = "";
    document.getElementById('numNiveisQuizz').value = "";
    alerta.classList.remove('alert');
  }
  else{
    alerta.classList.remove('alert');
    setTimeout(() =>{alerta.classList.add('alert');}, 300);
  }
}