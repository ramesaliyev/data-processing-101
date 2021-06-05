package org.bigdataproject.hadoop.mapreduce.movielens;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;

public class RatingsRange {
    public static Class<?> OutputKeyClass = IntWritable.class;
    public static Class<?> OutputValueClass = DoubleWritable.class;

    public static class JobMapper extends BaseRatingsMapper {}

    public static class JobReducer extends Reducer<IntWritable, DoubleWritable, IntWritable, DoubleWritable> {
        public void reduce(IntWritable key, Iterable<DoubleWritable> values, Context context) throws IOException, InterruptedException {

            // Count min and max.
            double max = Double.MIN_VALUE;
            double min = Double.MAX_VALUE;

            for (DoubleWritable val : values) {
                double value = val.get();
                max = Math.max(max, value);
                min = Math.min(min, value);
            }

            context.write(key, new DoubleWritable(max - min));
        }
    }
}
