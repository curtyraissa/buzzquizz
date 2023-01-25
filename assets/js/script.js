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
  <div>
        <img src="${quizzInfo.data.image}">
        <p>${quizzInfo.data.title}</p>
  </div>
  `
  //Aqui embaixo é inserido cada questão individual do Quizz
  //No caso, é uma div que tem o título da questão, e outra div que dentro dela contem as alternativas para esta questão
  for (let i=0; i<quizzInfo.data.questions.length;i++){
    quizzes.innerHTML+=`
    <div>
      <p>${quizzInfo.data.questions[i].title}</p>
      <div class="options-of-question-${i}"></div>
    </div>`
  //Atenção aqui em cima! Pode inserir classes adicionais para formatar como desejar no CSS,
  //mas cuidado se for mexer nas classes já existentes
  }
  for (let i=0; i<quizzInfo.data.questions.length;i++){
    //Se não colocasse esse for aqui em cima, o query selector abaixo sempre escolheria a primeira
    //div que aparece. Mas com o for, é possível percorrer todas as divs de questões.
    const quizzOptions = document.querySelector(`.options-of-question-${i}`)
    quizzOptions.innerHTML=""
    for (let j=0; j<quizzInfo.data.questions[i].answers.length;j++){
      quizzInfo.data.questions[i].answers.sort(shuffle);
      quizzOptions.innerHTML+=`
      <div>
        <img src="${quizzInfo.data.questions[i].answers[j].image}" alt="">
        <p>${quizzInfo.data.questions[i].answers[j].text}</p>
      </div>
      `
    }
  }
}
function shuffle() {
  return Math.random() - 0.5;
}
getQuizzes();