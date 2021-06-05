package org.bigdataproject.hadoop;

import org.apache.commons.io.IOUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.*;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class HDFS {
    public static FileSystem fileSystem;

    static {
        try {
            fileSystem = FileSystem.get(HDFS.getConfiguration());
        } catch (IOException exception) {
            exception.printStackTrace();
        }
    }

    public static Configuration getConfiguration() {
        Configuration configuration = new Configuration();
        configuration.set("fs.defaultFS", "hdfs://namenode:8020");
        return configuration;
    }

    public static void createDirectory(String path) throws IOException {
        HDFS.fileSystem.mkdirs(new Path(path));
    }

    public static void removePath(String path) throws IOException {
        if (!HDFS.isExists(path)) return;
        HDFS.fileSystem.delete(new Path(path), true);
    }

    public static boolean isExists(String path) throws IOException {
        return HDFS.fileSystem.exists(new Path(path));
    }

    public static List<String> listFiles(String path) throws IOException {
        FileSystem fs = HDFS.fileSystem;
        List<String> filePaths = new ArrayList<>();
        Queue<Path> fileQueue = new LinkedList<>();
        fileQueue.add(new Path(path));

        while (!fileQueue.isEmpty()) {
            Path filePath = fileQueue.remove();

            if (fs.isFile(filePath)) {
                filePaths.add("file:" + filePath.toString());
            } else {
                FileStatus[] fileStatuses = fs.listStatus(filePath);

                if (fileStatuses.length == 0) {
                    filePaths.add("dir:" + filePath.toString());
                } else {
                    for (FileStatus fileStatus : fileStatuses) {
                        fileQueue.add(fileStatus.getPath());
                    }
                }
            }
        }

        return filePaths;
    }

    public static FSDataInputStream readFile(String path) throws IOException {
        return HDFS.fileSystem.open(new Path(path));
    }

    public static String readFileAsString(String path) throws IOException {
        FSDataInputStream inputStream = HDFS.fileSystem.open(new Path(path));
        String fileContent = IOUtils.toString(inputStream, StandardCharsets.UTF_8);
        inputStream.close();
        return fileContent;
    }

    public static void copyFile(String fromPath, String toPath) throws IOException {
        FSDataOutputStream fsDataOutputStream = HDFS.fileSystem.create(new Path(toPath),true);
        BufferedWriter bufferedWriter = new BufferedWriter(new OutputStreamWriter(fsDataOutputStream, StandardCharsets.UTF_8));
        BufferedReader bufferedReader = new BufferedReader(new FileReader(fromPath));
        IOUtils.copy(bufferedReader, bufferedWriter);
        bufferedWriter.close();
        bufferedReader.close();
    }

    public static void copyAppendFile(String fromPath, String toPath) throws IOException {
        FSDataOutputStream fsDataOutputStream = HDFS.fileSystem.append(new Path(toPath));
        BufferedWriter bufferedWriter = new BufferedWriter(new OutputStreamWriter(fsDataOutputStream,StandardCharsets.UTF_8));
        BufferedReader bufferedReader = new BufferedReader(new FileReader(fromPath));
        IOUtils.copy(bufferedReader, bufferedWriter);
        bufferedWriter.close();
        bufferedReader.close();
    }
}
