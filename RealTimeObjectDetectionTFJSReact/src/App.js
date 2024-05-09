// Import dependencies
import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./utilities";
import { RotatingText } from 'react-simple-rotating-text'
import GaugeChart from 'react-gauge-chart'
import 'bootstrap/dist/css/bootstrap.css';
//import Battery from "./battery";
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import BatteryLevel from "react-battery-level";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [lyrics, setLyrics] = useState([]);
  const [temp, setTemp] = useState(0);
  const [desc, setDesc] = useState('');
  const [curTime, setCurTime] = useState('');
  const [gauge, setGauge] = useState(75);
  const [tab, setTab] = useState('dash');

  // Main function
  const runCoco = async () => {
    const net = await cocossd.load();
    console.log("Handpose model loaded.");
    detect(net);
    //  Loop and detect hands
    setInterval(() => {
        detect(net);
    }, 100000);
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
    setCurTime(currentTime);
    return currentTime;
  }

  const apiKey = 'a60d4cefb0fcd639bbd65c4634345128';
  const baseUrl = "http://api.openweathermap.org/data/2.5/weather";

  async function playSong(songUrl) {
    var audioPlayer = document.getElementById('audio-player');
    audioPlayer.src = songUrl;
    audioPlayer.play();
  }

  function changeTab(tab) {
    setTab(tab)
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
    currTime();
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

      // fetch(url)
      //   .then(response => {
      //     if (!response.ok) {
      //       throw new Error('Network response was not ok');
      //     }
      //     return response.json();
      //   })
      //   .then(wet => {
      //     // Handle weather data
      //     if (obj !== undefined) {
      //       obj.forEach(a => {
      //         console.log(a.class)
      //         // console.log(song)
      //         console.log(wet)
      //         console.log(wet.main)
      //         console.log(wet.weather)
      //         setTemp(wet.main.temp)
      //         setDesc(wet.weather[0].description)
      //         song1 = song.replace('###', a.class)
      //       });
      //     }
      //     let newsong = song1.replace("######", wet.main.temp)
      //     song2 = newsong.replace("##", wet.weather[0].description)
      //     console.log(song2)
      //     console.log(wet.weather[0].description)
      //     console.log(wet.main.temp)
      //     console.log(wet.wind.speed)

      //     // let music_url = 'https://cdn1.suno.ai/3dbcf449-16e3-4bc2-915e-321645aec475.mp3'
      //     // playSong(music_url);

      //     fetch('https://suno-api-pdm-v1.vercel.app/api/custom_generate', {
      //       method: 'POST',
      //       mode: 'cors',
      //       headers: {
      //         'Content-Type': 'application/json'
      //       },
      //       body: JSON.stringify({
      //         "prompt": song2,
      //         "make_instrumental": false,
      //         "wait_audio": false,
      //         "tags": 'Music',
      //         "title": 'College Road Songs'
      //       })
      //     })
      //       .then(response => {
      //         if (!response.ok) {
      //           throw new Error('Network response was not ok');
      //         }
      //         return response.json();
      //       })
      //       .then(data => {
      //         const info = data[0].id
      //         console.log(info);
      //         console.log(data);

      //         fetch('https://suno-api-pdm-v1.vercel.app/api/get?id=' + data[0].id, {
      //           method: 'GET',
      //           headers: {
      //             'Content-Type': 'application/json'
      //           }
      //         })
      //           .then(response => {
      //             if (!response.ok) {
      //               throw new Error('Network response was not ok');
      //             }
      //             return response.json();
      //           })
      //           .then(song => {
      //             const music = song.filter(m => m.status === 'complete')[0];
      //             console.log(music)
      //             setLyrics(splitIntoThreeEqualParts(music.lyric))
      //             const music_url = music.audio_url;
      //             console.log(music_url)
      //             // hideLoader();
      //             playSong(music_url);
      //             delay(1000).then(() => {
      //               console.log("After 10 seconds");
      //               // Call the function to split the sentence here if needed
      //             });
      //           })
      //           .catch(error => {
      //             console.error('There was a problem with your fetch operation:', error);
      //           });
      //       })
      //       .catch(error => {
      //         console.error('There was a problem with your fetch operation:', error);
      //       });
      //   })
      //   .catch(error => {
      //     console.error('Error:', error);
      //   });

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx);
    }
  };

  useEffect(() => { runCoco() }, []);

  return (
    <div className="App" style={{ backgroundImage: "linear-gradient(to right, #141E30, #243B55)" }}>
      {(tab === 'dash') ?
        <div className="border">
          <div className="col-sm-12">
            <div className="row">
              <div className="col-sm-3">
                <label></label>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-3">
                <label></label>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-3">
                <label></label>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-3">
                <label></label>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-3">
              </div>
              <div className="col-sm-9">
              </div>
            </div>
            <div className="row">
              <div className="col-sm-3" style={{ textAlign: "center" }}>
                <BatteryLevel
                  width="6vw"
                  gauge={gauge}
                  gaugeColor={gauge <= 20 ? "#FF5713" : "#6EF47A"}
                  isCharging={false}
                  isShowGaugePercentage={false}
                  lightningBoltStyles={{
                    fill: gauge <= 20 ? "#FF5713" : "#6EF47A",
                    stroke: "white",
                    strokeWidth: 0.5,
                  }}
                />
              </div>
              <div className="col-sm-6">

              </div>

              <div className="col-sm-3" style={{ color: "yellow", textAlign: "left" }}>
                <h1>{curTime}</h1>
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
                    arcsLength={[0.2, 0.2, 0.2, 0.2, 0.2]}
                    colors={['#40E0D0', '#4682B4', '#082567', '#50C878', '#F5CD19', '#EA4228']}
                    percent={0.10}
                    arcPadding={0.02}
                  />
                  <label style={{ color: "yellow", textAlign: "left" }}><h2>RPM</h2></label>
                </div>
                <div className="col-sm-4">
                  <GaugeChart id="gauge-chart6"
                    nrOfLevels={420}
                    height={"500px"}
                    hideText={"True"}
                    arcsLength={[0.3, 0.5, 0.2]}
                    colors={['#5BE12C', '#F5CD19', '#EA4228']}
                    percent={0.70}
                    arcPadding={0.02}
                  />
                  <label style={{ color: "yellow", textAlign: "left" }}><h2>Engine</h2></label>
                </div>
                <div className="col-sm-2 align-middle">
                  {/*
                  Idar tumara button dalo
                  */}   
                  <div className="button-container">
                  <AwesomeButton type="primary" onPress={() => {
                    changeTab("music")
                  }}>Music</AwesomeButton>
                  <AwesomeButton type="primary" onPress={() => {
                    changeTab("camera")
                  }}>Camera</AwesomeButton>  
                  </div> 
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
                    percent={0.25}
                    arcPadding={0.02}
                  />
                  <label style={{ color: "yellow", textAlign: "left" }}><h2>KM/H</h2></label>
                </div>
                <div className="col-sm-2 align-middle">
                </div>
              </div>

              <div className="row">
                <div className="col-sm-3">
                  <label></label>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3">
                  <label></label>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3">
                  <label></label>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3">
                  <label></label>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3">
                  <label></label>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-4">
                  <label></label>
                </div>
                {/* <div className="col-sm-1">
                  <AwesomeButton type="primary" onPress={() => {
                    changeTab("music")
                  }}>Music</AwesomeButton>
                </div>
                <div className="col-sm-2">
                </div>
                <div className="col-sm-1">
                  <AwesomeButton type="primary" onPress={() => {
                    changeTab("camera")
                  }}>Camera</AwesomeButton>
                </div> */}
                <div className="col-sm-4">
                  <label></label>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3">
                  <label></label>
                </div>
              </div>
            </div>
          </div>
        </div>
        : ''}
      {(tab === 'camera') ?
        <div>
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
            <div id="shimmerWave" style={{ zIndex: 2, paddingRight: "50%", paddingTop: "70%" }}>
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
                width: "80%",
                height: "80%",
              }}
            />

          </header>
          <div className="row">
            <div className="col-sm-4">
              <label></label>
            </div>
            <div className="col-sm-1">
              <AwesomeButton type="primary" onPress={() => {
                changeTab("music")
              }}>Music</AwesomeButton>
            </div>
            <div className="col-sm-2">
            </div>
            <div className="col-sm-1">
              <AwesomeButton type="primary" onPress={() => {
                changeTab("dash")
              }}>Dash</AwesomeButton>
            </div>
            <div className="col-sm-4">
              <label></label>
            </div>
          </div>
          <audio id="audio-player" controls style={{ display: 'none' }}></audio>
        </div> : ''}
      {(tab === 'music') ?
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style={{maxWidth:"40%", maxHeight:"40%" }}><path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z" /></svg>
          <div className="row">
            <div className="col-sm-4">
              <label></label>
            </div>
            <div className="col-sm-1">
              <AwesomeButton type="primary" onPress={() => {
                changeTab("dash")
              }}>Dash</AwesomeButton>
            </div>
            <div className="col-sm-2">
            </div>
            <div className="col-sm-1">
              <AwesomeButton type="primary" onPress={() => {
                changeTab("camera")
              }}>Camera</AwesomeButton>
            </div>
            <div className="col-sm-4">
              <label></label>
            </div>
          </div>          
          <audio id="audio-player" controls style={{ display: 'none' }}></audio>
        </div> : ''}

    </div>
  );
}

export default App;
