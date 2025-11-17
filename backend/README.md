# Synthesis Calculator — Java Backend (SparkJava)

This lightweight backend provides a few example REST endpoints to support the front-end:

- GET /api/status — returns { "status": "ok" }
- GET /api/results — returns a sample JSON result
- POST /api/calculate — accepts JSON { "a": number, "b": number } and returns their sum

Requirements
- Java 11 or newer
- Maven

Build and run

From the `backend/` directory:

```powershell
mvn package
java -jar target/synthesis-backend-0.1.0.jar
```

By default the server listens on port 4567. To override, set environment variable `PORT` before running.

CORS
The backend enables permissive CORS for local development. For production, adjust the allowed origins.

Next steps
- Replace static/sample logic with real calculation or persistence.
- Add tests, logging, and configuration if needed.
