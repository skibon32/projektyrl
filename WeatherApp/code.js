const main=document.querySelector("#main-window");
class WeatherApp{
    weekdays=["Nie","Pon",'Wto',"Śro","Czw","Pią","Sob"];
    cityInput=document.querySelector("#city-input");
    menuState=false;
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
        document.querySelector("#nav-button").addEventListener("click",()=>{
            this.menuState=!this.menuState;
            this.menuState? document.querySelector(".nav-aside").classList.add("active"):document.querySelector(".nav-aside").classList.remove("active");
            
        })
    }
    getDataByLocation(){
        let place=this.cityInput.value;
        if(place=="") return;
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=5&appid=${this.apikey}`)
        .then(res=>{
            return res.json()
        })
        .then(data=>{
            console.log(data)
            this.lon=data[1].lon;
            this.lat=data[1].lat;
            data[1].hasOwnProperty("local_names.pl")?this.cityName=data[1].local_names.pl:this.cityName=data.name;

        })
        
    }
    AddZeroTime(time){
      if(time<10)return "0"+time
      return time
    }
    getDataFromGPS(){
        navigator.geolocation.getCurrentPosition((pos)=>{
            this.lon=pos.coords.longitude;
            this.lat=pos.coords.latitude;
            this.cityName=undefined;
        });
    }
    fetchDataByCoords(){
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&appid=${this.apikey}&units=metric&lang=pl`)
        .then(response=>response.json())
        .then(data=>{this.insertData(data)})
    }
    insertData(data){
        let precipitation;
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
        this.fetchDataByCoords();
    }
    showWeaklyWeather=()=>{
      this.forecastFetch(); 

    }
    forecastFetch(){
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${this.lat}&lon=${this.lon}&appid=${this.apikey}&lang=pl&units=metric`)
      .then(res=>res.json())
      .then(data=>{this.insertForecastData(data)
        console.log(data)})
    }
    AddNewForecastCard(forecast,min,time){
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
    insertForecastData(data){
      
      let i=0;
      let currentTimestamp=(new Date());
      const groupByDate=data.list.reduce((group,item)=>{
        let date=new Date(item.dt*1000);
        if(group[date.getDate()]==null)group[date.getDate()]=[]
        group[date.getDate()].push(item);
        return group
      },{})
      
      console.log(groupByDate)
      main.innerHTML=`<section id="forecast-window"></section>`;
      let temp1=document.querySelector("#forecast-window");
      for (const array in groupByDate){
        let temps=[]
        for (const row of groupByDate[(new Date(currentTimestamp)).getDate()]){
          
          temps.push(row.main.temp);
          }
          
          let mxtemp=Math.max(...temps)
          let mntemp=Math.min(...temps)
          let indexofmaxtemp=temps.indexOf(mxtemp)
          
          temp1.innerHTML+=this.AddNewForecastCard(groupByDate[(new Date(currentTimestamp)).getDate()][indexofmaxtemp],mntemp,(new Date(currentTimestamp)))
          
          i++
         
          //dodanie do currentDate 24 godzin
          let newDate = new Date(currentTimestamp);
          newDate.setHours(newDate.getHours() + 24);
          currentTimestamp = newDate.getTime();
          
          
          
         
          temps=[];
          if(i>4)break ;
          
        }
      }
      
    
    
};
const app=new WeatherApp();
window.onload=app.init();
