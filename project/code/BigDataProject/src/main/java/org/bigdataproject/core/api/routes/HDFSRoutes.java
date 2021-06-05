package org.bigdataproject.core.api.routes;

import org.bigdataproject.core.api.server.Request;
import org.bigdataproject.core.api.server.Response;
import org.bigdataproject.core.api.server.Server;
import org.bigdataproject.core.helpers.AppConfig;
import org.bigdataproject.hadoop.HDFS;

import java.io.IOException;
import java.util.List;

public class HDFSRoutes {
    public HDFSRoutes(Server server) {
        server.get("/hdfs/mkdir", this::routeHDFSCreateDirectory);
        server.get("/hdfs/remove", this::routeHDFSRemovePath);
        server.get("/hdfs/copy", this::routeHDFSCopyFile);
        server.get("/hdfs/read", this::routeHDFSReadFile);
        server.get("/hdfs/list", this::routeHDFSListFiles);
        server.get("/hdfs/copyAppend", this::routeHDFSCopyAppendFile);
    }

    public void routeHDFSCreateDirectory(Request req, Response res) {
        String path = req.params.get("path");

        if (path != null) {
            try {
                HDFS.createDirectory(path);
                res.send("ok");
            } catch (IOException e) {
                res.sendError(e);
                e.printStackTrace();
            }
        } else {
            res.sendEmpty();
        }
    }

    public void routeHDFSRemovePath(Request req, Response res) {
        String path = req.params.get("path");

        if (path != null) {
            try {
                HDFS.removePath(path);
                res.send("ok");
            } catch (IOException e) {
                res.sendError(e);
                e.printStackTrace();
            }
        } else {
            res.sendEmpty();
        }
    }

    public void routeHDFSCopyFile(Request req, Response res) {
        String from = req.params.get("from");
        String to = req.params.get("to");

        if (from != null && to != null) {
            try {
                HDFS.copyFile(from, to);
                res.send("ok");
            } catch (IOException e) {
                res.sendError(e);
                e.printStackTrace();
            }
        } else {
            res.sendEmpty();
        }
    }

    public void routeHDFSReadFile(Request req, Response res) {
        String path = req.params.get("path");

        if (path != null) {
            try {
                res.send(HDFS.readFileAsString(path));
            } catch (IOException e) {
                res.sendError(e);
                e.printStackTrace();
            }
        } else {
            res.sendEmpty();
        }
    }

    public void routeHDFSListFiles(Request req, Response res) {
        String path = req.params.get("path");

        if (path != null) {
            try {
                StringBuilder responseText = new StringBuilder();
                List<String> fileList = HDFS.listFiles(path);

                for (String file : fileList){
                    file = file.replace(AppConfig.HDFSNameNode, "");
                    responseText.append(file).append("\n");
                }

                res.send(responseText.toString());
            } catch (IOException e) {
                res.sendError(e);
                e.printStackTrace();
            }
        } else {
            res.sendEmpty();
        }
    }

    public void routeHDFSCopyAppendFile(Request req, Response res) {
        String from = req.params.get("from");
        String to = req.params.get("to");

        if (from != null && to != null) {
            try {
                HDFS.copyAppendFile(from, to);
                res.send("ok");
            } catch (IOException e) {
                res.sendError(e);
                e.printStackTrace();
            }
        } else {
            res.sendEmpty();
        }
    }
}
