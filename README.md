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

```bash
curl -X POST "http://127.0.0.1:8000/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"2A","username":"2a","email":"2a@escola.com"}'
```

```bash
curl -X POST "http://127.0.0.1:8000/posts" \
  -H "Content-Type: application/json" \
  -d '{"title":"Futsal: 2A x 2B","body":"Data 20/03/2026 14:30 - Local Quadra 1","userId":4}'
```

```bash
curl -X GET "http://127.0.0.1:8000/posts?_limit=8"
```
