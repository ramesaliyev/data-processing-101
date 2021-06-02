package org.bigdataproject.core.api.server;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;

class RouteHandler implements HttpHandler {
    private final String path;
    private final RouteHandlerFn handlerFn;

    public RouteHandler(String path, RouteHandlerFn handlerFn) {
        this.path = path;
        this.handlerFn = handlerFn;
    }

    public void handle(HttpExchange httpExchange) throws IOException {
        httpExchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");

        if (httpExchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            httpExchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, OPTIONS");
            httpExchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type,Authorization");
            httpExchange.sendResponseHeaders(204, -1);
            return;
        }

        this.handlerFn.accept(new Request(httpExchange), new Response(httpExchange));
    }
}

public class Server {
    HttpServer server;
    int port;

    public Server(int port) throws IOException {
        this.port = port;
        this.server = HttpServer.create(new InetSocketAddress(port), 0);
    }

    public void get(String path, RouteHandlerFn handlerFn) {
        this.server.createContext(path, new RouteHandler(path, handlerFn));
    }

    public void start() {
        this.server.start();
        System.out.println("Server started in port: " + port);
    }
}
