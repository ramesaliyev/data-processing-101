package org.bigdataproject.core.helpers;

import java.util.Optional;

public class Utils {
    public static boolean isNumeric(String str) {
        try {
            Double.parseDouble(str);
            return true;
        } catch(NumberFormatException e){
            return false;
        }
    }

    public static Optional<Integer> parseInt(String toParse) {
        try {
            return Optional.of(Integer.parseInt(toParse));
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
    }

    public static Optional<Integer> parseInt(Optional<String> toParse) {
        try {
            return Optional.of(Integer.parseInt(String.valueOf(toParse)));
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
    }

    public static Optional<String> getArg(String[] args, int index) {
        try {
            return Optional.of(args[index]);
        } catch (ArrayIndexOutOfBoundsException e) {
            return Optional.empty();
        }
    }
}
