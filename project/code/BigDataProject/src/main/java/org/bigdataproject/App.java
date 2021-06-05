package org.bigdataproject;

import org.bigdataproject.core.api.API;
import org.bigdataproject.core.helpers.AppConfig;
import org.bigdataproject.core.helpers.Utils;

public class App {
    public static void main(String[] args) throws Exception {
        // Set configurations.
        AppConfig.PORT = Utils.parseInt(Utils.getArg(args, 0)).orElse(AppConfig.PORT);
        AppConfig.HDFSNameNode = Utils.getArg(args, 1).orElse(AppConfig.HDFSNameNode);

        // Start app.
        new API();
    }
}
