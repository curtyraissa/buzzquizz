function getQuizzes(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    promise.then(renderAllQuizzes);
}
function renderAllQuizzes(quizzInfo){
    const quizzes = document.querySelector(".allQuizzes");
    quizzes.innerHTML = "";
    for (let i=0; i< quizzInfo.data.length;i++){
        quizzes.innerHTML += `
        <li>
        <img src=${quizzInfo.data[i].image} alt="">
        <p>${quizzInfo.data[i].title}</p>
        </li>
        `;
    } 
}
getQuizzes();