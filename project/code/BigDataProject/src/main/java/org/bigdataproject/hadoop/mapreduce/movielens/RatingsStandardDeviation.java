package org.bigdataproject.hadoop.mapreduce.movielens;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;
import java.util.ArrayList;

public class RatingsStandardDeviation {
    public static Class<?> OutputKeyClass = IntWritable.class;
    public static Class<?> OutputValueClass = DoubleWritable.class;

    public static class JobMapper extends BaseRatingsMapper {}

    public static class JobReducer extends Reducer<IntWritable, DoubleWritable, IntWritable, DoubleWritable> {
        public void reduce(IntWritable key, Iterable<DoubleWritable> values, Context context) throws IOException, InterruptedException {

            // Convert to ArrayList
            ArrayList<Double> valueList = new ArrayList<>();
            values.iterator().forEachRemaining((DoubleWritable value) -> valueList.add(value.get()));

            // Find mean.
            double sum = valueList.stream().mapToDouble(a -> a).sum();
            double mean = sum / valueList.size();

            // Calculate standard deviation.
            double sumOfSquares = valueList.stream()
                .mapToDouble(a -> Math.pow(mean - a, 2)).sum();

            double variance = sumOfSquares / (valueList.size() - 1);
            double standardDeviation = Math.sqrt(variance);

            context.write(key, new DoubleWritable(standardDeviation));
        }
    }
}
