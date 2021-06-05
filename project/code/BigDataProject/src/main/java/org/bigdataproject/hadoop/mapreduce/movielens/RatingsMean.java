package org.bigdataproject.hadoop.mapreduce.movielens;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;

public class RatingsMean {
    public static Class<?> OutputKeyClass = IntWritable.class;
    public static Class<?> OutputValueClass = DoubleWritable.class;

    public static class JobMapper extends BaseRatingsMapper {}

    public static class JobReducer extends Reducer<IntWritable, DoubleWritable, IntWritable, DoubleWritable> {
        public void reduce(IntWritable key, Iterable<DoubleWritable> values, Context context) throws IOException, InterruptedException {
            double sum = 0;
            int length = 0;

            for (DoubleWritable val : values) {
                sum += val.get();
                length++;
            }

            context.write(key, new DoubleWritable(sum / length));
        }
    }
}
