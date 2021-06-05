package org.bigdataproject.hadoop.mapreduce.movielens;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
import org.bigdataproject.core.helpers.Utils;

import java.io.IOException;

public class BaseRatingsMapper extends Mapper<Object, Text, IntWritable, DoubleWritable> {
    public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
        String[] columns = value.toString().split(",");

        if (columns.length >= 3) {
            String movieIdColumn = columns[1].trim();
            String ratingColumn = columns[2].trim();

            if (Utils.isNumeric(movieIdColumn) && Utils.isNumeric(ratingColumn)) {
                int movieId = Integer.parseInt(movieIdColumn);
                double rating = Double.parseDouble(ratingColumn);

                context.write(new IntWritable(movieId), new DoubleWritable(rating));
            }
        }
    }
}