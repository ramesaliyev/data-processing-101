package org.bigdataproject.hadoop;

import org.apache.commons.io.IOUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.*;

import java.io.*;
import java.nio.charset.StandardCharsets;

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

    public static RemoteIterator<LocatedFileStatus> listFiles(String path) throws IOException {
        return HDFS.fileSystem.listFiles(new Path(path), true);
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

    public static void writeFile(String fromPath, String toPath) throws IOException {
        FSDataOutputStream fsDataOutputStream = HDFS.fileSystem.create(new Path(toPath),true);
        BufferedWriter bufferedWriter = new BufferedWriter(new OutputStreamWriter(fsDataOutputStream, StandardCharsets.UTF_8));
        BufferedReader bufferedReader = new BufferedReader(new FileReader(fromPath));
        IOUtils.copy(bufferedReader, bufferedWriter);
        bufferedWriter.close();
        bufferedReader.close();
    }

    public static void appendFile(String fromPath, String toPath) throws IOException {
        FSDataOutputStream fsDataOutputStream = HDFS.fileSystem.append(new Path(toPath));
        BufferedWriter bufferedWriter = new BufferedWriter(new OutputStreamWriter(fsDataOutputStream,StandardCharsets.UTF_8));
        BufferedReader bufferedReader = new BufferedReader(new FileReader(fromPath));
        IOUtils.copy(bufferedReader, bufferedWriter);
        bufferedWriter.close();
        bufferedReader.close();
    }
}
