# About

## Dataset
MovieLens (9/2018) full dataset used https://grouplens.org/datasets/movielens/latest/. To run project you need to place `links.csv`, `movies.csv`, `tags.csv`, and `ratings.csv` under `volumes/data` folder.

## Initialization

In resourcemanager;
```
hdfs namenode -format
```

## Web UI Ports
- Namenode: http://localhost:8081
- Resource Manager: http://localhost:8082
- Node Manager 1: http://localhost:8083
- Node Manager 2: http://localhost:8084
- Node Manager 3: http://localhost:8085

## Useful
File sharing with containers:
```
/hadoop/host_shared
```

## Run

Compile jar with all dependencies:
```
mvn clean compile assembly:single 
```

Just compile jar:
```
mvn clean package 
```

Copy `bigdataproject.jar` into `resourcemanager`:
```
cp project/code/BigDataProject/target/bigdataproject.jar project/volumes/code
```

Exec into container:
```
docker exec -ti hadoop_resourcemanager /bin/bash
```

Run jar with Hadoop:
```
hadoop jar /hadoop/host_shared/code/bigdataproject.jar org.bigdataproject.WordCountAPI /WordCountTutorial/Input /WordCountTutorial/Output1
```

See outputs:
```
hdfs dfs -cat /WordCountTutorial/Output1/*
```