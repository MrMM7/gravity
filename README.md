# Gravity

> One URL shortener to rule them all.

## Description

Gravity is a URL shortener built as a long-term backend engineering project. The goal isn't just to shorten URLs, it's to
gradually evolve the project into a production-ready service by adding better architecture, performance optimizations,
security, testing, observability, and scalability over time.

Each version represents another step toward that goal.

## Tech Stack

* Node.js
* Express.js
* SQLite

## How to use
You can use gravity through Docker.

Build the Docker image:
```bash
docker build -t gravity .
```

Run the container:
```bash
docker run -p 3000:3000 -d gravity
```

And now the program should be running on http://localhost:3000

To stop the container run:
```bash
docker ps
docker stop <container id>
```

## System Design Evolution

The diagrams below document how Gravity's architecture has evolved over time. Rather than replacing old designs, each
version serves as a snapshot of the project's progression.

### v1

![v1](design/v1-2.png)

### v0.5

![v0.5](design/v0.5.png)
