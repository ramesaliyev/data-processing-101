# About

## Dataset
MovieLens (9/2018) full dataset used https://grouplens.org/datasets/movielens/latest/. To run project you need to place `links.csv`, `movies.csv`, `tags.csv`, and `ratings.csv` directly under `volumes/data` folder. Then you can load them into HDFS from WebUI.

## First Hadoop Initialization

Start docker-compose;
```
docker-compose up
```

Bash into resourcemanager:
```
docker exec -ti hadoop_resourcemanager /bin/bash
```

Format HDFS:
```
hdfs namenode -format
```

Following Hadoop screens will be available; 
- Namenode: http://localhost:8081
- Resource Manager: http://localhost:8082
- Node Manager 1: http://localhost:8083

> For regular initializations just run `docker-compose up`.

Files placed under `volumes/` will be available in `/hadoop/host_shared` within containers.

## Run Project

> Open project with IntelliJIDEA or something.

Compile jar:
```
mvn clean package 
```

When compilation done, make `bigdataproject.jar` available in containers:
```
cp project/code/BigDataProject/target/bigdataproject.jar project/volumes/code
```

Bash into `resourcemanager`:
```
docker exec -ti hadoop_resourcemanager /bin/bash
```

In `resourcemanager` run jar with Hadoop:
```
hadoop jar /hadoop/host_shared/code/bigdataproject.jar org.bigdataproject.App 4567
```
> 4567 is the port number, default is: 4567. also remember to expose port number from docker-compose.

Navigate into `webui` folder and first Build then start WebUI:
```
npm install
npm run build

npm install -g serve
serve -s build
```

See WebUI at http://localhost:3000

> To understand how whole application operates you can examine API calls or read code.

# Help

See outputs from HDFS:
```
hdfs dfs -cat /path/*
```

Compile jar with all dependencies:
```
mvn clean compile assembly:single 
```