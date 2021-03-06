package org.bigdataproject.core.job;

import org.apache.hadoop.mapreduce.Job;
import org.bigdataproject.hadoop.mapreduce.movielens.RatingsMean;
import org.bigdataproject.hadoop.mapreduce.movielens.RatingsMedian;
import org.bigdataproject.hadoop.mapreduce.movielens.RatingsMode;
import org.bigdataproject.hadoop.mapreduce.movielens.RatingsRange;
import org.bigdataproject.hadoop.mapreduce.movielens.RatingsStandardDeviation;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class JobCatalog {
    public static void applyJobConfiguration(String key, Job job) {
        try {
            Method method = JobCatalog.class.getMethod("config" + key, Job.class);
            method.invoke(null, job);
        } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
        }
    }

    public static void configRatingsMean(Job job) {
        job.setJarByClass(RatingsMean.class);
        job.setMapperClass(RatingsMean.JobMapper.class);
        job.setReducerClass(RatingsMean.JobReducer.class);
        job.setOutputKeyClass(RatingsMean.OutputKeyClass);
        job.setOutputValueClass(RatingsMean.OutputValueClass);
    }

    public static void configRatingsMedian(Job job) {
        job.setJarByClass(RatingsMedian.class);
        job.setMapperClass(RatingsMedian.JobMapper.class);
        job.setReducerClass(RatingsMedian.JobReducer.class);
        job.setOutputKeyClass(RatingsMedian.OutputKeyClass);
        job.setOutputValueClass(RatingsMedian.OutputValueClass);
    }

    public static void configRatingsMode(Job job) {
        job.setJarByClass(RatingsMode.class);
        job.setMapperClass(RatingsMode.JobMapper.class);
        job.setReducerClass(RatingsMode.JobReducer.class);
        job.setOutputKeyClass(RatingsMode.OutputKeyClass);
        job.setOutputValueClass(RatingsMode.OutputValueClass);
    }

    public static void configRatingsRange(Job job) {
        job.setJarByClass(RatingsRange.class);
        job.setMapperClass(RatingsRange.JobMapper.class);
        job.setReducerClass(RatingsRange.JobReducer.class);
        job.setOutputKeyClass(RatingsRange.OutputKeyClass);
        job.setOutputValueClass(RatingsRange.OutputValueClass);
    }

    public static void configRatingsStandardDeviation(Job job) {
        job.setJarByClass(RatingsStandardDeviation.class);
        job.setMapperClass(RatingsStandardDeviation.JobMapper.class);
        job.setReducerClass(RatingsStandardDeviation.JobReducer.class);
        job.setOutputKeyClass(RatingsStandardDeviation.OutputKeyClass);
        job.setOutputValueClass(RatingsStandardDeviation.OutputValueClass);
    }
}
