# Interclasse Monorepo

Monorepo com:

- `interclasse-digital/` (app React Native)
- `interclasse-api/` (API FastAPI local que substitui JSONPlaceholder)

## API local (FastAPI)

```bash
cd /home/bcr/checkpoints/interclasse-api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

## App React Native

```bash
cd /home/bcr/checkpoints/interclasse-digital
npm install
npm run start
```

## Testes rápidos com curl

### 1) Cadastrar sala (POST `/classrooms`)

```bash
curl -X POST "http://127.0.0.1:8000/classrooms" \
  -H "Content-Type: application/json" \
  -d '{"Name":"2A","ID":"1700000000000"}'
```

### 2) Cadastrar partida (POST `/matches`)

```bash
curl -X POST "http://127.0.0.1:8000/matches" \
  -H "Content-Type: application/json" \
  -d '{"homeTeam":"2A","awayTeam":"2B","date":"20/03/2026","hour":"14:30","court":"Quadra 1"}'
```

### 3) Listar partidas (GET `/matches`)

```bash
curl -X GET "http://127.0.0.1:8000/matches?_limit=8"
```
