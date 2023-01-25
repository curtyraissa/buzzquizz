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