package org.bigdataproject.core.api.routes;

import org.bigdataproject.core.api.server.Request;
import org.bigdataproject.core.api.server.Response;
import org.bigdataproject.core.api.server.Server;
import org.bigdataproject.core.helpers.FS;

import java.io.IOException;
import java.util.List;

public class CommonRoutes {
    public CommonRoutes(Server server) {
        server.get("/health", this::routeHealthCheck);
        server.get("/fs/list", this::routeLocalFS);
    }

    public void routeHealthCheck(Request req, Response res) {
        res.send("ok");
    }

    public void routeLocalFS(Request req, Response res) {
        String path = req.params.get("path");

        if (path != null) {
            try {
                StringBuilder responseText = new StringBuilder();
                List<String> fileList = FS.listFiles(path);

                for(String file : fileList){
                    responseText.append(file).append("\n");
                }

                res.send(responseText.toString());
            } catch (IOException e) {
                e.printStackTrace();
                res.sendError(e);
            }
        } else {
            res.sendEmpty();
        }
    }
}
