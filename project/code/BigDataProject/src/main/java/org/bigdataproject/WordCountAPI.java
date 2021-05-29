package org.bigdataproject;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.JobStatus;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import java.io.OutputStream;
import java.net.InetSocketAddress;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.util.StringTokenizer;

class JobHandler {
    Job job;
    String[] args;

    public JobHandler(String[] args) throws Exception {
        this.args = args;
    }

    public void createAndSubmit() throws Exception {
        Configuration conf = new Configuration();
        job = Job.getInstance(conf, "word count");
        job.setJarByClass(WordCountAPI.class);
        job.setMapperClass(WordCountAPI.TokenizerMapper.class);
        job.setCombinerClass(WordCountAPI.IntSumReducer.class);
        job.setReducerClass(WordCountAPI.IntSumReducer.class);
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(IntWritable.class);

        FileInputFormat.addInputPath(job, new Path(args[0]));
        FileOutputFormat.setOutputPath(job, new Path(args[1]));

        //        System.exit(job.waitForCompletion(true) ? 0 : 1);

        job.submit();
    }
}


class APIHandlers {
    static class HandleStart implements HttpHandler {
        JobHandler jobHandler;
        public HandleStart(JobHandler jobHandler) {
            this.jobHandler = jobHandler;
        }

        @Override
        public void handle(HttpExchange t) throws IOException {
            String response;

            try {
                this.jobHandler.createAndSubmit();
                response= "started";
            } catch (Exception e) {
                e.printStackTrace();
                response= "fucked";
            }

            t.sendResponseHeaders(200, response.length());
            OutputStream os = t.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }
    }

    static class HandleInfo implements HttpHandler {
        JobHandler jobHandler;
        public HandleInfo(JobHandler jobHandler) {
            this.jobHandler = jobHandler;
        }

        @Override
        public void handle(HttpExchange t) throws IOException {
            String response = "dont know";

            Job job = this.jobHandler.job;

            try {
                if (
                    job.getJobState() == JobStatus.State.RUNNING ||
                    job.getJobState() == JobStatus.State.SUCCEEDED ||
                    job.getJobState() == JobStatus.State.KILLED ||
                    job.getJobState() == JobStatus.State.FAILED
                ) {
                    try {
                        if (job.isComplete()) {
                            response = "done";
                        } else {
                            response = "in prog kank";
                        }
                    } catch (Exception e) {
                        response = "bok";
                    }
                } else {
                    response = "in prog kank";
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
                response = "cach ception aq";
            }

            t.sendResponseHeaders(200, response.length());
            OutputStream os = t.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }
    }

    static class HandleDummy implements HttpHandler {
        JobHandler jobHandler;
        public HandleDummy(JobHandler jobHandler) {
            this.jobHandler = jobHandler;
        }

        @Override
        public void handle(HttpExchange t) throws IOException {
            String response = "This is the dummy response";
            t.sendResponseHeaders(200, response.length());
            OutputStream os = t.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }
    }
}

class API {
    JobHandler jobHandler;

    public API(JobHandler jobHandler) throws IOException {
        this.jobHandler = jobHandler;

        HttpServer server = HttpServer.create(new InetSocketAddress(4567), 0);
        server.createContext("/start", new APIHandlers.HandleStart(this.jobHandler));
        server.createContext("/info", new APIHandlers.HandleInfo(this.jobHandler));
        server.createContext("/dummy", new APIHandlers.HandleDummy(this.jobHandler));
        server.setExecutor(null); // creates a default executor
        server.start();

        System.out.println("SERVER STARTED");
    }
}


public class WordCountAPI {

    public static class TokenizerMapper
            extends Mapper<Object, Text, Text, IntWritable> {

        private final static IntWritable one = new IntWritable(1);
        private Text word = new Text();

        public void map(Object key, Text value, Context context
        ) throws IOException, InterruptedException {
            StringTokenizer itr = new StringTokenizer(value.toString());
            while (itr.hasMoreTokens()) {
                word.set(itr.nextToken());
                context.write(word, one);
            }
        }
    }

    public static class IntSumReducer
            extends Reducer<Text, IntWritable, Text, IntWritable> {
        private IntWritable result = new IntWritable();

        public void reduce(Text key, Iterable<IntWritable> values,
                           Context context
        ) throws IOException, InterruptedException {
            int sum = 0;
            for (IntWritable val : values) {
                sum += val.get();
            }
            result.set(sum);
            context.write(key, result);
        }
    }

    public static void main(String[] args) throws Exception {
        new API(new JobHandler(args));
    }
}