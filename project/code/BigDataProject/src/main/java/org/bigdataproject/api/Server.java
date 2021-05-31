package org.bigdataproject.api;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.function.BiConsumer;

interface RouteHandlerFn extends BiConsumer<Request, Response> {}

class RouteHandler implements HttpHandler {
    private final String path;
    private final RouteHandlerFn handlerFn;

    public RouteHandler(String path, RouteHandlerFn handlerFn) {
        this.path = path;
        this.handlerFn = handlerFn;
    }

    public void handle(HttpExchange httpExchange) throws IOException {
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
