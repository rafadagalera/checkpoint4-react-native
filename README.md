# Interclasse digital

### Esse repositório serve como entrega do Checkpoint 4 da disciplina de Mobile Development ministrada a turma 3ESPS. O repositório conta com uma aplicação desenvolvida em React Native para a gestão de um campeonato Interclasses, juntamente com uma API desenvolvida em Python para integração. O aplicativo disponibiliza o cadastro de salas e gerenciamento de partidas (Async Storage e API).


## Estrutura de pastas

- `interclasse-digital/` (app React Native)
- `interclasse-api/` (API FastAPI)


## Instruções 


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
  -d '{"sport":"Futsal","homeTeam":"2A","awayTeam":"2B","date":"20/03/2026","hour":"14:30","court":"Quadra 1"}'
```

### 3) Listar partidas (GET `/matches`)

```bash
curl -X GET "http://127.0.0.1:8000/matches?_limit=8"
```

## Endpoints da API

- `POST /classrooms` (cadastro de sala com `Name` e `ID`)
- `POST /matches` (cadastro de partida com `sport`, `homeTeam`, `awayTeam`, `date`, `hour`, `court`)
- `GET /matches?_limit=8` (lista de partidas)
- `GET /health` (status da API)


## Integrantes:

#### Rafael Nascimento RM 553117
#### Beatriz Rocha RM 553455 
#### Iago Diniz RM 553776
#### Larissa Estella RM 552695
#### Enzzo Monteiro RM 552616