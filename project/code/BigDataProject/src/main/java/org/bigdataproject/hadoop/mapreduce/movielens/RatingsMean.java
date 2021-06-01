package org.bigdataproject.hadoop.mapreduce.movielens;

import org.apache.hadoop.io.DoubleWritable;
import org.bigdataproject.core.helpers.Utils;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;

import java.io.IOException;

public class RatingsMean {
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