
const main=document.querySelector("#main-window");
class WeatherApp{
    weekdays=["Nie","Pon",'Wto',"Śro","Czw","Pią","Sob"];
    cityInput=document.querySelector("#city-input");
    menuState=false;
    
    autocomplete=document.querySelector(".autocomplete-city");
    currentWindow=0;
    lon=undefined;
    lat=undefined;
    cityName=undefined;
    apikey="b5c81a9405bb5f44fd5ce751e9b339e6";
    init(){
        
        this.getDataFromGPS()
        this.events();
        
        
    }
    events(){
        document.querySelector("#search").addEventListener("click",(e)=>{
           e.preventDefault();
           this.getDataByLocation();
           this.cityInput.value=""
           this.cityInput.removeAttribute("required")
        })
        document.querySelector("#weather-now").addEventListener("click",()=>{
          if(this.lat===undefined)return
          this.showCurrentWeather()});
        document.querySelector("#weather-weakly").addEventListener("click",()=>{
          if(this.lat===undefined)return
          this.showWeaklyWeather()});
        document.querySelector("#weather-chart").addEventListener("click",()=>{
          if(this.lat===undefined)return
          this.chart()});
        document.querySelector("#nav-button").addEventListener("click",()=>{
            this.menuState=!this.menuState;
            this.menuState? document.querySelector(".nav-aside").classList.add("active"):document.querySelector(".nav-aside").classList.remove("active");
            
        })
        document.querySelector("#nav-refresh").addEventListener("click",this.refresh);
        document.querySelector("#nav-local-gps").addEventListener("click",async()=>{
            await this.getDataFromGPS();
            this.refresh();
        })
        document.querySelector("#modal-close").addEventListener("click",()=>{
          this.cityInput.setAttribute("required","");
          document.querySelector("#gpsmodal").close()});
    }
    refresh=()=>{
      switch(this.currentWindow){
        case 0:
          this.showCurrentWeather();
        break;
        case 1:
          this.showWeaklyWeather();
        break;
        case 2:
          this.chart();
        break;
      }
      
    }
    autocompleteLi(data){
      return `<div class="autocomplete-container">
      <div class="autocomplete-name-country"><div class="m-1">${data.local_names?.pl || data.name}</div>
      <div class="m-1">${data.country}</div></div>
      <div class="">${data.state|| ""}</div>
      <div class="map-button"><a href="https://www.google.com/maps/@${data.lat},${data.lon},15.0z" target="_blank"><button onClick="event.stopPropagation()"class="fa fa-solid fa-street-view rounded-circle p-1"></button></a>
    </div>`;
      
      

    }
    autocompleteErase(){
      this.autocomplete.innerHTML="";
    }
    async getDataByLocation(){
        
        let place=this.cityInput.value;
        if(place=="") return;
        return fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=5&appid=${this.apikey}`)
          
        .then(
          res=>{
            if(res.ok)return res.json()
        })
        .then(data=>{
          console.log(data.length)
          if(data.length===0){
            alert("Brak Wyników")
          }
          this.autocompleteErase();
          data.forEach((el)=>{
            const newchild=document.createElement("div")
            newchild.innerHTML=this.autocompleteLi(el);
            newchild.addEventListener("click",(e)=>{
              this.lat=el.lat;
              this.lon=el.lon;
              this.autocompleteErase();
              this.refresh();
            })
            this.autocomplete.appendChild(newchild);
          
          })
        })
        .catch(error=>console.log(error))
        
    }
    groupDataByDate(data){
      //grupowanie danych forecastu po dniu miesiąca
      const groupByDate=data.list.reduce((group,item)=>{
        let date=new Date(item.dt*1000);
        if(group[date.getDate()]==null)group[date.getDate()]=[]
        group[date.getDate()].push(item);
        return group
      },{})
      return groupByDate;
    }
    AddZeroTime(time){
      if(time<10)return "0"+time
      return time
    }
    async getDataFromGPS() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.lon = pos.coords.longitude;
            this.lat = pos.coords.latitude;
            this.cityName = undefined;
            resolve(pos);
            this.showCurrentWeather();
          },
          (error) => {
            document.querySelector("#gpsmodal").showModal();
            document.querySelector(".nav-aside").classList.add("active")
          }
        );
      });
    }
    async fetchDataByCoords(){
       return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&appid=${this.apikey}&units=metric&lang=pl`)
        .then(response=>response.json())
        .then(data=>data)
        
    }
    async insertData(){
        let precipitation;
        const data=await this.fetchDataByCoords()
        console.log(data)
        //przypisanie wartości do preception rain lub snow jeżeli api zwróci wartość
        if(data.hasOwnProperty('rain'))precipitation=data.rain["1h"];
        else if(data.hasOwnProperty('snow'))precipitation=data.snow["1h"];
        else precipitation=0;

        let timeNow=new Date((data.dt+data.timezone-7200)*1000);
        let sunUP=new Date((data.sys.sunrise+data.timezone-7200)*1000);
        let sunDOWN=new Date((data.sys.sunset+data.timezone-7200)*1000);
        main.innerHTML=`
        <section class="weather-main">
        <div class="basic-info">
          <div id="icon"><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" /></div>
          <div id="temperature">${Math.round(data.main.temp)} °C</div>
          
        <div class="additional-info">
          <div id="city">${this.cityName || data.name}</div>
          <div id="current-hour">${this.AddZeroTime(timeNow.getHours())}:${this.AddZeroTime(timeNow.getMinutes())}</div>
        </div>
        </div>
        <div class="weather-item">
          <h7>Pogoda</h7>
          <div id="weather-description">${data.weather[0].description}</div>
        </div>
        <div class="weather-item">
          <h7>Odczuwalna</h7>
          <div id="feelstemp">${Math.round(data.main.feels_like)} °C</div>
        </div>
        <div class="weather-item">
          <h7>Zachmurzenie</h7>
          <div id="clouds">${data.clouds.all}%</div>
        </div>
        <div class="weather-item">
          <h7>Wilgotność</h7>
          <div id="humidity">${data.main.humidity}%</div>
        </div>
        <div class="weather-item">
          <h7>Widoczność</h7>
          <div id="visibility">${data.visibility}m</div>
        </div>
        <div class="weather-item">
          <h7>Ciśnienie</h7>
          <div id="pressure">${data.main.pressure} hPa</div>
        </div>

        <div class="prop-container">
          <div class="weather-item">
            <h7>Wschód Słońca</h7>
            <div id="sunrise">${this.AddZeroTime(sunUP.getHours())}:${this.AddZeroTime(sunUP.getMinutes())}</div>
          </div>
          <div class="weather-item">
            <h7>Zachód Słońca</h7>
            <div id="sunset">${this.AddZeroTime(sunDOWN.getHours())}:${this.AddZeroTime(sunDOWN.getMinutes())}</div>
          </div>
        </div>
        <div class="prop-container">
          <div class="weather-item">
            <h7>Prędkość Wiatru</h7>
            <div id="wind-speed">${data.wind.speed} m/s</div>
          </div>
          <div class="weather-item">
            <h7>Kierunek Wiatru</h7>
            <div id="wind-direction">${data.wind.deg}°</div>
          </div>
        </div>
        <div class="weather-item">
          <h7>Aktulane opady</h7>
          <div id="rain-snow">${precipitation}mm</div>
        </div>
        </section>
        `;
        
    }
    showCurrentWeather=()=>{
        this.insertData();
        this.currentWindow=0;
        this.menuState=false;
        document.querySelector(".nav-aside").classList.remove("active");
        
    }
    showWeaklyWeather=()=>{
      this.insertForecastData(); 
      this.currentWindow=1;
      this.menuState=false;
      document.querySelector(".nav-aside").classList.remove("active");

    }
    async forecastFetch(){
      return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${this.lat}&lon=${this.lon}&appid=${this.apikey}&lang=pl&units=metric`)
      .then(res=>res.json())
      .then(data=>data)
    }
    AddNewForecastCard(forecast,min,time){
      //dodawanie nowej karty forecast
      return `<div class="forecast-container">
      <div class="forecast-item-container">
        <div class="week-day">${this.weekdays[time.getDay()]}</div>
        <div class="month-day">${this.AddZeroTime(time.getDate())}.${this.AddZeroTime(time.getMonth())}</div>
      </div>
      <div class="forecast-icon">
        <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@4x.png">
      </div>
      <div class="forecast-weather">${forecast.weather[0].description}</div>
        <div class="forecast-item-container">
            <div class="forecast-item-maxtemp">${Math.round(forecast.main.temp)}°C</div>
            <div class="forecast-item-mintemp">${Math.round(min)}°C</div>
        </div>
      </div>`;
    }
    async insertForecastData(){
      const data=await this.forecastFetch();
      let i=0;
      let currentTimestamp=(new Date());
      let newDate = new Date(currentTimestamp)
      console.log(data)
      const groupByDate=this.groupDataByDate(data);
      if(Object.keys(groupByDate)[0]!=(currentTimestamp).getDate()){
          newDate.setHours(newDate.getHours() + 24);
         currentTimestamp = newDate.getTime();}
      main.innerHTML=`<section id="forecast-window"></section>`;
      let temp1=document.querySelector("#forecast-window");
      for (const array in groupByDate){
        let temps=[]
        for (const row of groupByDate[(new Date (currentTimestamp)).getDate()]){
          
          
          temps.push(row.main.temp);
          }
          
          let mxtemp=Math.max(...temps)
          let mntemp=Math.min(...temps)
          let indexofmaxtemp=temps.indexOf(mxtemp)
          
          temp1.innerHTML+=this.AddNewForecastCard(groupByDate[(new Date (currentTimestamp)).getDate()][indexofmaxtemp],mntemp,(new Date(currentTimestamp)))
          
          i++;
         
          //dodanie do currentDate 24 godzin
        
          newDate.setHours(newDate.getHours() + 24);
          currentTimestamp = newDate.getTime();
          
          
          
         
          temps=[];
          if(i>4)break ;
          
        }
      }
    chart=async()=>{
    const data=await this.forecastFetch();
    let datalist=data.list
    this.menuState=false;
    document.querySelector(".nav-aside").classList.remove("active");
    main.innerHTML=`<div class="chart-container"><canvas id="myChart"></canvas></div>`
    this.currentWindow=2;
    let temps=[];
    let labels=[];
    for(let i=0;i<=8;i++){
      const labeltime=new Date(datalist[i].dt_txt);
      temps.push(Math.round(datalist[i].main.temp))
      labels.push(`${this.AddZeroTime(labeltime.getHours())}:${this.AddZeroTime(labeltime.getMinutes())}`) 
    }
    

      const min=Math.min(...temps)-2;
      const max=Math.max(...temps)+2;
      var ctx = document.getElementById('myChart').getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: `Temperatura °C `,
            data: temps,
            fill: true,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.2,
          },
        ]
        },
        options: {
          plugins: {
            legend: {
                labels: {     
                    font: {
                        size: 20
                    }
                }
            }
          },
          scales: {
            y: {
              min:min,
                max: max,
              ticks: {
                stepSize:1,
                fontSize: 50
              }
            }
          },
        responsive: true,
        maintainAspectRatio: false,
        }
      })
    }
    
 
   }
  
    

const app=new WeatherApp();
window.onload=app.init();



// function nextChart(){
//   if(new Date(currentTimestamp).getDate()===w){
//     newDate.setHours(newDate.getHours() - 120);
//         currentTimestamp = newDate.getTime();
//   }
//   else{
//     newDate.setHours(newDate.getHours() + 24);
//     currentTimestamp = newDate.getTime();
//   }
    
//         drawChart();
// }
// document.querySelector("#next-chart").addEventListener("click",nextChart);
// function prevChart(){
//   if(new Date(currentTimestamp).getDate()===new Date().getDate()){
    
    
//     newDate.setHours(newDate.getHours() + 120);
//         currentTimestamp = newDate.getTime();
//   }
//   else{
 
//   newDate.setHours(newDate.getHours() - 24);
//         currentTimestamp = newDate.getTime();}
//         drawChart();
// }
// document.querySelector("#previous-chart").addEventListener("click",prevChart);
// chart=async()=>{
//   const data=await this.forecastFetch();
//   let datalist=data.list
//   main.innerHTML=`<div class="chart-container"><button id="previous-chart" class="chart-buttons fa fa-arrow-left fa-soild"></button><canvas id="myChart"></canvas><button id="next-chart" class="chart-buttons fa fa-arrow-right fa-soild"></button></div>`
//   this.currentWindow=2;
//   let labels=["00:00","03:00","06:00","09:00","12:00","15:00","18:00","21:00"];
//   let currentTimestamp=(new Date());
//   let newDate = new Date(currentTimestamp);
  
//   if(Object.keys(groupByData)[0]!=(currentTimestamp).getDate()){
//     newDate.setHours(newDate.getHours() + 24);
//   }
//   function drawChart(){
    
//     if (Chart.getChart('myChart')) {
//       Chart.getChart('myChart').destroy();
//     }
//     let temps=[]
    
    
//   let q=(new Date(groupByData[new Date(currentTimestamp).getDate()][0].dt_txt)).getHours()
//   let shiftamount=(labels.indexOf(`${app.AddZeroTime(q)}:00`))
//     for(let i=0;i<shiftamount;i++){
//       temps.push(null)
//     }
//     groupByData[new Date(currentTimestamp).getDate()].forEach((el)=>{
//       temps.push(Math.round(el.main.temp))
//     })
//     const min=Math.min(...temps)-2;
//     const max=Math.max(...temps)+2;
//     var ctx = document.getElementById('myChart').getContext('2d');
//     var myChart = new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: labels,
//         datasets: [{
//           label: `${groupByData[new Date(currentTimestamp).getDate()][0].dt_txt} °C `,
//           data: temps,
//           fill: true,
//           borderColor: 'rgb(255, 99, 132)',
//           tension: 0.2,
//         },
//       ]
//       },
//       options: {
//         plugins: {
//           legend: {
//               labels: {     
//                   font: {
//                       size: 20
//                   }
//               }
//           }
//         },
//         scales: {
//           y: {
//             min:min,
//               max: max,
//             ticks: {
//               stepSize:1,
//               fontSize: 50
//             }
//           }
//         },
//       responsive: true,
//       maintainAspectRatio: false,
//       }
//     })
//   }
//   drawChart();
  

//  }

  