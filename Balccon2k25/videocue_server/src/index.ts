import { Elysia, t } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import fs from 'fs';

const VIDEO_DURATION = 300000; // 300 seconds
const DEFAULT_VIDEO_ID = 'OiwsGy70OII';
const LOG_FILE = 'played_videos.log';

let videoQueue: string[] = [];
let currentlyPlaying: string | null = null;
let nextVideoTime = 0;
let videoTimeout: Timer | null = null;

const app = new Elysia();

app.use(staticPlugin({ assets: 'public', prefix: '' }));

app.ws('/ws', {
  open(ws) {
    ws.subscribe('vids');
    ws.send({ currentlyPlaying, queue: videoQueue, nextVideoTime });
  },
  message(ws, message: { url: string, status: string }) {
    if (message.url) {
      const videoId = extractYouTubeId(message.url);
      if (videoId && !videoQueue.includes(videoId) && currentlyPlaying !== videoId) {
        videoQueue.push(videoId);
        broadcastQueueUpdate(); // Always broadcast queue updates
        if (currentlyPlaying === DEFAULT_VIDEO_ID) {
          if (videoTimeout) {
            clearTimeout(videoTimeout);
          }
          playNextVideo();
        }
      }
    } else if (message.status === 'ended') {
      if (videoTimeout) {
        clearTimeout(videoTimeout);
      }
      playNextVideo();
    }
  },
});

function broadcastQueueUpdate() {
  app.server?.publish('vids', JSON.stringify({ currentlyPlaying, queue: videoQueue, nextVideoTime }));
}

function extractYouTubeId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      return urlObj.searchParams.get('v');
    }
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
  } catch (e) {
    // ignore invalid urls
  }
  return null;
}

function logPlayedVideo(videoId: string) {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp}: ${videoId}\n`;
  fs.appendFile(LOG_FILE, logEntry, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
}

function playNextVideo() {
  if (currentlyPlaying && currentlyPlaying !== DEFAULT_VIDEO_ID) {
    logPlayedVideo(currentlyPlaying);
  }

  if (videoQueue.length > 0) {
    currentlyPlaying = videoQueue.shift()!;
    nextVideoTime = Date.now() + VIDEO_DURATION;
    broadcastQueueUpdate();
    videoTimeout = setTimeout(playNextVideo, VIDEO_DURATION);
  } else {
    currentlyPlaying = DEFAULT_VIDEO_ID;
    nextVideoTime = 0; // Indicates infinite
    broadcastQueueUpdate();
  }
}

playNextVideo();

app.listen(80);

console.log('Server listening on http://localhost:80');

