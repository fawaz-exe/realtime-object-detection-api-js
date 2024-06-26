// Import dependencies
import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./pages/styles/App.css";
import { drawRect } from "./utilities";
import { RotatingText } from 'react-simple-rotating-text'
import GaugeChart from 'react-gauge-chart'
import 'bootstrap/dist/css/bootstrap.css';
//import Battery from "./battery";
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [lyrics, setLyrics] = useState([]);
  const [temp, setTemp] = useState(0);
  const [desc, setDesc] = useState('');
  // Main function
  const runCoco = async () => {
    const net = await cocossd.load();
    console.log("Handpose model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10000);
  };

  const currTime = () => {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    var currentTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    return currentTime;
  }

  const apiKey = 'a60d4cefb0fcd639bbd65c4634345128';
  const baseUrl = "http://api.openweathermap.org/data/2.5/weather";

  async function playSong(songUrl) {
    var audioPlayer = document.getElementById('audio-player');
    audioPlayer.src = songUrl;
    audioPlayer.play();
  }

  const splitIntoThreeEqualParts = (sentence) => {
    const words = sentence.split(' ');
    const totalWords = words.length;

    // Calculate the number of words in each part
    const wordsPerPart = Math.ceil(totalWords / 3);

    // Split the sentence into three parts
    const part1 = words.slice(0, wordsPerPart).join(' ');
    const part2 = words.slice(wordsPerPart, 2 * wordsPerPart).join(' ');
    const part3 = words.slice(2 * wordsPerPart).join(' ');

    return [part1, part2, part3];
  }

  function delay(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }


  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const obj = await net.detect(video);

      const songs = [
        " On college streets, there are ### for whom dreams ignite, In wind speed #####, sky color ## and temperature ###### students write their might",
        " Through foggy lanes,  ###  stride with grace, On college streets with wind speed ##### sky color ## and temperature ######  each one finds their place",
        " In winter's chill, ###   with books in hand, On campus paths, sky color ## and temperature ######  diverse souls expand",
        " Beneath the summer sun, ###  friendships bloom, On bustling streets with sky color ## and temperature ###### , laughter fills the room",
        "Through autumn's leaves, ###   stroll and muse, On college roads sky color ## and temperature ###### , ideas they infuse",
        "In springtime showers, umbrellas bloom, On bustling streets sky color ## and temperature ###### , minds break the gloom",
        " Amidst the snowflakes, ###  diverse crowds convene,On campus streets sky color ## and temperature ###### , a vibrant scene",
        "In golden light of dawn, ###   early risers tread, On college streets sky color ## and temperature ###### , where ambitions spread",
        "Through thunderstorms, with lightning's flash, ###   On campus roads sky color ## and temperature ###### , passions clash and clash",
        "In twilight's glow, ###  the night owls roam, On bustling streets sky color ## and temperature ###### , each finds their home.",
      ]

      const num = Math.floor(Math.random() * 10);
      let song = songs[num]
      let song1;
      let song2;

      const url = `${baseUrl}?q=secunderabad&appid=${apiKey}&units=metric`;

      fetch()
        // .then(response => {
        //   if (!response.ok) {
        //     throw new Error('Network response was not ok');
        //   }
        //   return response.json();
        // })
        .then(wet => {
          // Handle weather data
          if (obj !== undefined) {
            obj.forEach(a => {
              console.log(a.class)
              // console.log(song)
              setTemp(wet.main.temp)
              setDesc(wet.weather[0].description)
              song1 = song.replace('###', a.class)
            });
          }
          console.log(wet)
          let newsong = song1.replace("######", wet.main.temp)
          song2 = newsong.replace("##", wet.weather[0].description)
          console.log(song2)
          console.log(wet.weather[0].description)
          console.log(wet.main.temp)
          console.log(wet.wind.speed)

          // let music_url = 'https://cdn1.suno.ai/3dbcf449-16e3-4bc2-915e-321645aec475.mp3'
          // playSong(music_url);

          // fetch('https://suno-api-pdm-v1.vercel.app/api/custom_generate', {
          //   method: 'POST',
          //   mode: 'cors',
          //   headers: {
          //     'Content-Type': 'application/json'
          //   },
          //   body: JSON.stringify({
          //     "prompt": song2,
          //     "make_instrumental": false,
          //     "wait_audio": false,
          //     "tags": 'Music',
          //     "title": 'College Road Songs'
          //   })
          // })
          //   .then(response => {
          //     if (!response.ok) {
          //       throw new Error('Network response was not ok');
          //     }
          //     return response.json();
          //   })
          //   .then(data => {
          //     const info = data[0].id
          //     console.log(info);
          //     console.log(data);

          //     fetch('https://suno-api-pdm-v1.vercel.app/api/get?id=' + data[0].id, {
          //       method: 'GET',
          //       headers: {
          //         'Content-Type': 'application/json'
          //       }
          //     })
          //       .then(response => {
          //         if (!response.ok) {
          //           throw new Error('Network response was not ok');
          //         }
          //         return response.json();
          //       })
          //       .then(song => {
          //         const music = song.filter(m => m.status === 'complete')[0];
          //         console.log(music)
          //         setLyrics(splitIntoThreeEqualParts(music.lyric))
          //         const music_url = music.audio_url;
          //         console.log(music_url)
          //         // hideLoader();
          //         playSong(music_url);
          //         delay(1000).then(() => {
          //           console.log("After 10 seconds");
          //           // Call the function to split the sentence here if needed
          //         });
          //       })
          //       .catch(error => {
          //         console.error('There was a problem with your fetch operation:', error);
          //       });
          //   })
          //   .catch(error => {
          //     console.error('There was a problem with your fetch operation:', error);
          //   });
        })
        .catch(error => {
          console.error('Error:', error);
        });

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx);
    }
  };

  useEffect(() => { runCoco() }, []);

  return (
    <div className="App" style={{ backgroundImage: "linear-gradient(to right, #141E30, #243B55)" }}>
      <div className="border">
        <div className="row">
          <div className="col-sm-9">
          </div>
        </div>
        <div className="row">
          <div className="col-sm-3">
            <span className="align-middle">
              <AwesomeButton type="primary">Camera</AwesomeButton>
            </span>
          </div>
          <div className="col-sm-3">
          </div>
          <div className="col-sm-3">
            <span className="align-middle">
              <AwesomeButton type="primary">Music</AwesomeButton>
            </span>
          </div> 
          <div className="col-sm-3" style={{ color: "yellow", textAlign: "left" }}>
            <h1>{currTime()}</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-9">
          </div>
          <div className="col-sm-3" style={{ color: "yellow", textAlign: "left" }}>
            {/* <h2>{temp} C</h2> */}
            <h2>32.79 C</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-9">
          </div>
          <div className="col-sm-3" style={{ color: "yellow", textAlign: "left" }}>
            {/* <h2>{desc}</h2> */}
            <h2>scattered clouds</h2>
          </div>
        </div>
        <div className="container" >
          <div className="row">
            <div className="col-sm-2">
            </div>
            <div className="col-sm-4">
              <GaugeChart id="gauge-chart6"
                nrOfLevels={420}
                height={"500px"}
                hideText={"True"}
                arcsLength={[0.3, 0.5, 0.2]}
                colors={['#5BE12C', '#F5CD19', '#EA4228']}
                percent={0.37}
                arcPadding={0.02}
              />
            </div>
            <div className="col-sm-4">
              <GaugeChart id="gauge-chart6"
                nrOfLevels={420}
                height={"500px"}
                hideText={"True"}
                arcsLength={[0.3, 0.5, 0.2]}
                colors={['#5BE12C', '#F5CD19', '#EA4228']}
                percent={0.37}
                arcPadding={0.02}
              />
            </div>
            <div className="col-sm-2 align-middle">
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2">
            </div>
            <div className="col-sm-8">
              <GaugeChart id="gauge-chart6"
                nrOfLevels={420}
                height={"500px"}
                hideText={"True"}
                arcsLength={[0.3, 0.5, 0.2]}
                colors={['#5BE12C', '#F5CD19', '#EA4228']}
                percent={0.37}
                arcPadding={0.02}
              />
            </div>
            <div className="col-sm-2 align-middle">
            </div>
          </div>
        </div>

      </div>
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: "100%",
            height: "100%",
          }}
        />
        <div id="shimmerWave" style={{ zIndex: 2, paddingRight: "50%" }}>
          <RotatingText texts={lyrics} />
        </div>
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: "100%",
            height: "100%",
          }}
        />
      </header>
      <audio id="audio-player" controls style={{ display: 'none' }}></audio>
    </div>
  );
}

export default App;
