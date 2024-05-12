"use client";

import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { useKeyPress } from '../hooks/useKeyPress';

const VideoPlayer = ({ url }) => {
  const playerRef = useRef(null);
  const [showControls, setShowControls] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [videos] = useState(["/RST.mp4", "BSMS.mp4", "/HCW.mp4", "/KGP.mp4", "/POH.mp3", "/AudioBook.mp3"]);

  const spacePress = useKeyPress(' ');
  const arrowUpPress = useKeyPress('ArrowUp');
  const arrowDownPress = useKeyPress('ArrowDown');
  const arrowRightPress = useKeyPress('ArrowRight');
  const arrowLeftPress = useKeyPress('ArrowLeft');
  const mPress = useKeyPress('m');
  const fPress = useKeyPress('f');
  const wPress = useKeyPress('w');
  const nPress = useKeyPress('n');
  const pPress = useKeyPress('p');
  const escPress = useKeyPress('Escape');

  const handleForward = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
    }
  };

  const handleBackward = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
    }
  };

  const showControlsWithTimeout = () => {
    setShowControls(true);
    setTimeout(() => {
      setShowControls(false);
    }, 3000); // Hide controls after 5 seconds
  };

  const toggleMinimized = () => {
    setMinimized(!minimized);
  };

  const playNextVideo = () => {
    setVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const playPreviousVideo = () => {
    setVideoIndex(
      (prevIndex) => (prevIndex - 1 + videos.length) % videos.length
    );
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleProgress = (progress) => {
    setPlayedSeconds(progress.playedSeconds);
    setDuration(progress.loadedSeconds);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  // const handleSeek = (e) => {
  //   const percent = parseFloat(e.target.value);
  // const newPosition = duration * percent;
  // setPlayedSeconds(newPosition);
  // // Use seekTo method of ReactPlayer to seek to the new position
  // playerRef.current.seekTo(newPosition);
  // };

  const handleFullScreen = () => {
    setIsFullScreen(true);
    if (!isFullScreen) {
      playerRef.current.wrapper.requestFullscreen();
      setIsFullScreen(false);
    }
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    isMuted?setVolume(0):setVolume(0.5);
  };

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4];

  useEffect(() => {
    if (!playerRef.current) return;

    if (spacePress) {
      togglePlay();
    }

    if (arrowUpPress) {
      setVolume((prevVol)=>Math.min(prevVol + 0.05, 1));
      setIsMuted(false);
    }

    if (arrowDownPress) {
      setVolume((prevVol) => Math.max(prevVol - 0.05, 0));
      setIsMuted(false);
    }

    if (arrowRightPress) {
      handleForward();
    }

    if (arrowLeftPress) {
      handleBackward();
    }

    if (mPress) {
      toggleMute();
    }

    if (fPress) {
      handleFullScreen();
    }

    if (wPress) {
      toggleMinimized();
    }

    if (nPress) {
      playNextVideo();
    }

    if (pPress) {
      playPreviousVideo();
    }

    if (escPress) {
      if (playerRef.current && playerRef.current.isFullscreen) {
        toggleFullscreen();
      }
    }

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          setVolume(Math.min(volume + 0.05, 1));
          setIsMuted(false);
          break;
        case 'ArrowDown':
          setVolume(Math.max(volume - 0.05, 0));
          setIsMuted(false);
          break;
        case 'ArrowRight':
          handleForward();
          break;
        case 'ArrowLeft':
          handleBackward();
          break;
        case ' ':
          togglePlay();
          break;
        case 'm':
        case 'M':
          toggleMute();
          break;
        case 'f':
        case 'F':
          handleFullScreen();
          break;
        case 'w':
        case 'W':
          toggleMinimized();
          break;
        case 'n':
        case 'N':
          playNextVideo();
          break;
        case 'p':
        case 'P':
          playPreviousVideo();
          break;
        case 'Escape':
          if (playerRef.current && playerRef.current.isFullscreen) {
            toggleFullscreen();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // clearTimeout(hideControlsTimeout);
    };
  }, [volume, spacePress, arrowUpPress, arrowDownPress, arrowRightPress, arrowLeftPress, mPress, fPress, wPress, nPress, pPress, escPress]);

  return (
    <>
    <h1 className="font-bold text-3xl text-center m-2">Mutimedia Player</h1>
    <div
      className={`relative ${minimized ? "w-full h-full rounded-md fixed" : ""}`}
      onMouseLeave=  {() => isPlaying && setShowControls(false)}
      onMouseOver={()=>setShowControls(true)}
    >
      {minimized ? (
        <div className={`w-[300px] h-[169px] absolute top-[415px] right-0`}>
          <ReactPlayer
            ref={playerRef}
            url={videos[videoIndex]}
            controls={true}
            width="100%"
            height="100%"
            onPause={() => setShowControls(true)}
            playing={false}
            config={{
              file: {
                attributes: {
                  controlsList: "nodownload", // Disable default download button
                },
              },
            }}
          />
          <div className="absolute top-0 p-2 flex justify-between w-full">
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold p-2 rounded-full"
              onClick={toggleMinimized}
            >
              <svg class="h-8 w-8 text-black-500"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
</svg>
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold p-2 rounded-full ml-2"
              onClick={toggleMinimized}
            >
              <svg class="h-8 w-8 text-black-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        </div>
      ) : (
        <div>
        <ReactPlayer
        className="border"
          ref={playerRef}
          url={videos[videoIndex]}
          width="75%"
          height="75%"
          onPause={() => setShowControls(true)}
          onPlay={showControlsWithTimeout}
          playing={isPlaying}
          onProgress={handleProgress}
          volume={volume}
          playbackRate={playbackRate}
          config={{
            file: {
              attributes: {
                controlsList: "nodownload", // Disable default download button
              },
            },
          }}
        />
        {showControls && <div className={`absolute bottom-0 left-0 right-0 mb-4 ${videos[videoIndex].includes(".mp3")?`top-20`:""}`}>
            <div className="justify-between flex w-3/4 px-1">
              <span className="font-bold">{formatTime(playedSeconds)}</span>
              <span className="font-bold">{formatTime(duration)}</span>
            </div>
          <div className="w-50">
            <progress
              className="w-3/4"
              value={playedSeconds}
              max={duration}
              // onClick={handleSeek}
            ></progress>
          </div>
          <div className="bottom-0 left-0 right-0 flex mb-1 justify-center w-3/4 ">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold p-2 rounded-full">
          <svg class="h-8 w-8 text-black-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M15 8a5 5 0 0 1 0 8" />  <path d="M17.7 5a9 9 0 0 1 0 14" />  <path d="M6 15 h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" /></svg>
          </button>
          <input className="w-1/6" type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} />
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold p-2 rounded-full mr-4 ml-4"
              onClick={playPreviousVideo}
            >
              <svg class="h-8 w-8 text-black-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <polygon points="19 20 9 12 19 4 19 20" />  <line x1="5" y1="19" x2="5" y2="5" /></svg>

            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold p-2 rounded-full mr-4"
              onClick={handleBackward}
            >
              <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><g clip-rule="evenodd" fill="#1c274c" fill-rule="evenodd"><path d="m10.3249 7.82403c.2599.12489.4251.38767.4251.67598v6.99999c0 .4142-.3358.75-.75.75-.41419 0-.74997-.3358-.74997-.75v-5.4395l-1.28148 1.0252c-.32345.2587-.79542.2063-1.05417-.1172-.25876-.3234-.20632-.7954.11713-1.05414l2.5-2c.22512-.18011.53359-.21522.79339-.09033zm3.9251 1.42598c-.5523 0-1 .44771-1 .99999v3.5c0 .5523.4477 1 1 1s1-.4477 1-1v-3.5c0-.55228-.4477-.99999-1-.99999zm-2.5.99999c0-1.3807 1.1193-2.49999 2.5-2.49999s2.5 1.11929 2.5 2.49999v3.5c0 1.3807-1.1193 2.5-2.5 2.5s-2.5-1.1193-2.5-2.5z"/><path d="m11.324 1.67511c.1249-.25985.3877-.42511.676-.42511.7353 0 1.4541.07394 2.1492.21503 4.9071.99609 8.6008 5.33334 8.6008 10.53497 0 5.9371-4.8129 10.75-10.75 10.75-5.93706 0-10.75-4.8129-10.75-10.75 0-4.40935 2.65459-8.19702 6.44972-9.85518.37957-.16584.82171.00742.98754.38699.16584.37956-.00742.8217-.38698.98754-3.26849 1.42807-5.55028 4.68873-5.55028 8.48065 0 5.1086 4.14137 9.25 9.25 9.25 5.1086 0 9.25-4.1414 9.25-9.25 0-4.15047-2.7342-7.66378-6.5-8.83456v1.33456c0 .31852-.2012.60229-.5017.70772-.3006.10543-.635.00952-.834-.2392l-2-2.5c-.1801-.22513-.2152-.53356-.0903-.79341z"/></g></svg>
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold p-2 rounded-full mr-4"
              onClick={togglePlay}
            >
              {isPlaying ? 
              <svg class="h-8 w-8 text-black-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <rect x="6" y="4" width="4" height="16" />  <rect x="14" y="4" width="4" height="16" /></svg>
              :
              <svg class="h-8 w-8 text-black-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <polygon points="5 3 19 12 5 21 5 3" /></svg>}
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold p-2 rounded-full mr-4"
              onClick={handleForward}
            >
              <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><g stroke="#1c274c" stroke-linecap="round" stroke-width="1.5"><path d="m10 4.5 2-2.5c-5.52285 0-10 4.47715-10 10 0 5.5228 4.47715 10 10 10 5.5228 0 10-4.4772 10-10 0-4.10064-2.4682-7.6248-6-9.16791" stroke-linejoin="round"/><path d="m7.5 10.5 2.5-2v7" stroke-linejoin="round"/><path d="m12.5 13.75v-3.5c0-.9665.7835-1.75 1.75-1.75s1.75.7835 1.75 1.75v3.5c0 .9665-.7835 1.75-1.75 1.75s-1.75-.7835-1.75-1.75z"/></g></svg>
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold p-2 rounded-full mr-4"
              onClick={playNextVideo}
            >
              <svg class="h-8 w-8 text-black-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <polygon points="5 4 15 12 5 20 5 4" />  <line x1="19" y1="5" x2="19" y2="19" /></svg>
            </button>
            <select className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold p-2 rounded-full mr-4" value={playbackRate} onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}>
            {playbackRates.map(rate => (
              <option key={rate} value={rate}>{rate}x</option>
            ))}
          </select>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold p-2 rounded-full mr-2"
              onClick={toggleMinimized}
            >
              <svg class="h-8 w-8 text-black-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" /></svg>
            </button>
            <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold p-2 rounded-full"
            onClick={handleFullScreen}
            >
              <svg class="h-8 w-8 text-black-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></svg>
            </button>
          </div>
        </div>}
        </div>
      )}
    </div>
    <div className="flex justify-center m-1">
    Copyright © 2024 copyrights Jatin Mangal
    </div>
    </>
  );
};

export default VideoPlayer;
