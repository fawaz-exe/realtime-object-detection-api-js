// Import dependencies
import React, { useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Main function
  const runCoco = async () => {
    const net = await cocossd.load();
    console.log("Handpose model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10000);
  };

  const apiKey = 'a60d4cefb0fcd639bbd65c4634345128';
  const baseUrl = "http://api.openweathermap.org/data/2.5/weather";

  async function playSong(songUrl) {
    var audioPlayer = document.getElementById('audio-player');
    audioPlayer.src = songUrl;
    audioPlayer.play();
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

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(wet => {
          // Handle weather data
          if (obj !== undefined) {
            obj.forEach(a => {
              console.log(a.class)
              // console.log(song)
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

          fetch('https://suno-api-pdm-v1.vercel.app/api/custom_generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              // "prompt": "A popular heavy metal song about war, sung by a deep-voiced male singer, slowly and melodiously.The lyrics depict the sorrow of people after the war.",
              "prompt": song2,
              "make_instrumental": false,
              "wait_audio": false,
              "tags": 'Music',
              "title": 'College Road Songs'
            })
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
              const info = data[0].id
              console.log(info);
              console.log(data);

              fetch('https://suno-api-pdm-v1.vercel.app/api/get?id=' + data[0].id, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json'
                }
              })
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                  return response.json();
                })
                .then(song => {
                  const music_url = song.filter(m => m.status === 'complete')[0].audio_url;
                  console.log(music_url)
                  // hideLoader();
                  playSong(music_url);
                })
                .catch(error => {
                  console.error('There was a problem with your fetch operation:', error);
                });

            })
            .catch(error => {
              console.error('There was a problem with your fetch operation:', error);
            });
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
    <div className="App">
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
            width: 640,
            height: 480,
          }}
        />

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
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
