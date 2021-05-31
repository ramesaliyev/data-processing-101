package org.bigdataproject.api;

import com.sun.net.httpserver.HttpExchange;

import java.util.HashMap;

public class Request {
    public HttpExchange httpExchange;
    public HashMap<String, String> params = new HashMap<>();

    public Request(HttpExchange httpExchange) {
        this.httpExchange = httpExchange;
        this.parseParams();
    }

    private void parseParams() {
        String query = this.httpExchange.getRequestURI().getQuery();

        if(query == null) {
            return;
        }

        for (String param : query.split("&")) {
            String[] entry = param.split("=");
            params.put(entry[0], entry.length > 1 ? entry[1] : null);
        }
    }
}
