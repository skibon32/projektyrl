const calcsection=document.querySelector("body")
function calculate(){
    const gender=document.querySelector(`[name="gender"]:checked`).getAttribute("data-val")
    const age=document.querySelector("#age").value;
    const weight=document.querySelector("#weight").value;
    const height=document.querySelector("#height").value;
    const activitselect=document.querySelector("#activitylevel");
    const activitylevel=Number(activitselect.options[activitselect.selectedIndex].getAttribute("data-val"));
    const goal=document.querySelector("#goal");
    const goallevel=Number(goal.options[goal.selectedIndex].getAttribute("data-val"));
    
    let ppm;
    if(gender==="men"){
       ppm=(66.47+(13.7*weight)+(5*height)-(6.67*age))
    }
    else{
        ppm=(655.1+(9.567*weight)+(1.85*height)-(4.68*age))
    }
        return((ppm*activitylevel+(ppm*0.1)+goallevel).toFixed(1));
}
document.querySelector("#form").addEventListener("submit",(e)=>{
    e.preventDefault()
    createModal()
    document.querySelector("dialog").showModal();
})

function smoothScroll(target){
    const el=document.querySelector(target)
    const position=el.offsetTop;
    
    window.scrollTo({
        top:position,
        behavior:"smooth"
    })

}
document.querySelector("#help").addEventListener("click",()=>{
    helpmodal();
    document.querySelector("dialog").showModal();
})
function helpmodal(){
    let el=document.createElement("dialog");
    el.innerHTML=`<div>
    <div class="help-item">
        <h3>Brak aktywności fizycznej</h3>
        <p>Osoba, która nie wykonuje żadnych regularnych ćwiczeń fizycznych, spędza większość czasu w pozycji siedzącej lub leżącej.</p>
    </div>
    <div class="help-item">
        <h3>Niska aktywność fizyczna</h3>
        <p>Osoba, która pracuje głównie w pozycji siedzącej, ale wykonuje nieznaczną ilość dodatkowej aktywności fizycznej.</p>
    </div>
    <div class="help-item">
        <h3>Umiarkowana aktywność fizyczna</h3>
        <p>Osoba, która pracuje głównie nie fizycznie i trenuje 2 razy w tygodniu.</p>
    </div>
    <div class="help-item">
        <h3>Wysoka aktywność fizyczna</h3>
        <p>Osoba, która pracuje lekko fizycznie i trenuje 3-4 razy w tygodniu.</p>
    </div>
    <div class="help-item">
        <h3>Ekstremalna aktywność fizyczna</h3>
        <p>Osoba, która pracuje ciężko fizycznie i trenuje codziennie.</p>
    </div>
    <button id="help-close">Zamknij</button>
</div>`
    calcsection.append(el);
    document.querySelector("#help-close").addEventListener("click",()=>{
        document.querySelector("dialog").close()
        document.querySelector("dialog").remove();
    })

}
function createModal(){
    
  let el=document.createElement("dialog")
   el.innerHTML=`<h2>Wynik</h2>
   <p>Twoje zapotrzebowanie kaloryczne</p>
   <p>${calculate()} kcal</p>
   <button id="button-close">Zamknij</button>`;
   calcsection.appendChild(el)
   document.querySelector("#button-close").addEventListener("click",()=>{
    document.querySelector("dialog").close()
    document.querySelector("dialog").remove();
   })

}
window.addEventListener("scroll",reveal)
function reveal(){
    const revealcards=document.querySelectorAll(".reveal");
    revealcards.forEach((el)=>{
        let windowheight=window.innerHeight;
        let revealtop=el.getBoundingClientRect().top;
        let revaelpoint=150;
        if(revealtop<windowheight-revaelpoint){
            el.classList.add("active");
        }
    })
}