package org.bigdataproject.hadoop.mapreduce.movielens;

import org.bigdataproject.core.helpers.Utils;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;
import java.util.*;

public class RatingsMode {
    public static Class<?> OutputKeyClass = IntWritable.class;
    public static Class<?> OutputValueClass = DoubleWritable.class;

    public static class JobMapper extends Mapper<Object, Text, IntWritable, DoubleWritable> {
        public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
            String[] columns = value.toString().split(",");

            String movieIdColumn = columns[1].trim();
            String ratingColumn = columns[2].trim();

            if (Utils.isNumeric(movieIdColumn) && Utils.isNumeric(ratingColumn)) {
                int movieId = Integer.parseInt(movieIdColumn);
                double rating = Double.parseDouble(ratingColumn);

                context.write(new IntWritable(movieId), new DoubleWritable(rating));
            }
        }
    }

    public static class JobReducer extends Reducer<IntWritable, DoubleWritable, IntWritable, DoubleWritable> {
        public void reduce(IntWritable key, Iterable<DoubleWritable> values, Context context) throws IOException, InterruptedException {

            // Count occurrences.
            Map<Double, Integer> occurrences = new HashMap<>();

            for (DoubleWritable val : values) {
                double value = val.get();
                int count = Optional.ofNullable(occurrences.get(value)).orElse(0);
                occurrences.put(value, count + 1);
            }

            // Find mode.
            double mode = Collections.max(
                occurrences.entrySet(),
                Map.Entry.comparingByValue()
            ).getKey();

            context.write(key, new DoubleWritable(mode));
        }
    }
}
