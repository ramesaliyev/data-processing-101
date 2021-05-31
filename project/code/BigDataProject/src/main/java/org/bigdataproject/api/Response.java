package org.bigdataproject.api;

import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;

public class Response {
    public HttpExchange httpExchange;
    public int httpStatus = 200;

    public Response(HttpExchange httpExchange) {
        this.httpExchange = httpExchange;
    }

    public void status(int httpStatus) {
        this.httpStatus = httpStatus;
    }

    public void end(String responseText) throws IOException {
        OutputStream os = httpExchange.getResponseBody();
        this.httpExchange.sendResponseHeaders(this.httpStatus, responseText.length());
        os.write(responseText.getBytes());
        os.close();
    }

    public void sendError(Exception exception) {

    }

    public void send(String responseText) {
        try {
            this.end(responseText);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
