package org.bigdataproject.api;

import org.bigdataproject.hadoop.HDFS;

import java.io.IOException;

public class API {
    private final Server server;

    public API(int port) throws IOException {
        this.server = new Server(port);

        // Common Routes
        this.server.get("/health", this::routeHealthCheck);

        // HDFS Routes
        this.server.get("/hdfs/mkdir", this::routeHDFSCreateDirectory);
        this.server.get("/hdfs/remove", this::routeHDFSRemovePath);
        this.server.get("/hdfs/write", this::routeHDFSWriteFile);
        this.server.get("/hdfs/read", this::routeHDFSReadFile);
        this.server.get("/hdfs/append", this::routeHDFSAppendFile);

        // Start server.
        this.server.start();
    }

    public void routeHealthCheck(Request req, Response res) {
        res.send("ok");
    }

    public void routeHDFSCreateDirectory(Request req, Response res) {
        String path = req.params.get("path");
        if (path != null) {
            try {
                HDFS.createDirectory(path);
                res.send("ok");
            } catch (IOException e) {
                res.send("error");
                e.printStackTrace();
            }
        }
    }

    public void routeHDFSRemovePath(Request req, Response res) {
        String path = req.params.get("path");
        if (path != null) {
            try {
                HDFS.removePath(path);
                res.send("ok");
            } catch (IOException e) {
                res.send("error");
                e.printStackTrace();
            }
        }
    }

    public void routeHDFSWriteFile(Request req, Response res) {
        String from = req.params.get("from");
        String to = req.params.get("to");

        if (from != null && to != null) {
            try {
                HDFS.writeFile(from, to);
                res.send("ok");
            } catch (IOException e) {
                res.send("error");
                e.printStackTrace();
            }
        }
    }

    public void routeHDFSReadFile(Request req, Response res) {
        String path = req.params.get("path");

        if (path != null) {
            try {
                res.send(HDFS.readFileAsString(path));
            } catch (IOException e) {
                res.send("error");
                e.printStackTrace();
            }
        }
    }

    public void routeHDFSAppendFile(Request req, Response res) {
        String from = req.params.get("from");
        String to = req.params.get("to");

        if (from != null && to != null) {
            try {
                HDFS.appendFile(from, to);
                res.send("ok");
            } catch (IOException e) {
                res.send("error");
                e.printStackTrace();
            }
        }
    }
}
