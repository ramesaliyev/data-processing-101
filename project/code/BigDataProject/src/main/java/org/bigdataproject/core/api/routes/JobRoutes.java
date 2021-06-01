package org.bigdataproject.core.api.routes;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import org.bigdataproject.core.api.server.Request;
import org.bigdataproject.core.api.server.Response;
import org.bigdataproject.core.api.server.Server;
import org.bigdataproject.core.job.JobCatalog;
import org.bigdataproject.core.job.JobRecord;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

public class JobRoutes {
    public HashMap<String, JobRecord> jobRecords = new HashMap<>();

    public JobRoutes(Server server) {
        server.get("/job/start", this::routeStartJob);
        server.get("/job/info", this::routeGetJobInfo);
        server.get("/job/isCompleted", this::routeIsJobCompleted);
        server.get("/job/list", this::routeListJobs);
    }

    public void routeStartJob(Request req, Response res) {
        String name = req.params.get("name");
        String key = req.params.get("key");
        String input = req.params.get("input");
        String output = req.params.get("output");

        JobRecord jobRecord = new JobRecord();
        output += "/" + jobRecord.getUUID();

        Configuration conf = new Configuration();
        conf.set("mapred.textoutputformat.separator", ",");

        try {
            Job job = Job.getInstance(conf, name);

            JobCatalog.configJobOfKey(key, job);

            FileInputFormat.addInputPath(job, new Path(input));
            FileOutputFormat.setOutputPath(job, new Path(output));

            job.submit();

            jobRecord.setDetails(key, name, input, output, job);
            this.jobRecords.put(jobRecord.getUUID(), jobRecord);

            res.send(jobRecord.getUUID());
        } catch (IOException | InterruptedException | ClassNotFoundException e) {
            res.sendError(e);
            e.printStackTrace();
        }
    }

    public void routeIsJobCompleted(Request req, Response res) {
        JobRecord jobRecord = this.jobRecords.get(req.params.get("uuid"));
        res.send(jobRecord.isJobCompleted() ? "true" : "false");
    }

    public void routeGetJobInfo(Request req, Response res) {
        JobRecord jobRecord = this.jobRecords.get(req.params.get("uuid"));

        String responseText =
            "uuid:" + jobRecord.getUUID() + "\n" +
            "key:" + jobRecord.getKey() + "\n" +
            "name:" + jobRecord.getName() + "\n" +
            "input:" + jobRecord.getInput() + "\n" +
            "output:" + jobRecord.getOutput() + "\n" +
            "state:" + jobRecord.getJobState() + "\n" +
            "done:" + (jobRecord.isJobCompleted() ? "true" : "false") + "\n";

        res.send(responseText);
    }

    public void routeListJobs(Request req, Response res) {
        ArrayList<JobRecord> jobRecords = new ArrayList<>(this.jobRecords.values());
        StringBuilder responseText = new StringBuilder();

        for (JobRecord jobRecord : jobRecords) {
            responseText.append(jobRecord.getUUID()).append("\n");

        }

        res.send(responseText.toString());
    }
}
