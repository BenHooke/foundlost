#!/bin/bash

PORT="$1"

if [ -z "$1" ]; then
  echo "No port chosen, defaulting to 8000"
  PORT=8000
fi

/home/benhooke/projects/foundlost/backend/.venv/bin/uvicorn app.main:app --port $PORT
