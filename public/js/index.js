// require("dotenv").config();
// date update
const updatetime = () => {
  const daylist = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const date = new Date();
  const day = date.getDay();
  const curdate = date.getDate();
  const time = date.toLocaleTimeString();
  $(".date_time").text(`${daylist[day]} | ${curdate} || ${time}`);
};
updatetime();

// update search btn
const condition = (val) => {
  const img = document.getElementsByClassName("img")[0];
  const condn = val.toLowerCase();
  if (condn == "clouds") {
    img.innerHTML = `<i class="fa-solid fa-cloud fa-beat img" style="color: #f2f2f2;"></i>`;
  } else if (condn == "haze") {
    img.innerHTML = `<i class="fa-solid fa-smog fa-beat img" style="color: #f2f2f2;"></i>`;
  } else if (condn == "clear") {
    img.innerHTML = `<i class="fa-solid fa-sun fa-beat" style="color: #fff82e;"></i>`;
  } else if (condn == "rain") {
    img.innerHTML = `<i class="fa-solid fa-cloud-showers-heavy  fa-beat img" style="color: #f2f2f2;"></i>`;
  }
};

const fetchdata = async (city) => {
  console.log(city);
  if (city === "") {
    beforeRender();
  } else {
    try {
      const apikey = "1ab95fb1f19a951b062345531da0a021";
      console.log(apikey);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;
      const data = await fetch(url);
      const jsondata = await data.json();
      // console.log(jsondata);
      const { name } = jsondata;
      const { country } = jsondata.sys;
      const { humidity, temp, temp_max, temp_min } = jsondata.main;
      const { speed } = jsondata.wind;
      const { main } = jsondata.weather[0];
      // console.log(name, country, humidity, temp, temp_max, temp_min, speed, main, id)
      document.getElementsByClassName(
        "country"
      )[0].innerHTML = `${name}, ${country}`;
      document.getElementsByClassName("others")[0].style.opacity = `1`;
      document.getElementsByClassName("weth_con")[0].innerHTML = `${main}`;
      document.getElementsByClassName("temp")[0].innerHTML = `${temp}`;
      document.getElementsByClassName("temp_min")[0].innerHTML = `${temp_min}`;
      document.getElementsByClassName("temp_max")[0].innerHTML = `${temp_max}`;
      document.getElementsByClassName("humidity")[0].innerHTML = `${humidity}`;
      document.getElementsByClassName("speed")[0].innerHTML = `${speed}`;
      condition(main);
    } catch (error) {
      document.getElementsByClassName(
        "country"
      )[0].innerHTML = `Please enter the correct city name`;
    }
  }
};
const beforeRender = () => {
  document.getElementsByClassName(
    "country"
  )[0].innerHTML = `Please write any city name`;
  document.getElementsByClassName("others")[0].style.opacity = `0`;
};
beforeRender();
$(".submit").click((e) => {
  const inputval = document.getElementsByClassName("input_search")[0].value;
  fetchdata(inputval);
  document.getElementsByClassName("input_search")[0].value = "";
});

// login logout button render
// const logout = document.getElementsByClassName("logout")[0];
// const login = document.getElementsByClassName("login")[0];
// logout.addEventListener("click", () => {
//   if (login.style.display == "flex") {
//     logout.style.display = 'flex';
//     login.style.display = 'none'; 
//   }
//   else {
//     logout.style.display = "none";
//     login.style.display = "flex"; 
//   }
// })