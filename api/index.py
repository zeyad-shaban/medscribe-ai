import numpy as np
import io
import librosa
from fastapi import FastAPI, File, UploadFile, HTTPException

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

    waveform, sr = librosa.load(buffer, sr=None, mono=True, res_type='kaiser_fast')


    num_samples = len(waveform)
    duration_seconds = num_samples / sr

    print("--- Audio Payload Ingested ---")
    print(f"Native Browser Sample Rate: {sr} Hz")
    print(f"Total Discrete Samples: {num_samples}")
    print(f"Calculated Duration: {duration_seconds:.2f} seconds")

    return {
        "filename": file.filename,
        "detected_sample_rate": sr,
        "sample_count": num_samples,
        "duration_seconds": round(duration_seconds, 2),
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("index:app", host="127.0.0.1", port=8000, reload=True)
