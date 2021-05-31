package org.bigdataproject.core.api.routes;

import org.apache.hadoop.fs.LocatedFileStatus;
import org.apache.hadoop.fs.RemoteIterator;
import org.bigdataproject.core.api.server.Request;
import org.bigdataproject.core.api.server.Response;
import org.bigdataproject.core.api.server.Server;
import org.bigdataproject.hadoop.HDFS;

import java.io.IOException;

public class HDFSRoutes {
    public HDFSRoutes(Server server) {
        server.get("/hdfs/mkdir", this::routeHDFSCreateDirectory);
        server.get("/hdfs/remove", this::routeHDFSRemovePath);
        server.get("/hdfs/write", this::routeHDFSWriteFile);
        server.get("/hdfs/read", this::routeHDFSReadFile);
        server.get("/hdfs/list", this::routeHDFSListFiles);
        server.get("/hdfs/append", this::routeHDFSAppendFile);
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
                res.sendError(e);
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
                res.sendError(e);
                e.printStackTrace();
            }
        }
    }

    public void routeHDFSListFiles(Request req, Response res) {
        String path = req.params.get("path");

        if (path != null) {
            try {
                StringBuilder responseText = new StringBuilder();

                RemoteIterator<LocatedFileStatus> fileStatusListIterator = HDFS.listFiles(path);
                while(fileStatusListIterator.hasNext()){
                    LocatedFileStatus fileStatus = fileStatusListIterator.next();
                    responseText.append(fileStatus.getPath()).append("\n");
                }

                res.send(responseText.toString());
            } catch (IOException e) {
                res.sendError(e);
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
                res.sendError(e);
                e.printStackTrace();
            }
        }
    }
}
