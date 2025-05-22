'use client';
import './video.css'; // Extracted styles from HTML to CSS

import React, { useEffect, useRef, useState } from 'react';

const VideoPlayer = ({
  videoSrc,
  fileId,
  filePath,

  watermark,
}: any) => {
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const progressContainerRef = useRef(null);
  const volumeSliderRef = useRef(null);
  const controlsRef = useRef(null);
  const settingsPanelRef = useRef(null);
  const playbackSpeedPanelRef = useRef(null);
  const loadingIndicatorRef = useRef(null);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [controlsVisible, setControlsVisible] = useState(true);
  // const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [streamUrl, setStreamUrl] = useState('');
  // const router = useRouter();

  let controlsTimeout = null;
  let seekCount = 0;
  let lastSeekTime = 0;

  useEffect(() => {
    // Determine the video source to use
    if (filePath) {
      // Use streaming API if we have fileId and filePath
      const apiUrl = `/api/upload/video?path=${encodeURIComponent(filePath)}`;
      setStreamUrl(apiUrl);
    } else if (videoSrc) {
      // Fall back to direct URL if provided
      setStreamUrl(videoSrc);
    }
  }, [fileId, filePath, videoSrc]);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === Infinity) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const updateProgress = () => {
    const video = videoRef.current;
    if (video && progressBarRef.current) {
      const progress = (video.currentTime / video.duration) * 100;
      progressBarRef.current.style.width = `${progress}%`;
      setCurrentTime(formatTime(video.currentTime));
      setDuration(formatTime(video.duration));
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error('Error playing video:', error));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const setProgress = (e) => {
    const video = videoRef.current;
    if (!video || !progressContainerRef.current) return;

    const width = progressContainerRef.current.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    video.currentTime = (clickX / width) * video.duration;
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const updateVolume = (e) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = e.target.value;
    video.muted = video.volume === 0;
    setVolume(video.volume);
    setIsMuted(video.volume === 0);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!document.fullscreenElement) {
      video.parentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  const setPlaybackSpeed = (newSpeed) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = newSpeed;
    setSpeed(newSpeed);

    // Hide the playback speed panel after selection
    if (playbackSpeedPanelRef.current) {
      playbackSpeedPanelRef.current.style.display = 'none';
    }
  };

  const monitorUserBehavior = () => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('seeking', () => {
      const now = Date.now();
      if (now - lastSeekTime > 5000) seekCount = 0;
      seekCount++;
      lastSeekTime = now;
      if (seekCount > 10) {
        console.warn('Suspicious seeking detected');
        seekCount = 0;
      }
    });
  };

  const hideControlsWhenInactive = () => {
    clearTimeout(controlsTimeout);
    setControlsVisible(true);
    controlsTimeout = setTimeout(() => {
      const video = videoRef.current;
      if (video && !video.paused) setControlsVisible(false);
    }, 3000);
  };

  // Handle video end
  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0; // Reset to beginning for replay
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    // Add event listeners when component mounts
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('waiting', () => {
      if (loadingIndicatorRef.current) {
        loadingIndicatorRef.current.style.display = 'block';
      }
    });

    video.addEventListener('playing', () => {
      if (loadingIndicatorRef.current) {
        loadingIndicatorRef.current.style.display = 'none';
      }
    });

    video.addEventListener('loadedmetadata', () => {
      if (loadingIndicatorRef.current) {
        loadingIndicatorRef.current.style.display = 'none';
      }
      // setIsVideoLoaded(true);
      updateProgress(); // Initialize duration display
    });

    video.addEventListener('ended', handleVideoEnd);

    monitorUserBehavior();

    // Clean up event listeners when component unmounts
    return () => {
      clearTimeout(controlsTimeout);
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('waiting', () => {});
      video.removeEventListener('playing', () => {});
      video.removeEventListener('loadedmetadata', () => {});
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('seeking', () => {});
    };
  }, [streamUrl]);

  return (
    <div className="container">
      <div className="video-container" onMouseMove={hideControlsWhenInactive}>
        <video
          ref={videoRef}
          id="videoPlayer"
          playsInline
          disablePictureInPicture
          onClick={togglePlay}
          onContextMenu={(e) => e.preventDefault()}
        >
          {streamUrl && <source src={streamUrl} type="video/mp4" />}
          Your browser does not support the video tag.
        </video>
        <div className="watermark">{watermark}</div>
        <div className="course-title">Introduction to Web Development</div>
        <div
          ref={loadingIndicatorRef}
          id="loadingIndicator"
          className="text-white"
        >
          Loading...
        </div>

        <div
          className={`custom-controls ${controlsVisible ? 'active' : ''}`}
          ref={controlsRef}
        >
          <div className="control-row">
            <button className="control-btn text-white" onClick={togglePlay}>
              {isPlaying ? '❚❚' : '▶'}
            </button>
            <div
              className="progress-container bg-slate-300"
              ref={progressContainerRef}
              onClick={setProgress}
            >
              <div
                className="progress-bar bg-blue-600"
                ref={progressBarRef}
              ></div>
            </div>
            <div className="time-display text-white">
              <span>{currentTime}</span> / <span>{duration}</span>
            </div>
          </div>
          <div className="control-row">
            <div className="volume-container">
              <button className="control-btn" onClick={toggleMute}>
                {isMuted ? '🔇' : '🔊'}
              </button>
              <input
                type="range"
                className="volume-slider"
                ref={volumeSliderRef}
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={updateVolume}
              />
            </div>
            <button
              className="control-btn"
              onClick={() => {
                if (settingsPanelRef.current) {
                  settingsPanelRef.current.style.display =
                    settingsPanelRef.current.style.display === 'block'
                      ? 'none'
                      : 'block';
                }
              }}
            >
              ⚙️
            </button>
            <button className="control-btn" onClick={toggleFullscreen}>
              ⛶
            </button>
          </div>
          <div className="settings-panel" ref={settingsPanelRef}>
            <div className="settings-option text-white">Quality: Auto</div>
            <div
              className="settings-option"
              onClick={() => {
                if (playbackSpeedPanelRef.current) {
                  playbackSpeedPanelRef.current.style.display =
                    playbackSpeedPanelRef.current.style.display === 'block'
                      ? 'none'
                      : 'block';
                }
              }}
            >
              Speed: {speed}x
            </div>
          </div>
          <div className="settings-panel" ref={playbackSpeedPanelRef}>
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
              <div
                key={s}
                className={`playback-speed-option ${speed === s ? 'active' : ''}`}
                onClick={() => setPlaybackSpeed(s)}
              >
                {s}x
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
