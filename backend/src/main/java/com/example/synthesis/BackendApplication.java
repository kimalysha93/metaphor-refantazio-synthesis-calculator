package com.example.synthesis;

import static spark.Spark.*;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;

public class BackendApplication {

    public static void main(String[] args) {
        // Port can be configured via environment variable PORT
        int port = 4567;
        String portEnv = System.getenv("PORT");
        if (portEnv != null) {
            try {
                port = Integer.parseInt(portEnv);
            } catch (NumberFormatException e) {
                // ignore and use default
            }
        }
        port(port);

        // Enable simple CORS for local development
        enableCORS("*", "GET,POST,OPTIONS", "Content-Type,Authorization");

        Gson gson = new Gson();

        get("/api/status", (req, res) -> {
            res.type("application/json");
            JsonObject obj = new JsonObject();
            obj.addProperty("status", "ok");
            return obj;
        }, gson::toJson);

        get("/api/results", (req, res) -> {
            res.type("application/json");
            // Example static response; replace with real logic
            JsonObject obj = new JsonObject();
            obj.addProperty("name", "example result");
            obj.addProperty("value", 42);
            return obj;
        }, gson::toJson);

        post("/api/calculate", (req, res) -> {
            res.type("application/json");
            // Expect JSON body with simple fields, e.g. { "a": 1, "b": 2 }
            try {
                JsonObject in = gson.fromJson(req.body(), JsonObject.class);
                double a = in.has("a") ? in.get("a").getAsDouble() : 0.0;
                double b = in.has("b") ? in.get("b").getAsDouble() : 0.0;
                JsonObject out = new JsonObject();
                out.addProperty("a", a);
                out.addProperty("b", b);
                out.addProperty("sum", a + b);
                return out;
            } catch (Exception e) {
                res.status(400);
                JsonObject err = new JsonObject();
                err.addProperty("error", "invalid JSON");
                return err;
            }
        }, gson::toJson);

        // New endpoint: evaluate selections (lineages/archetypes)
        // Expects JSON: { "selections": [ { "lineage": "lin1", "archetype": "arch1" }, ... ] }
        // Returns JSON: { "results": [ { "lineage":..., "archetype":..., "score":... }, ... ] }
        post("/api/evaluate", (req, res) -> {
            res.type("application/json");
            try {
                JsonObject in = gson.fromJson(req.body(), JsonObject.class);
                JsonArray selections = in.has("selections") ? in.getAsJsonArray("selections") : null;
                JsonArray results = new JsonArray();

                if (selections != null) {
                    for (int i = 0; i < selections.size(); i++) {
                        JsonObject sel = selections.get(i).getAsJsonObject();
                        String lineage = sel.has("lineage") ? sel.get("lineage").getAsString() : "";
                        String archetype = sel.has("archetype") ? sel.get("archetype").getAsString() : "";

                        // Placeholder computation: you can replace this with your real math.
                        int score = 5;//(lineage != null ? lineage.length() : 0) + (archetype != null ? archetype.length() : 0);

                        JsonObject outItem = new JsonObject();
                        outItem.addProperty("lineage", lineage);
                        outItem.addProperty("archetype", archetype);
                        outItem.addProperty("score", score);
                        results.add(outItem);
                    }
                }

                JsonObject out = new JsonObject();
                out.add("results", results);
                return out;
            } catch (Exception e) {
                res.status(400);
                JsonObject err = new JsonObject();
                err.addProperty("error", "invalid JSON");
                return err;
            }
        }, gson::toJson);

        // Options route for CORS preflight
        options("/*", (request, response) -> {
            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        // Basic root to show a simple message
        get("/", (req, res) -> "Synthesis backend is running.");
    }

    // Helper to enable CORS
    private static void enableCORS(final String origin, final String methods, final String headers) {
        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", origin);
            response.header("Access-Control-Request-Method", methods);
            response.header("Access-Control-Allow-Headers", headers);
            // Allow credentials if needed
            response.header("Access-Control-Allow-Credentials", "true");
        });
    }
}
