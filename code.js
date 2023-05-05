

class App{

lat=undefined;
lon=undefined;
cityName=undefined;
apikey="b5c81a9405bb5f44fd5ce751e9b339e6";
    getDataFromGPS(){
        navigator.geolocation.getCurrentPosition((pos)=>{
              this.lon=pos.coords.longitude;
              this.lat=pos.coords.latitude;
              this.cityName=undefined;
          });
      }
     async fetchDataByCoords(){
        return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&appid=${this.apikey}&units=metric&lang=pl`)
        .then(response=>response.json())
        
        
    }
      
    async showData (){
        const t1=performance.now()
        const data= await this.fetchDataByCoords();
        console.log(data)
        const t2=performance.now()
        console.log(`${t2-t1}`)
    }
}
const app=new App()
window.onload=app.getDataFromGPS();

// async fetchDataByCoords(){
//     const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&appid=${this.apikey}&units=metric&lang=pl`)
//     const data=await response.json();
    
//     return data
//       }
    
//     async showData (){
//         const data=await this.fetchDataByCoords();
//         console.log(data)
//     }

