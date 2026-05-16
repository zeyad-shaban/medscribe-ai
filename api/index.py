import io
import librosa
from fastapi import FastAPI, File, UploadFile, HTTPException
from api.utils.audio_cleaning import denoise_audio, normalize_audio

app = FastAPI()


@app.get("/")
def root():
    return {"status": "ok"}


@app.post("/api/transcribe")
async def process_and_transcribe(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    print(f"File size: {len(audio_bytes)} bytes")
    if len(audio_bytes) == 0:
        raise HTTPException(400, "Empty file")
    
    print(f"First 20 bytes: {audio_bytes[:20]}")

    buffer = io.BytesIO(audio_bytes)

    waveform, sr = librosa.load(buffer, sr=None)
    
    cleaned_audio = denoise_audio(waveform, sr)
    cleaned_audio =  normalize_audio(cleaned_audio)

    num_samples = len(waveform)
    duration_seconds = num_samples / sr
    
    return "hello world!"

    # info =  {
    #     "filename": file.filename,
    #     "detected_sample_rate": sr,
    #     "sample_count": num_samples,
    #     "duration_seconds": round(duration_seconds, 2),
    # }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("index:app", host="127.0.0.1", port=8000, reload=True)
