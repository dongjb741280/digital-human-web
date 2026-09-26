export const useRecord = (transcribeAudio) => {
  const MIN_DECIBELS = -45
  const VISUALIZER_BUFFER_LENGTH = 100
  const recording = ref(false)
  const loading = ref(false)
  const confirmed = ref(false)
  const durationSeconds = ref(0)
  let durationCounter: any
  let mediaRecorder: any
  let audioChunks: any[] = []
  const visualizerData = ref(Array(VISUALIZER_BUFFER_LENGTH).fill(0))
  const startDurationCounter = () => {
    durationCounter = setInterval(() => {
      durationSeconds.value++
    }, 1000)
  }
  const stopDurationCounter = () => {
    clearInterval(durationCounter.value)
    durationSeconds.value = 0
  }
  watch(recording, (val) => {
    if (val) {
      startRecording()
    } else {
      stopRecording()
    }
  })

  const calculateRMS = (data: Uint8Array) => {
    let sumSquares = 0
    for (let i = 0; i < data.length; i++) {
      const normalizedValue = (data[i] - 128) / 128 // Normalize the data
      sumSquares += normalizedValue * normalizedValue
    }
    return Math.sqrt(sumSquares / data.length)
  }

  const normalizeRMS = (rms) => {
    rms = rms * 10
    const exp = 1.5
    const scaledRMS = Math.pow(rms, exp)
    return Math.min(1.0, Math.max(0.01, scaledRMS))
  }
  const analyseAudio = (stream) => {
    const audioContext = new AudioContext()
    const audioStreamSource = audioContext.createMediaStreamSource(stream)

    const analyser = audioContext.createAnalyser()
    analyser.minDecibels = MIN_DECIBELS
    audioStreamSource.connect(analyser)

    const bufferLength = analyser.frequencyBinCount

    const domainData = new Uint8Array(bufferLength)
    const timeDomainData = new Uint8Array(analyser.fftSize)

    // let lastSoundTime = Date.now();

    const detectSound = () => {
      const processFrame = () => {
        if (!unref(recording) || unref(loading)) return
        if (unref(recording) && !unref(loading)) {
          analyser.getByteTimeDomainData(timeDomainData)
          analyser.getByteFrequencyData(domainData)

          const rmsLevel = calculateRMS(timeDomainData)
          visualizerData.value.push(normalizeRMS(rmsLevel))

          if (visualizerData.value.length >= VISUALIZER_BUFFER_LENGTH) {
            visualizerData.value.shift()
          }

          // visualizerData.value = visualizerData.value

          // if (domainData.some((value) => value > 0)) {
          // 	lastSoundTime = Date.now();
          // }

          // if (recording && Date.now() - lastSoundTime > 3000) {
          // 	if ($settings?.speechAutoSend ?? false) {
          // 		confirmRecording();
          // 	}
          // }
        }

        window.requestAnimationFrame(processFrame)
      }

      window.requestAnimationFrame(processFrame)
    }

    detectSound()
  }
  const blobToFile = (blob, fileName) => {
    return new File([blob], fileName, { type: blob.type })
  }
  const transcribeHandler = async (audioBlob) => {
    await nextTick()
    const file = blobToFile(audioBlob, 'recording.wav')

    await transcribeAudio(file).catch((e) => {
      console.log(e)
    })
    console.log('transcribeHandler')
  }
  const startRecording = async () => {
    startDurationCounter()
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    mediaRecorder.onstart = () => {
      audioChunks = []
      if (!unref(recording)) {
        console.log('cancel started recording')
        mediaRecorder.stop()
        return
      }
      console.log('Recording started')
      analyseAudio(stream)
    }
    mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data)
    mediaRecorder.onstop = async () => {
      console.log('Recording stopped')

      if (unref(confirmed)) {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })

        await transcribeHandler(audioBlob)

        confirmed.value = false
        loading.value = false
      }
      audioChunks = []
      recording.value = false
    }
    mediaRecorder.start()
  }
  const stopRecording = async () => {
    console.log('stopRecording')
    if (recording && mediaRecorder) {
      await mediaRecorder.stop()
    }
    stopDurationCounter()
    audioChunks = []
  }

  const confirmRecording = async () => {
    console.log('confirmRecording')
    loading.value = true
    confirmed.value = true

    if (recording && mediaRecorder) {
      await mediaRecorder.stop()
    }
    clearInterval(durationCounter)
  }

  return {
    recording,
    loading,
    confirmRecording,
    visualizerData
  }
}
