<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";
  
    export let form: ActionData;
    export let recording: boolean = false;
    export let loading: boolean = false;
    export let counter: number;
  
    let audio: Blob;
    let htmlForm: HTMLFormElement;
    let recorder: MediaRecorder;
    let audioChunks: Blob[] = [];
    let interval: Timer;
  
    const startRecording = async () => {
  
      if (form?.tweet) {
        form.tweet = "";
      }
      // Remove deprecated getUserMedia fallbacks
      // Modern browsers use navigator.mediaDevices.getUserMedia()
      // which is already used in the next line of the original code
  
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => audioChunks.push(event.data);
      recorder.onstop = () => {
        audio = new Blob(audioChunks, { type: "audio/mpeg" });
        audioChunks = [];
        stream.getTracks().forEach((track) => track.stop());
        htmlForm.requestSubmit();
      };
      recording = true;
      console.log(recorder);
      recorder.start();
  
      timer( stopRecording );
    };
  
    const stopRecording = () => {
      if (recording) {
        recorder.stop();
      }
      recording = false;
      clearInterval(interval);
    };
  
    const toggleRecording = () => {
      if (recording) {
        stopRecording();
      } else {
        startRecording();
      }
    };
  
    const timer = (cb: Function) => {
      counter = 15;
      interval = setInterval(function () {
        counter = counter - 1;
  
        if (counter <= 0) {
          clearInterval(interval);
          cb();
        }
      }, 1000);
    };
  
    const handleSubmit = ({ data, action }) => {
      loading = true;
      data.append("file", audio, "audio.mpeg");
  
      return async ({ update }) => {
        loading = false;
        await update({ reset: false });
      };
    };
  
    const isTouchDevice = () => ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0	);
  
  </script>
  
  <div
    class="fixed bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 transform-origin-bottom"
  >
    <form
      action="?/create"
      method="POST"
      use:enhance={handleSubmit}
      bind:this={htmlForm}
      enctype="multipart/form-data"
    >
      <button
        on:click|preventDefault={toggleRecording}
        disabled={loading}
        class="bg-[#1DA1F2] p-5 rounded-full flex items-center justify-center text-white transition-all duration-300 disabled:bg-gray-300 umami--click--recorder {recording
          ? 'scale-[30]'
          : ''}"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="currentColor"
          viewBox="0 0 16 16"
          class={recording ? "scale-0" : ""}
        >
          <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z" />
          <path
            d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"
          />
        </svg>
      </button>
    </form>
  </div>
  
  {#if recording}
    <button
      on:click|preventDefault={stopRecording}
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 text-white text-center space-y-4"
    >
      <div class="text-9xl font-thin">{counter}</div>
      <div class="text-2xl font-light">Speak to Tweet</div>
      <div class="text-2xl font-semibold">{ isTouchDevice() ? 'Tap' : 'Click'} to Stop</div>
    </button>
  {/if}