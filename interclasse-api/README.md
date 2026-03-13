# Interclasse API (FastAPI)

API leve para substituir JSONPlaceholder no projeto Interclasse.

## Endpoints

- `POST /classrooms` (cadastro de sala com `Name` e `ID`)
- `POST /matches` (cadastro de partida com `sport`, `homeTeam`, `awayTeam`, `date`, `hour`, `court`)
- `GET /matches?_limit=8` (lista de partidas)
- `GET /health` (status da API)

## Executar localmente

```bash
cd /home/bcr/checkpoints/interclasse-api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
