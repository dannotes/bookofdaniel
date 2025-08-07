+++
title = "Installing Kafka and Kafka Connect on Seperate Servers"
date = '2024-09-12T13:46:20+05:30'
categories= ['Tech']
draft = false # draft or not
+++
Installing Kafka and Kafka Connect on separate servers allows for better resource management, especially in production environments where Kafka brokers and Connectors may need dedicated hardware. This guide will walk you through the steps to set up Kafka and Kafka Connect on separate Linux servers, using Ubuntu 24.04.


### Prerequisites

- **Two Linux machines** (Ubuntu 24.04)
- **Inbound ports opened** on both servers:
  - Kafka broker ports: 9092, 9093
  - Kafka Connect REST port: 8083
- **Java 11 (OpenJDK)** installed on both servers

### Step 1: Set Up Kafka on the First Server

1. **Set the hostname** for the Kafka server:
   ```bash
   sudo hostnamectl set-hostname kafka-server
   sudo nano /etc/hosts
   ```
   Replace `127.0.1.1` with your new hostname.


2. **Install necessary updates**:
   Update and upgrade your server with:
   ```bash
   sudo apt update && sudo apt upgrade
   ```
   
   Reboot the server to apply changes:
   ```bash
   sudo reboot
   ```

3. **Install OpenJDK**:
   Kafka requires Java to run. Install OpenJDK 11:
   ```bash
   sudo apt install openjdk-11-jdk -y
   ```
   Verify the installation:
   ```bash
   java -version
   ```

4. **Download and Extract Kafka**:
   Download Kafka from the official site:
   ```bash
   wget https://dlcdn.apache.org/kafka/3.8.0/kafka_2.13-3.8.0.tgz
   tar -xzf kafka_2.13-3.8.0.tgz
   sudo mv kafka_2.13-3.8.0 /opt/kafka
   ```

5. **Create a Kafka User and Group**:
   For better management, create a dedicated service account:
   ```bash
   sudo groupadd kafka
   sudo useradd -r -g kafka -d /opt/kafka -s /bin/false kafka
   sudo chown -R kafka:kafka /opt/kafka
   ```

6. **Configure Kafka**:
   Kafka stores logs in `/tmp` by default. To make management easier, move the logs to `/var/log/kafka`:
   ```bash
   sudo mkdir -p /var/log/kafka
   sudo chown -R kafka:kafka /var/log/kafka
   sudo chmod -R 755 /var/log/kafka
   ```

7. **Edit the Kafka Configuration**:
   Update the `server.properties` file to listen on all interfaces:
   ```bash
   sudo nano /opt/kafka/config/kraft/server.properties
   ```
   Add the following lines:
   ```
   listeners=PLAINTEXT://0.0.0.0:9092
   advertised.listeners=PLAINTEXT://<Kafka_Server_IP>:9092
   log.dirs=/var/log/kafka
   ```

8. **Format the Log Directory**: Change directory to Kafka folder and
   format the storage with a unique cluster ID:
   ```bash
   cd /opt/kafka
   KAFKA_CLUSTER_ID="$(bin/kafka-storage.sh random-uuid)"
   sudo -u kafka bin/kafka-storage.sh format -t $KAFKA_CLUSTER_ID -c config/kraft/server.properties
   ```

9. **Set Up Kafka as a Systemd Service**:
   Create a service file:
   ```bash
   sudo nano /etc/systemd/system/kafka.service
   ```
   Add the following content:
   ```
   [Unit]
   Description=Apache Kafka Server (KRaft Mode)
   After=network.target

   [Service]
   User=kafka
   Group=kafka
   ExecStart=/opt/kafka/bin/kafka-server-start.sh /opt/kafka/config/kraft/server.properties
   ExecStop=/opt/kafka/bin/kafka-server-stop.sh
   Restart=on-failure
   RestartSec=10

   [Install]
   WantedBy=multi-user.target
   ```

   Enable and start the Kafka service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl start kafka
   sudo systemctl enable kafka
   sudo systemctl status kafka
   ```

### Step 2: Set Up Kafka Connect on the Second Server

1. **Install necessary updates**:
   Update and upgrade your server with:
   ```bash
   sudo apt update && sudo apt upgrade
   ```
   
   Reboot the server to apply changes:
   ```bash
   sudo reboot
   ```

2. **Install Java on Kafka Connect Server**:
   Just like with the Kafka server, install Java:
   ```bash
   sudo apt install openjdk-11-jdk -y
   java -version
   ```

3. **Download and Extract Kafka Connect**:
   Kafka Connect is part of the Kafka package, so download Kafka here too:
   ```bash
   wget https://dlcdn.apache.org/kafka/3.8.0/kafka_2.13-3.8.0.tgz
   tar -xzf kafka_2.13-3.8.0.tgz
   sudo mv kafka_2.13-3.8.0 /opt/kafka
   ```

4. **Configure Kafka Connect**:
   Edit the `connect-distributed.properties` file to configure Kafka Connect:
   ```bash
   sudo nano /opt/kafka/config/connect-distributed.properties
   ```
   Update the plugin path:
   ```
   plugin.path=/opt/kafka/connectors
   bootstrap.servers=<Kafka_Server_IP>:9092
   ```

5. **Create a Connectors Directory**:
   Create a directory for Kafka Connect plugins:
   ```bash
   sudo mkdir /opt/kafka/connectors
   sudo chown kafka:kafka /opt/kafka/connectors
   ```

6. **Set Up Kafka Connect as a Systemd Service**:
   Create a service file:
   ```bash
   sudo nano /etc/systemd/system/kafka-connect.service
   ```
   Add the following content:
   ```
   [Unit]
   Description=Kafka Connect Distributed Mode Service
   After=network.target

   [Service]
   User=kafka
   Group=kafka
   ExecStart=/opt/kafka/bin/connect-distributed.sh /opt/kafka/config/connect-distributed.properties
   Restart=on-failure
   RestartSec=10
   Environment="KAFKA_HEAP_OPTS=-Xmx1G -Xms1G"

   [Install]
   WantedBy=multi-user.target
   ```

   Enable and start the Kafka Connect service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl start kafka-connect
   sudo systemctl enable kafka-connect
   sudo systemctl status kafka-connect
   ```

### Step 3: Verify the Installation

- On the Kafka server, check the Kafka logs:
  ```bash
  sudo journalctl -u kafka
  ```
  
- On the Kafka Connect server, check the Kafka Connect logs:
  ```bash
  sudo journalctl -u kafka-connect
  ```

### Step 4: Install and Configure Debezium (Optional)

If you want to set up Debezium for change data capture (CDC), follow these steps:

1. **Download Debezium SQL Server Connector**:
   ```bash
   wget https://repo1.maven.org/maven2/io/debezium/debezium-connector-sqlserver/2.7.1.Final/debezium-connector-sqlserver-2.7.1.Final-plugin.tar.gz
   sudo tar -xzf debezium-connector-sqlserver-2.7.1.Final-plugin.tar.gz -C /opt/kafka/connectors/
   sudo chown -R kafka:kafka /opt/kafka/connectors/debezium-connector-sqlserver
   ```

2. **Restart Kafka Connect**:
   ```bash
   sudo systemctl restart kafka-connect
   ```

3. **Verify the Plugin**:
   ```bash
   curl -s localhost:8083/connector-plugins | jq
   ```

### Commands for TroubleShooting
#### Kafka
```bash

# List all the topics
$KAFKA_HOME/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list

# Creating new topic
$KAFKA_HOME/bin/kafka-topics.sh --create --topic first-topic --bootstrap-server localhost:9092

# Get information about the topic
$KAFKA_HOME/bin/kafka-topics.sh --describe --topic first-topic --bootstrap-server localhost:9092

# Read the messages from the topics
$KAFKA_HOME/bin/kafka-console-consumer.sh --topic first-topic --bootstrap-server localhost:9092

# Read the message before the consumer
$KAFKA_HOME/bin/kafka-console-consumer.sh --topic first-topic --from-beginning --bootstrap-server localhost:9092

# Delete topic
bin/kafka-topics.sh --delete --topic first-topic --bootstrap-server localhost:9092


# Example codes
/opt/kafka_2.13-3.8.0/bin/kafka-console-consumer.sh --bootstrap-server <SQL SERVER>:9092 --topic crewing.vessel.fake.crew --from-beginning | jq '.payload | { operation: .op, before: .before.crew_id , after: .after.crew_id ,first_name: .after.first_name, last_name: .after.last_name, change_lsn: .source.change_lsn, commit_lsn: .source.commit_lsn, transaction: .transaction.id }'

```

#### Kafka Connect
```bash

# List all connectors
curl -X GET http://localhost:8083/connectors

# Get status of the connectors
curl -X GET http://localhost:8083/connectors/my-connector/status

# Delete a connector
curl -X DELETE http://localhost:8083/connectors/my-connector

# Update a connector
curl -X PUT -H "Content-Type: application/json" -d @updated-connector-config.json http://localhost:8083/connectors/connector_name/config

# Verifying the update of the connector
curl -X GET http://localhost:8083/connectors/connector_name/config

```


### Conclusion

You have successfully installed Kafka and Kafka Connect on separate servers, ensuring that both services are set up for distributed, scalable processing. This setup is optimal for large-scale deployments and is ready for further configuration, such as integrating Debezium or other Kafka Connect plugins.