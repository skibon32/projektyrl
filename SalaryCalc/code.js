 window.addEventListener("load",()=>{
    kalkulator.init();
})
class Kalk{
    init(){
        ui.eventList();
    }
    };

const kalkulator=new Kalk()
class Ui{
    tbody_worker=document.querySelector("#employee");
    input_brutto=document.querySelector("#brutto_input");
    emerytalna=document.querySelector(".emerytalna");
    rentowa=document.querySelector(".rentowa");
    chorobowa=document.querySelector(".chorobowa");
    suma_skladek=document.querySelector(".suma_skladek");
    podstawa=document.querySelector(".podstawa");
    ubezpiecznie=document.querySelector(".ubezpiecznie");
    zaliczka=document.querySelector(".zaliczka");
    netto=document.querySelector(".netto");
    podstawa_opod=document.querySelector(".podstawa_opod");
    koszt_przychodu=document.querySelector("#koszt_przychodu");
    ulga_inp=document.querySelector("#ulga_inp");
    ulga_podatkowa=0;
    koszt_przy=300;
    data=0;
    eventList(){
        this.input_brutto.addEventListener("input",()=>{
            this.data=this.input_brutto.value;
            this.showEmployeeStats();
            pracodawca.showEmployerStats();
        })
        this.koszt_przychodu.addEventListener("change",()=>{
            this.koszt_przy=this.koszt_przychodu.value
            this.showEmployeeStats();
            pracodawca.showEmployerStats();
        });
        this.ulga_inp.addEventListener("change",()=>{
            this.ulga_podatkowa=this.ulga_inp.value;
            this.showEmployeeStats();
            pracodawca.showEmployerStats();
        })
        pracodawca.totalbossInp.addEventListener("input",()=>{
            this.showEmployeeStats();
            pracodawca.showEmployerStats();
        })
        document.querySelectorAll("input[name=age]").forEach(el=>{
            addEventListener("change",()=>{
                this.showEmployeeStats();
                pracodawca.showEmployerStats();
            })
        })
        
    }
    showEmployeeStats(){
        let suma=(this.data*(0.0976+0.015+0.0245));
        let age=document.querySelector("input[name=age]:checked").value
        let podst=(this.data-suma);
        let income=Math.round(podst-this.koszt_przy);
        let advanceTax;
        let accumulatedYearlyIncomeSum;
        
        if(income<0){
            income=0;
        }
        if(!accumulatedYearlyIncomeSum) accumulatedYearlyIncomeSum = 0;
        if( accumulatedYearlyIncomeSum < 120000
            && income + accumulatedYearlyIncomeSum >= 120000) {
            
            advanceTax = income * 0.12;


            const taxAbove85k = ((income + accumulatedYearlyIncomeSum) - 120000 ) * 0.32+10800;

            advanceTax += taxAbove85k;

        } else if(income + accumulatedYearlyIncomeSum >= 120000) {
            advanceTax = income * 0.32;
   
        } else {
            advanceTax = (income * 0.12);

        }
        let zaliczka_kon=Math.round(advanceTax-this.ulga_podatkowa);
        if(zaliczka_kon<0||age=="true"){
            zaliczka_kon=0;
            advanceTax=0;
        }

        this.emerytalna.innerText=`${(this.data*0.0976).toFixed(2)} ZŁ`;
        this.rentowa.innerText=`${(this.data*0.015).toFixed(2)} ZŁ`;
        this.chorobowa.innerText=`${(this.data*0.0245).toFixed(2)} ZŁ`;
        this.suma_skladek.innerText=`${(suma).toFixed(2)} ZŁ`;
        this.podstawa.innerText=`${(podst).toFixed(2)} ZŁ`;
        this.ubezpiecznie.innerText=`${(podst*0.09).toFixed(2)} ZŁ`;
        this.zaliczka.innerText=`${zaliczka_kon.toFixed(2)} ZŁ`;
        this.podstawa_opod.innerText=`${income} ZŁ`;
        this.netto.innerText=`${(this.data-suma-(podst*0.09)-(Math.round(zaliczka_kon))).toFixed(2)} ZŁ`;
        }
    }

const ui=new Ui();

class Pracodawca{
pensionContributionByBoss=document.querySelector(".pensionbyboss")
disablityContributionByBoss=document.querySelector(".disablitybyboss")
accidentContributionByBoss=document.querySelector(".accidentbyboss")
laborfund=document.querySelector(".laborfund");
fgsp=document.querySelector(".fgsp");
totalContributionByBoss=document.querySelector(".totalcontribution");
totalCost=document.querySelector(".totalcost");
totalbossInp=document.querySelector("#totalboss");

showEmployerStats(){
    this.pensionContributionByBoss.innerText=`${(ui.data*0.0976).toFixed(2)} ZŁ`;
    this.disablityContributionByBoss.innerText=`${(ui.data*0.065).toFixed(2)} ZŁ`;
    this.accidentContributionByBoss.innerText=`${(ui.data*document.querySelector("#totalboss").value/100).toFixed(2)} ZŁ`;
    this.laborfund.innerText=`${(ui.data*0.0245).toFixed(2)} ZŁ`;
    this.fgsp.innerText=`${(ui.data*0.001).toFixed(2)} ZŁ`;
    this.totalContributionByBoss.innerText=`${(parseFloat(this.pensionContributionByBoss.innerText)+parseFloat(this.disablityContributionByBoss.innerText)+parseFloat(this.accidentContributionByBoss.innerText)).toFixed(2)} ZŁ`;
    this.totalCost.innerText=`${(Number(ui.data)+Number(ui.data*0.0976)+Number(ui.data*0.065)+Number(ui.data*0.0245)+Number(ui.data*0.001)+Number(ui.data*document.querySelector("#totalboss").value/100)).toFixed(2)} ZŁ`;
}
}
const pracodawca= new Pracodawca();