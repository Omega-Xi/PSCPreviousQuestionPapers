const selectedCourse = localStorage.getItem("selectedCourse");
const selectedQuestionPaper = localStorage.getItem("selectedQuestionPaper");
const heading=document.getElementById("main-heading");
const navBar=document.getElementById("navBar")
const answers=[];
const selectionSound= new Audio("Audio\\selection.mp3");
const scrollSound= new Audio("Audio\\scroll.mp3");
let correctAnswers=0;
let wrongAnswers=0;
let choices=new Array(100).fill(null);
heading.textContent=selectedCourse+" "+selectedQuestionPaper;
function loadQuestionPaper(selectedCourse,selectedQuestionPaper){
    const newForm=document.querySelector("form");
    async function fetchData() {
        try{
            const response=await fetch(`Question Papers\\Data\\${selectedQuestionPaper}.json`);
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
    fetchData().then(data=>{
        data.forEach(questionNumber=>{
            const navButton=document.createElement("a");
            navButton.href="#"+questionNumber.number;
            navButton.textContent=questionNumber.number;
            navBar.appendChild(navButton);
            const newDiv=document.createElement("div");
            newDiv.className="Question-Block";
            newDiv.id=questionNumber.number;
            const newQuestion=document.createElement("h2");
            newQuestion.innerHTML=questionNumber.number+". "+questionNumber.question;
            newDiv.appendChild(newQuestion);
            answers.push(questionNumber.answer);
            questionNumber.options.forEach(option=>{
                const newLabel=document.createElement("label");
                newLabel.textContent=option;
                newDiv.appendChild(newLabel);
                if(questionNumber.diagrams){
                    const newDiagram=document.createElement("img");
                    newDiagram.src=`Diagrams\\${selectedQuestionPaper}-${questionNumber.number}-${option}.png`;
                    newDiagram.style.height="100px";
                    newDiagram.style.width="200px";
                    newDiagram.style.paddingLeft="50px";
                    newDiagram.style.pointerEvents="none";
                    newLabel.appendChild(newDiagram);
                }
                newDiv.appendChild(document.createElement("br"));
            })
            newForm.appendChild(newDiv);
        })
        const submitButton=document.createElement("button");
        submitButton.type="submit";
        submitButton.textContent="SUBMIT";
        submitButton.addEventListener('click',e=>{
            e.preventDefault();
            for(let i=0;i<100;i++){
                if(choices[i]===answers[i]){
                    correctAnswers++;
                }
            }
            localStorage.setItem("choices",JSON.stringify(choices));
            localStorage.setItem("answers",JSON.stringify(answers));
            localStorage.setItem("correctAnswers",correctAnswers)
            localStorage.setItem("selectedCourse",selectedCourse);
            localStorage.setItem("selectedQuestionPaper",selectedQuestionPaper);
            window.open("Result.html",'_self');
        });
        newForm.appendChild(submitButton);
        document.querySelectorAll(".Question-Block").forEach(question=>{
        question.addEventListener("click",function(e){
            if(e.target.tagName==="LABEL"){
                selectionSound.play();
                const clickedLabel=e.target;
                const clickedParent=clickedLabel.parentNode;
                clickedParent.querySelectorAll("label.chosen").forEach(label=>{
                    if(label!==clickedLabel){
                        label.classList.remove("chosen")
                    }
                });
                clickedLabel.classList.toggle("chosen");
                const numbers=document.querySelectorAll('a');
                numbers.forEach(scroll=>{
                    scroll.addEventListener('click',()=>scrollSound.play());
                });
                document.querySelectorAll('a').forEach(a=>{
                    if(a.textContent===clickedParent.id){
                        if(clickedLabel.classList.contains("chosen")){
                            a.classList.add("answered");
                        }
                        else{
                            a.classList.remove("answered");
                        }
                    }
                });
                choices[clickedParent.id-1]=clickedLabel.textContent;
            }
        })
    })
    })
    
}

    
loadQuestionPaper(selectedCourse,selectedQuestionPaper);