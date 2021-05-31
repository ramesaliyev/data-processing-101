package org.bigdataproject.core.api.routes;

import org.bigdataproject.core.api.server.Request;
import org.bigdataproject.core.api.server.Response;
import org.bigdataproject.core.api.server.Server;

public class CommonRoutes {
    public CommonRoutes(Server server) {
        server.get("/health", this::routeHealthCheck);
    }

    public void routeHealthCheck(Request req, Response res) {
        res.send("ok");
    }
}
