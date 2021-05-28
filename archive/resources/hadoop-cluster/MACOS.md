Hadoop Setup In The Pseudo-distributed Mode (Mac OS)

> Taken from https://stackoverflow.com/a/51905683

# Setup

## 1. Install

```
brew install hadoop
```

See version
```
hadoop version
```
Will dump something like;
```
Hadoop 3.3.0
Source code repository https://gitbox.apache.org/repos/asf/hadoop.git -r aa96f1871bfd858f9bac59cf2a81ec470da649af
Compiled by brahma on 2020-07-06T18:44Z
Compiled with protoc 3.7.1
From source with checksum 5dc29b802d6ccd77b262ef9d04d19c4
This command was run using /usr/local/Cellar/hadoop/3.3.0/libexec/share/hadoop/common/hadoop-common-3.3.0.jar
```

## 2. Config

Go to relevant directory;
```
cd /usr/local/Cellar/hadoop/3.3.0/libexec/etc/hadoop/
```

Edit `hadoop-env.sh`, replace following configs;

```
export HADOOP_OPTS="$HADOOP_OPTS -Djava.net.preferIPv4Stack=true -Djava.security.krb5.realm= -Djava.security.krb5.kdc="
export JAVA_HOME=/Library/Java/JavaVirtualMachines/amazon-corretto-8.jdk/Contents/Home
```

> You need Java 1.8

Edit `core-site.xml`

```
 <configuration>
    <property>
        <name>hadoop.tmp.dir</name>
        <value>/usr/local/Cellar/hadoop/hdfs/tmp</value>
        <description>A base for other temporary directories.</description>
    </property>
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://localhost:8020</value>
    </property>
</configuration>
```

Edit `mapred-site.xml`, remember to change user homedir path.

```
<configuration>
    <property>
        <name>mapreduce.framework.name</name>
        <value>yarn</value>
    </property>
    <property>
        <name>yarn.app.mapreduce.am.env</name>
        <value>HADOOP_MAPRED_HOME=/Users/ramesaliyev/hadoop</value>
    </property>
    <property>
        <name>mapreduce.map.env</name>
        <value>HADOOP_MAPRED_HOME=/Users/ramesaliyev/hadoop</value>
    </property>
    <property>
        <name>mapreduce.reduce.env</name>
        <value>HADOOP_MAPRED_HOME=/Users/ramesaliyev/hadoop</value>
    </property>
</configuration>
```

Edit `hdfs-site.xml`

```
<configuration>
    <property>
        <name>dfs.replication</name>
        <value>1</value>
    </property>
</configuration> 
```

Edit `yarn-site.xml`

```
<configuration>
    <property>
        <name>yarn.nodemanager.aux-services</name>
        <value>mapreduce_shuffle</value>
    </property>
    <property>
        <name>yarn.nodemanager.aux-services.mapreduce_shuffle.class</name>
        <value>org.apache.hadoop.mapred.ShuffleHandler</value>
    </property>
</configuration>
```

## 3. SSH

Setup a pass-phraseless SSH if you dont have already;
```
ssh-keygen -t rsa -P ''
```

Authorize the generated SSH keys:
```
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
```

**Enable Remote Login** in `System Preferences -> Sharing`, Just check “Remote Login”. Then test ssh at localhost: It should not prompt for a password. If it does, try to add it to ssh-agent. 

```
ssh localhost
```

4. Initialization

Format the distributed file system.

```
hdfs namenode -format
```

Add aliases to `~/.zshrc` (or `~/.bash_profile`) start and stop Hadoop Daemons;

```
alias hstart="/usr/local/Cellar/hadoop/3.3.0/sbin/start-all.sh"
alias hstop="/usr/local/Cellar/hadoop/3.3.0/sbin/stop-all.sh"
```

```
source ~/.zshrc
```

Start Hadoop using alias;
```
hstart
```

- Hadoop NameNode: http://localhost:9870/
- Cluster Information: http://localhost:8042/
- Hadoop Node: http://localhost:9864/datanode.html

Stop hadoop using alias
```
hstop
```