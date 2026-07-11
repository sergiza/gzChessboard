# gzChessboard
A chess analysis board. Just a personal full-stack project built in Angular and Java Spring.

## Features
- Position evaluation with Stockfish service
- Opening detection using ECO codes
- Save and load games as PGN, organized in folders

## How to run
~~~bash
./run.sh    # docker compose up --build
~~~

Then go to [localhost:4200](http://localhost:4200).

<details><summary>Running without Docker</summary>

Needs Java 25, Node 22 and Stockfish (`sudo apt install stockfish`).

- Backend:
~~~bash
cd backend
./mvnw spring-boot:run
~~~

- Frontend:
~~~bash
cd frontend
npx ng serve
~~~

API docs (Swagger UI) on [localhost:8080/swagger-ui](http://localhost:8080/swagger-ui/index.html).

</details>

## Credits

Board UI is [cm-chessboard](https://shaack.com/projekte/cm-chessboard/), game logic is chess.js.\
Opening data and sounds from Lichess.
