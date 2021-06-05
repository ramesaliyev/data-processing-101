package org.bigdataproject.core.api;

import org.bigdataproject.core.api.routes.CommonRoutes;
import org.bigdataproject.core.api.routes.HDFSRoutes;
import org.bigdataproject.core.api.routes.JobRoutes;
import org.bigdataproject.core.api.server.Server;
import org.bigdataproject.core.helpers.AppConfig;

import java.io.IOException;

public class API {
    public API() throws IOException {
        Server server = new Server(AppConfig.PORT);

        new CommonRoutes(server);
        new HDFSRoutes(server);
        new JobRoutes(server);

        // Start server.
        server.start();
    }
}
