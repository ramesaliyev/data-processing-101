package org.bigdataproject.core.helpers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class FS {
    public static List<String> listFiles(String path) throws IOException {
        List<String> filePaths = new ArrayList<>();

        Files.walk(Paths.get(path))
            .filter(Files::isRegularFile)
            .forEach(file -> filePaths.add("file:"+file.toString()));

        return filePaths;
    }
}
