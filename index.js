let selectedCourse=null;
let selectedQuestionPaper=null;
let examURL="exam.html"
function loadPage(){
    const Courses=document.getElementById("courses");
    const clickSound=new Audio("Audio\\click.wav");
    fetch("Data.json")
    .then(response=>response.json())
    .then(datas=>datas.forEach(data=>{
        const newLi=document.createElement("li");
        newLi.id=data.course;
        newLi.classList.add="course";
        const newImg=document.createElement("img");
        newImg.src=`Images\\${data.course}.png`;
        newImg.style.width="100px";
        newImg.style.height="100px";
        const newA=document.createElement("a");
        newA.textContent=data.course;
        const newUl=document.createElement("ul");
        newUl.className="question-papers";
        newUl.id=data.course;
        data.questionpapers.forEach(questionpaper=>{
            const innerLi=document.createElement("li");
            const newkeys=Object.keys(questionpaper);
            innerLi.id=newkeys[0];
            innerLi.textContent=newkeys[0];
            newUl.appendChild(innerLi);
        })
        newLi.appendChild(newA);
        newLi.insertBefore(newImg,newA);
        newLi.appendChild(newUl);
        Courses.appendChild(newLi);
    }))

    
    Courses.addEventListener("click",function(e){
        if(e.target.tagName==="A"){
            clickSound.play();
            const clickedLi=e.target.parentNode;
            document.querySelectorAll("#courses li.selected").forEach(li=>{
                if(li!==clickedLi){
                    li.classList.remove("selected")
                }
            });
            clickedLi.classList.toggle("selected");
        }else {
            const questionLi=e.target.closest("ul.question-papers > li");
            if(questionLi){
                clickSound.play();
                console.log("Clicked:",questionLi.id,"From:",questionLi.parentNode.id)
                selectedCourse=questionLi.parentNode.id;
                selectedQuestionPaper=questionLi.id;
                localStorage.setItem("selectedCourse",selectedCourse);
                localStorage.setItem("selectedQuestionPaper",selectedQuestionPaper);
                window.open(examURL,'_blank');
            }
        }
    },false);
    document.addEventListener("click", function (e) {
        if (!Courses.contains(e.target)) {
            document.querySelectorAll("#courses li.selected").forEach(li => {
                li.classList.remove("selected");
            });
        }
    });
}
loadPage();