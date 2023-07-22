//start
let countSpan = document.querySelector(".count span");
let bulletsDiv = document.querySelector(".bullets .spans");

let QuestionAreaDiv = document.querySelector(".QuestionArea");
let answerAreaDiv = document.querySelector(".answerArea");
let submitBtn = document.querySelector(".submit");
let resultSpan = document.querySelector(".results span");

let Q_index = 0;
let numberOfCorrectAnswer = 0;

////////////////////////////////////////
//ajax request
function getQuestionsFromJSON(callback) {
  var myrequest = new XMLHttpRequest();

  myrequest.onreadystatechange = function () {
    if (myrequest.readyState === 4 && myrequest.status === 200) {
      let QuestionObj = JSON.parse(this.responseText);
      let questionLength = QuestionObj.length;

      //add bullets
      createBullets(questionLength);
      let bulletsSpans = document.querySelectorAll(".bullets .spans  span");
      function changebulletscolor(index) {
        bulletsSpans.forEach(function (ele, i) {
          if (i === index) {
            ele.classList.add("on");
          } else {
            ele.classList.remove("on");
          }
        });
      }
      onload(addDataQuestions(QuestionObj[Q_index], questionLength));

      addDataQuestions(QuestionObj[Q_index], questionLength);

      //click submit
      submitBtn.onclick = () => {
        let rightAnswers = QuestionObj[Q_index]["right-answer"];

        Q_index++;

        console.log(Q_index);
        checkAnswer(rightAnswers, questionLength);

        console.log(`numberOfCorrectAnswer: ${numberOfCorrectAnswer}`);

        //check if end of questions
        if (Q_index != questionLength) {
          //add new question
          QuestionAreaDiv.innerHTML = "";
          answerAreaDiv.innerHTML = "";
          addDataQuestions(QuestionObj[Q_index], questionLength);
          //change bullets color
          changebulletscolor(Q_index);
        } else {
          submitBtn.disabled = true;
          displayResultMessage(numberOfCorrectAnswer, questionLength);
        }
      };
    }
  };

  myrequest.open("GET", "questions.json", true);
  myrequest.send();
}

getQuestionsFromJSON();
////////////////////////////////////////////

function createBullets(num) {
  countSpan.innerHTML = ` ${num}`;

  //create the bullets
  for (let i = 0; i < num; i++) {
    let mySpan = document.createElement("span");
    bulletsDiv.appendChild(mySpan);
    //add class for the first class
    if (i === 0) {
      mySpan.classList.add("on");
    }
  }
}

function addDataQuestions(obj, index) {
  //add to QuestionAreaDiv
  let QuestionTitle = document.createElement("h2");
  // QuestionTitle.classList.add();
  let questionText = document.createTextNode(obj.question);
  QuestionTitle.appendChild(questionText);

  QuestionAreaDiv.appendChild(QuestionTitle);

  //add to answerArea

  for (let i = 1; i <= 4; i++) {
    let answerDiv = document.createElement("div");
    answerDiv.className = "answer";

    // Create the input element
    let inputRadio = document.createElement("input");

    // Set the input attributes
    inputRadio.type = "radio";
    inputRadio.name = "answers";
    inputRadio.id = `answer-${i}`;
    inputRadio.dataset.answer = obj[`answer-${i}`];

    //cheched
    if (i === 1) {
      inputRadio.checked = true;
    }

    // Create the label element
    let AnswerLabel = document.createElement("label");
    AnswerLabel.htmlFor = `answer-${i}`;
    AnswerLabel.textContent = obj[`answer-${i}`];

    answerDiv.appendChild(inputRadio);
    answerDiv.appendChild(AnswerLabel);
    answerAreaDiv.appendChild(answerDiv);
  }
}

function checkAnswer(rightAnswer, count) {
  let answers = document.getElementsByName("answers");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rightAnswer === theChoosenAnswer) {
    numberOfCorrectAnswer++;
    document.querySelector("#success").play();
  } else {
    document.querySelector("#fail").play();
  }

  //check if end of questions
  if (Q_index === count) {
    submitBtn.disabled = true;
  }
}

function displayResultMessage(numberOfCorrectAnswer, questionLength) {
  const percentage = (numberOfCorrectAnswer / questionLength) * 100;

  switch (true) {
    case percentage === 100:
      resultSpan.innerHTML = `  Perfect`;
      break;
    case percentage >= 90 && percentage < 100:
      resultSpan.innerHTML = `  very Good`;

      break;
    case percentage >= 70 && percentage <= 90:
      resultSpan.innerHTML = ` Good`;
      break;
    case percentage >= 50 && percentage <= 70:
      resultSpan.innerHTML = ` Fair`;
      break;
    default:
      resultSpan.innerHTML = ` Bad `;
  }
}
