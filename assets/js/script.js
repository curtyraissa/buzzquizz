function getQuizzes() {
  const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
  promise.then(renderAllQuizzes);
}
function renderAllQuizzes(quizzInfo) {
  const quizzes = document.querySelector(".allQuizzes");
  quizzes.innerHTML = "";
  for (let i = 0; i < quizzInfo.data.length; i++) {
    quizzes.innerHTML += `
    <li>
      <img class="allQuizzes-img" src=${quizzInfo.data[i].image} alt="img do quizz">
      <p class="allQuizzes-title">${quizzInfo.data[i].title}</p>
    </li>
        `;
  }
}
getQuizzes();