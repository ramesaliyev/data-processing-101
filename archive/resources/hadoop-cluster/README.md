This installation tested with Ubuntu 20.04 in:
* [Multipass](https://multipass.run/) on macOS.
* [Hetzner](https://www.hetzner.com/) CX21 Servers.

# Setup

## 1. System Installation

Create 3 Ubuntu VM instance to use as nodes. Apply steps below to all of them.

**Step 1:** Configure hostnames as below:

- *hmaster*
- *hworker1*
- *hworker2*

Modify `/etc/hosts` files on each node and your local machine, add configurations:

```
192.168.64.5 hmaster
192.168.64.6 hworker1
192.168.64.7 hworker2
```

> - Change ip adresses with your own.
> - Maybe Private Network IP addresses could be used here (not tested).

Note that ip addresses like `127.0.1.1` could cause problems. So remove them from hosts file if they exist for hostnames given above.

**Step 2:** Create non-root user with sudo privileges. In this walkthrough, default non-root user `ubuntu` will be used.

**Step 3:** Update Ubuntu.

```
sudo apt-get update && sudo apt-get -y dist-upgrade
```

**Step 4:** Install Java.

```
sudo apt-get -y install openjdk-8-jdk-headless
```

## 2. SSH Setup

The master node will use an SSH connection to connect to other nodes with key-pair authentication. This will allow the master node to actively manage the cluster.

**Step 1:** `{on master node}` Generate SSH key.

```
ssh-keygen -b 4096
```
> Leave the password field blank.

**Step 2:** Copy master's key file into the authorized keys of its own.

```
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
```

**Step 3:** Print out and copy generated SSH key to clipboard.

```
cat ~/.ssh/id_rsa.pub
```

**Step 4:** `{on worker nodes}` Create `master.pub` in the `~/.ssh` directory and paste your public key into this file and save your changes.

```
touch ~/.ssh/master.pub
```

**Step 5:** Copy master's key file into the authorized key store of worker.

```
cat ~/.ssh/master.pub >> ~/.ssh/authorized_keys
```

**Step 6:** `{on master node}` Edit `~/.ssh/config` file and add following configs:

```
Host hmaster
    HostName hmaster
    User ubuntu
    IdentityFile ~/.ssh/id_rsa

Host hworker1
    HostName hworker1
    User ubuntu
    IdentityFile ~/.ssh/id_rsa

Host hworker2
    HostName hworker2
    User ubuntu
    IdentityFile ~/.ssh/id_rsa
```

> * Change the values of `Host`, `Hostname`, and `User` of each record if you're using different ones.

**Step 7:** `{from master node}` SSH into each worker node and master node itself.

```
ssh ubuntu@hmaster
ssh ubuntu@hworker1
ssh ubuntu@hworker2
```

> Reply `yes` when it asks `Are you sure you want to continue connecting (yes/no/[fingerprint])?`.
> Use `logout` command after each SSH connection to return master node.

## 3. Download Hadoop 

Visit [Apache Hadoop Download](http://hadoop.apache.org/releases.html) page and pick a version you want to install. Then navigate to `binary` link and get url with `.tar.gz`. At this time most recent one is `3.3.0`, so we will be using it.

**Step 1:** `{on master node}` Create home folder for hadoop installation and navigate into it.

```
mkdir ~/hadoop && cd ~/hadoop
```

> Also create same home folder for hadoop in other worker nodes; `mkdir ~/hadoop`

**Step 2:** Download binaries for selected version of hadoop.

```
wget https://ftp.itu.edu.tr/Mirror/Apache/hadoop/common/hadoop-3.3.0/hadoop-3.3.0.tar.gz
```

**Step 3:** Unzip the file’s contents using `tar`:

```
tar xvzf hadoop-3.3.0.tar.gz
```

**Step 4:** Copy tar to worker nodes:

```
scp ~/hadoop/hadoop-3.3.0.tar.gz hworker1:/home/ubuntu/hadoop/hadoop-3.3.0.tar.gz
scp ~/hadoop/hadoop-3.3.0.tar.gz hworker2:/home/ubuntu/hadoop/hadoop-3.3.0.tar.gz
```

**Step 5:** Extract tar in worker nodes and then you can remove tar files from all nodes.

```
rm ~/hadoop/hadoop-3.3.0.tar.gz
```

## 4. Configure Environment

**Step 1:** `{on each node}` Add Hadoop binaries to your PATH. Edit `~/.profile` and add the followings:

```
HADOOP_HOME="$HOME/hadoop/hadoop-3.3.0"
PATH="$HADOOP_HOME/bin:$HADOOP_HOME/sbin:$PATH"
```

**Step 2:** Add Hadoop binaries to your PATH for the shell. Edit `~/.bashrc` and add the followings:

```
export HADOOP_HOME=${HOME}/hadoop/hadoop-3.3.0
export PATH=${PATH}:${HADOOP_HOME}/bin:${HADOOP_HOME}/sbin
```

> Source your .bashrc (`source ~/.bashrc`) if you need to, test variables like `echo $HADOOP_HOME`.

## 5. Configure Hadoop Environment

**Step 1:** `{on master node}` Update `JAVA_HOME` in `$HADOOP_HOME/etc/hadoop/hadoop-env.sh` add following line:

```
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
```

> Now if you type `hadoop` into console you need to see usage help.

**Step 2:** Add user's name to `$HADOOP_HOME/etc/hadoop/hadoop-env.sh`

```
export HDFS_NAMENODE_USER="ubuntu"
export HDFS_DATANODE_USER="ubuntu"
export HDFS_SECONDARYNAMENODE_USER="ubuntu"
export YARN_RESOURCEMANAGER_USER="ubuntu"
export YARN_NODEMANAGER_USER="ubuntu"
```

**Step 3:** Source `hadoop-env.sh` file to apply changes.

```
source $HADOOP_HOME/etc/hadoop/hadoop-env.sh
```

**Step 4:** `{on each node}` Create a data directory for the `Hadoop Distributed File System (HDFS)` to store all relevant HDFS files.

```
sudo mkdir -p /usr/local/hadoop/hdfs/data
sudo mkdir -p /usr/local/hadoop/hdfs/name
```

**Step 5:** Set the permissions for this file with your respective user.

```
sudo chown -R ubuntu:ubuntu /usr/local/hadoop/hdfs/data
sudo chown -R ubuntu:ubuntu /usr/local/hadoop/hdfs/name
```

## 6. Configure Hadoop Settings

All these configurations will be done on `{master node}`, then when we done, we will copy these configuration files and `hadoop-env.sh` file into other `{worker nodes}`.

**Step 1:** Edit `$HADOOP_HOME/etc/hadoop/core-site.xml`

```
<configuration>
    <property>
      <name>fs.defaultFS</name>
      <value>hdfs://hmaster:9000</value>
    </property>
    <property>
      <name>fs.default.name</name>
      <value>hdfs://hmaster:9000</value>
    </property>
</configuration>
```

**Step 2:** Edit `$HADOOP_HOME/etc/hadoop/hdfs-site.xml`

```
<configuration>
  <property>
    <name>dfs.replication</name>
    <value>2</value>
  </property>
  <property>
    <name>dfs.namenode.name.dir</name>
    <value>file:///usr/local/hadoop/hdfs/name</value>
  </property>
  <property>
    <name>dfs.datanode.data.dir</name>
    <value>file:///usr/local/hadoop/hdfs/data</value>
  </property>
</configuration>
```

> `dfs.replication`, indicates how many times data is replicated in the cluster, don’t enter a value higher than the actual number of worker nodes.

**Step 3:** Edit `$HADOOP_HOME/etc/hadoop/mapred-site.xml`

```
<configuration>
  <property>
    <name>mapreduce.jobtracker.address</name>
    <value>hmaster:54311</value>
  </property>
  <property>
    <name>mapreduce.framework.name</name>
    <value>yarn</value>
  </property>
  <property>
    <name>yarn.app.mapreduce.am.env</name>
    <value>HADOOP_MAPRED_HOME=$HADOOP_HOME</value>
  </property>
  <property>
    <name>mapreduce.map.env</name>
    <value>HADOOP_MAPRED_HOME=$HADOOP_HOME</value>
  </property>
  <property>
    <name>mapreduce.reduce.env</name>
    <value>HADOOP_MAPRED_HOME=$HADOOP_HOME</value>
  </property>
</configuration>
```

**Step 4:** Edit `$HADOOP_HOME/etc/hadoop/yarn-site.xml`

```
<configuration>
  <property>
    <name>yarn.acl.enable</name>
    <value>0</value>
  </property>
  <property>
    <name>yarn.resourcemanager.hostname</name>
    <value>192.168.64.5</value>
  </property>
  <property>
    <name>yarn.nodemanager.aux-services</name>
    <value>mapreduce_shuffle</value>
  </property>
  <property>
    <name>yarn.nodemanager.aux-services.mapreduce.shuffle.class</name>
    <value>org.apache.hadoop.mapred.ShuffleHandler</value>
  </property>
</configuration>
```

> In the value field for the yarn.resourcemanager.hostname, replace `192.168.64.5` with the **public IP** address of master node.

**Step 5:** Configure workers, edit `$HADOOP_HOME/etc/hadoop/workers` 

```
hworker1
hworker2
```

**Step 6:** Configure masters, edit `$HADOOP_HOME/etc/hadoop/masters` 

```
hmaster
```

## 7. Configure Hadoop RAM Usage

Memory allocation can be tricky on low RAM nodes because default values are not suitable for nodes with less than 8GB of RAM. We'll configure nodes for 2GB RAM. For detailed explanation check links in resources.

**Step 4:** Add to `$HADOOP_HOME/etc/hadoop/yarn-site.xml`

```
<property>
  <name>yarn.nodemanager.resource.memory-mb</name>
  <value>1536</value>
</property>
<property>
  <name>yarn.scheduler.maximum-allocation-mb</name>
  <value>1536</value>
</property>
<property>
  <name>yarn.scheduler.minimum-allocation-mb</name>
  <value>128</value>
</property>
<property>
  <name>yarn.nodemanager.vmem-check-enabled</name>
  <value>false</value>
</property>
```

**Step 5:** Add to `$HADOOP_HOME/etc/hadoop/mapred-site.xml`

```
<property>
  <name>yarn.app.mapreduce.am.resource.mb</name>
  <value>512</value>
</property>
<property>
  <name>mapreduce.map.memory.mb</name>
  <value>256</value>
</property>
<property>
  <name>mapreduce.reduce.memory.mb</name>
  <value>256</value>
</property>
```

## 8. Copy Hadoop Settings

**Step 1:** `{on master node}` Copy the Hadoop configuration files to the worker nodes:

```
for node in hworker1 hworker2; do
  scp $HADOOP_HOME/etc/hadoop/* $node:$HADOOP_HOME/etc/hadoop/;
done
```

**Step 2:** `{on worker nodes}` Source `hadoop-env.sh` file to apply changes.

```
source $HADOOP_HOME/etc/hadoop/hadoop-env.sh
```

> Not sure if you need to do this on system restart. Probably not.

## 9. Run and Monitor HDFS

**Step 1:** `{on master node}` Format HDFS:

```
hdfs namenode -format
```

**Step 2:** Run and monitor HDFS

```
start-dfs.sh
```

* This will start **NameNode** and **SecondaryNameNode** on master, and **DataNode** on workers
* Use `jps` command on each node to check if everything ok.
* To stop HDFS on master and worker nodes `stop-dfs.sh` could be used.
* Use `hdfs dfsadmin -report` to see node status on console.
* Navigate to http://hmaster:9870 to see Web UI.

## 10. Run and Monitor YARN

**Step 1:** `{on master node}` Start YARN:

```
start-yarn.sh
```

* This will start **ResourceManager** on master, and **NodeManager** on workers
* Use `jps` command on each node to check if everything ok.
* To stop HDFS on master and worker nodes `stop-yarn.sh` could be used.
* Use `yarn node -list` to see running nodes.
* Use `yarn application -list` to see running applications.
* Navigate to http://hmaster:8088 to see Web UI.

## 11. Troubleshooting

> [main] INFO  org.apache.hadoop.ipc.Client - Retrying connect to server: 0.0.0.0/0.0.0.0:10020. Already tried 0 time(s); retry policy is RetryUpToMaximumCountWithFixedSleep(maxRetries=10, sleepTime=1 SECONDS)
```
mr-jobhistory-daemon.sh start historyserver
```

## 12. Test Hadoop

To test hadoop we'll use simply word-count example.

**Step 1:** `{on master node}` Create working directory:

```
mkdir -p ~/hadoop-test/input_data
mkdir -p ~/hadoop-test/java_classes
```

**Step 2:** Fetch some books from the Gutenberg project as input data:

```
cd ~/hadoop-test/input_data
wget -O alice.txt https://www.gutenberg.org/files/11/11-0.txt
wget -O holmes.txt https://www.gutenberg.org/files/1661/1661-0.txt
wget -O frankenstein.txt https://www.gutenberg.org/files/84/84-0.txt
```

**Step 3:** Export HADOOP_CLASSPATH

```
export HADOOP_CLASSPATH=$(hadoop classpath)
```

**Step 4:** Create directory on HDFS and put files in it:

```
hdfs dfs -mkdir /WordCountTutorial
hdfs dfs -mkdir /WordCountTutorial/Input
hdfs dfs -put alice.txt holmes.txt frankenstein.txt /WordCountTutorial/Input
```

**Step 5:** Copy `WordCount.java` under working directory and Compile `WordCount.jar`

```
javac -classpath ${HADOOP_CLASSPATH} -d ~/hadoop-test/java_classes ~/hadoop-test/WordCount.java
jar -cvf WordCount.jar -C ~/hadoop-test/java_classes/ .
```

**Step 6:** Run Hadoop MapReduce job

```
hadoop jar ~/hadoop-test/WordCount.jar WordCount /WordCountTutorial/Input /WordCountTutorial/Output
```

**Step 7:** See Outputs

```
hdfs dfs -cat /WordCountTutorial/Output/*
```

# Resources

- [Linode - How to Install and Set Up a 3-Node Hadoop Cluster](https://www.linode.com/docs/guides/how-to-install-and-set-up-hadoop-cluster/)
- [DigitalOcean - How To Spin Up a Hadoop Cluster with DigitalOcean Droplets](https://www.digitalocean.com/community/tutorials/how-to-spin-up-a-hadoop-cluster-with-digitalocean-droplets)
- [How to run Word Count example on Hadoop MapReduce](https://www.youtube.com/watch?v=6sK3LDY7Pp4)