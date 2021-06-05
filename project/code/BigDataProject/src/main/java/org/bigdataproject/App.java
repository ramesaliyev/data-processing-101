package org.bigdataproject;

import org.bigdataproject.core.api.API;
import org.bigdataproject.core.helpers.Utils;

public class App {
    public static void main(String[] args) throws Exception {
        int defaultPort = 4567;
        int port = Utils.parseInt(Utils.getArg(args, 0)).orElse(defaultPort);

        new API(port);
    }
}
