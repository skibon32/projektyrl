
const main=document.querySelector("#main-window");
class WeatherApp{
    weekdays=["Nie","Pon",'Wto',"Śro","Czw","Pią","Sob"];
    cityInput=document.querySelector("#city-input");
    menuState=false;
    
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
        })
        document.querySelector("#weather-now").addEventListener("click",this.showCurrentWeather);
        document.querySelector("#weather-weakly").addEventListener("click",this.showWeaklyWeather);
        document.querySelector("#weather-chart").addEventListener("click",this.chart);
        document.querySelector("#nav-button").addEventListener("click",()=>{
            this.menuState=!this.menuState;
            this.menuState? document.querySelector(".nav-aside").classList.add("active"):document.querySelector(".nav-aside").classList.remove("active");
            
        })
        document.querySelector("#nav-refresh").addEventListener("click",this.refresh);
        document.querySelector("#nav-local-gps").addEventListener("click",async()=>{
            await this.getDataFromGPS();
            this.refresh();
        })
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
    async getDataByLocation(){
        let place=this.cityInput.value;
        if(place=="") return;
        return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=5&appid=${this.apikey}`)
          
        .then(
          res=>{
            if(res.ok)return res.json()
        })
        .then(data=>{
            console.log(data)
            this.lon=data[1].lon;
            this.lat=data[1].lat;
            data[1]?.local_names?.pl ?this.cityName=data[1].local_names.pl:this.cityName=data[1].name;
            this.refresh();
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
          },
          (error) => {
            reject(error,"elo");
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
        //przypisanie wartości do preception rain lub snow jeżeli api zwróci wartość
        if(data.hasOwnProperty('rain'))precipitation=data.rain["1h"];
        else if(data.hasOwnProperty('snow'))precipitation=data.snow["1h"];
        else precipitation=0;

        let timeNow=new Date();
        let sunUP=new Date(data.sys.sunrise*1000);
        let sunDOWN=new Date(data.sys.sunset*1000);
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
        
    }
    showWeaklyWeather=()=>{
      this.insertForecastData(); 
      this.currentWindow=1;

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
        <div class="forecast-item-container">
          <div class="forecast-sunrise></div>
          <div class="forecast-sunset></div>
        </div>
      </div>`;
    }
    async insertForecastData(){
      const data=await this.forecastFetch();
      let i=0;
      let currentTimestamp=(new Date());
      let newDate = new Date(currentTimestamp)
      
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
    const groupByData= await this.groupDataByDate(data);
    main.innerHTML=`<div class="chart-container"><canvas id="myChart"></canvas></div>`
    let temp3=[]
    let labels=["00:00","03:00","06:00","09:00","12:00","15:00","18:00","21:00"]
    console.log(groupByData)
    let q=(new Date(groupByData[10][0].dt_txt)).getHours()
    let shiftamount=(labels.indexOf(`${this.AddZeroTime(q)}:00`))
    for(let i=0;i<shiftamount;i++){
      temp3.push(null)
    }
    groupByData[10].forEach((el,index)=>{
      temp3.push(Math.round(el.main.temp))
    })
    var ctx = document.getElementById('myChart').getContext('2d');
		var myChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [{
					label: "Temperatura",
					data: temp3,
					fill: true,
					borderColor: 'rgb(255, 99, 132)',
					tension: 0.7,
          legend:{
            legendItems:{
              fontColor:"rgb(255,255,255)"
            }
          }
          
				}]
			},
			options: {
        plugins: {
          legend: {
              labels: {
                  // This more specific font property overrides the global property
                  font: {
                      size: 20
                  }
              }
          }
      },
      responsive: true,
      
      }
		});console.log(myChart)
   }
    
    
};
const app=new WeatherApp();
window.onload=app.init();

// var ctx = document.getElementById('myChart').getContext('2d');
// var myChart = new Chart(ctx, {
//   type: 'line',
//   data: {
//     labels: labels,
//     datasets: [{
//       label: 'Wykres temperatury',
//       data: temp3,
//       fill: true,
//       borderColor: 'rgb(255, 99, 132)',
//       tension: 0.1
//     }]
//   },
//   options: {}
// }); 