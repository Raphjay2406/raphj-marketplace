---
name: voice-ui
description: Voice UI pattern library — Web Speech API (free) + OpenAI Realtime + Gemini Live + ElevenLabs premium TTS. Patterns for navigation, form fill, search, onboarding, read-aloud.
tier: domain
triggers: voice-ui, tts, stt, web-speech, realtime-api, elevenlabs, voice-navigation
version: 0.1.0
---

# Voice UI

## Layer 1 — When to use

- Accessibility-first sites (low-vision, motor impairment)
- Hands-free contexts (cooking, driving, workshop)
- Long-form read-aloud (blogs, articles, podcasts-as-text)
- Conversational interfaces beyond AI chat
- Voice search / query

NOT for: gratuitous voice control on sites where keyboard + mouse already work well.

## Layer 2 — Provider matrix

| Provider | TTS | STT | Realtime stream | Cost | Best for |
|---|---|---|---|---|---|
| Web Speech API | Yes | Yes | No | Free | Browser-native, no backend, no latency concerns |
| OpenAI Realtime | Yes | Yes | Yes (full-duplex) | $0.06/min | Conversational agents, natural turn-taking |
| Gemini Live | Yes | Yes | Yes | Similar | Google-integrated workflows |
| ElevenLabs | Yes | No | Yes (stream) | $0.30/1000 chars | Premium brand voice |
| Deepgram | No | Yes | Yes | $0.0043/min | Cheapest high-quality STT |

## Layer 3 — Patterns

### Read-aloud (TTS)

```ts
// Browser-native, zero cost
function speak(text: string) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  speechSynthesis.speak(utterance);
}

// Stop / pause controls + highlight current word via `onboundary` event
```

### Voice form fill

```ts
const recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'en-US';
recognition.onresult = (e) => {
  const text = e.results[0][0].transcript;
  inputRef.current.value = text;
};
recognition.start();
```

### Conversational agent (Realtime)

```ts
// Client-side via OpenAI Realtime
const ws = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview');
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  if (msg.type === 'response.audio.delta') {
    playAudioChunk(base64ToArrayBuffer(msg.delta));
  }
};

// Send user audio
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  const recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (e) => ws.send(e.data);
});
```

### Voice search

```ts
const recognition = new webkitSpeechRecognition();
recognition.onresult = async (e) => {
  const query = e.results[0][0].transcript;
  const results = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  renderResults(await results.json());
};
```

## Layer 4 — Fallbacks

Every voice UI must work without voice:
- Keyboard shortcut equivalent
- Visual controls (play/pause/stop for TTS)
- Text input equivalent (for STT)

Voice is augmentation, never replacement.

## Layer 5 — Privacy + consent

- Microphone access requires explicit user gesture + banner
- STT streams should display recording indicator
- TTS output volume user-controllable
- Never record without permission; never upload audio to third-party without disclosure

## Layer 6 — Integration

- Archetype-aware voice selection (Luxury = warm natural voice; Cyberpunk-HUD = synthetic; Editorial = clear neutral)
- ElevenLabs voice ID per archetype in seeds/archetype-voices.json (future)
- Env vars: `OPENAI_API_KEY`, `ELEVENLABS_API_KEY`

## Layer 7 — Anti-patterns

- ❌ Auto-playing TTS without user gesture — browser blocks + user surprise
- ❌ STT recording without visible indicator — privacy violation
- ❌ No fallback for STT/TTS — accessibility regression for some users
- ❌ Voice-only navigation — screen readers already provide it; voice overlay conflicts
- ❌ ElevenLabs for simple announcements — use Web Speech; save budget
