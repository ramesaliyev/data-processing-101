package org.bigdataproject.core.job;

import org.apache.hadoop.mapreduce.Job;
import org.bigdataproject.hadoop.mapreduce.movielens.RatingsMean;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class JobCatalog {
    public static void configJobOfKey(String key, Job job) {
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
}