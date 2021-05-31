package org.bigdataproject.core.job;

import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.JobStatus;

import java.io.IOException;
import java.util.UUID;

public class JobRecord {
    String uuid;
    String key;
    String name;
    String input;
    String output;
    Job job;

    public JobRecord(String key, String name, String input, String output, Job job) {
        this.uuid = UUID.randomUUID().toString();
        this.key = key;
        this.name = name;
        this.input = input;
        this.output = output;
        this.job = job;
    }

    public String getUUID() {
        return uuid;
    }

    public String getKey() {
        return key;
    }

    public String getName() {
        return name;
    }

    public String getInput() {
        return input;
    }

    public String getOutput() {
        return output;
    }

    public JobStatus.State getJobState() {
        try {
            return this.job.getJobState();
        } catch (IOException | InterruptedException ignored) {}

        return null;
    }

    public boolean isJobCompleted() {
        JobStatus.State jobState = this.getJobState();

        if (
            jobState == JobStatus.State.RUNNING ||
            jobState == JobStatus.State.SUCCEEDED ||
            jobState == JobStatus.State.KILLED ||
            jobState == JobStatus.State.FAILED
        ) {
            try {
                return job.isComplete();
            } catch (IOException ignored) {}
        }

        return false;
    }
}
