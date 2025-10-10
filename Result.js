const selectedCourse = localStorage.getItem("selectedCourse");
const selectedQuestionPaper = localStorage.getItem("selectedQuestionPaper");
const heading=document.getElementById("main-heading");
const correctAnswers=localStorage.getItem("correctAnswers");
const answers=JSON.parse(localStorage.getItem("answers"));
const choices=JSON.parse(localStorage.getItem("choices"));
const scrollSound= new Audio("Audio\\scroll.mp3");
console.log(answers,choices);
heading.textContent=correctAnswers+" / 100";
function loadQuestionPaper(selectedCourse,selectedQuestionPaper){
    const submitSound= new Audio("Audio\\submit.mp3");
    submitSound.play();
    const newForm=document.querySelector("form");
    async function fetchData() {
        try{
            const response=await fetch("Data.json");
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data=await response.json();
            return data;
        }
        catch(error){
            console.error('Fetch Error:',error);
            return null;
        }
    }
    fetchData().then(datas=>{
        datas.forEach(data=>{
            if(data.course===selectedCourse){
                data.questionpapers.forEach(questionpaper=>{
                    const paperCode=Object.keys(questionpaper);
                    if(paperCode[0]===selectedQuestionPaper){
                        questionpaper[paperCode].forEach(questionNumber=>{
                            const navButton=document.createElement("a");
                            navButton.href="#"+questionNumber.number;
                            navButton.textContent=questionNumber.number;
                            navBar.appendChild(navButton);
                            const newDiv=document.createElement("div");
                            newDiv.className="Question-Block";
                            newDiv.id=questionNumber.number;
                            const newQuestion=document.createElement("h2");
                            newQuestion.textContent=questionNumber.number+". "+questionNumber.question;
                            newDiv.appendChild(newQuestion);
                            questionNumber.options.forEach(option=>{
                                const newLabel=document.createElement("label");
                                newLabel.textContent=option;
                                if(option===choices[questionNumber.number-1]){
                                    if(option===answers[questionNumber.number-1]){
                                        newLabel.classList.add("correct");
                                        navButton.classList.add("markedCorrect");
                                    }
                                    else{
                                        newLabel.classList.add("wrong");
                                        navButton.classList.add("markedWrong");
                                    }
                                }
                                newDiv.appendChild(newLabel);
                                if(questionNumber.diagrams){
                                    const newDiagram=document.createElement("img");
                                    newDiagram.src=`Diagrams\\${paperCode[0]}-${questionNumber.number}-${option}.png`;
                                    newDiagram.style.height="100px";
                                    newDiagram.style.width="200px";
                                    newDiagram.style.paddingLeft="50px";
                                    newDiagram.style.pointerEvents="none";
                                    newLabel.appendChild(newDiagram);
                                }
                                newDiv.appendChild(document.createElement("br"));
                            })
                            newForm.appendChild(newDiv);
                            navBar.addEventListener("click",function(e){
                                if(e.target.tagName==="A"){
                                    scrollSound.play();
                                }
                            })
                        })
                    }
                })
            }
        })
    })
}
loadQuestionPaper(selectedCourse,selectedQuestionPaper);