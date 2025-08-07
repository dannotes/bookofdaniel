+++
title = 'How to Setup Kubernetes in Azure Virtual Machines'
date = '2024-09-12T13:44:27+05:30'
draft = false
categories = ['Tech']
+++


Welcome to the hard way of installing Kubernetes in Azure Virtual Machines. The instructions will be moreover same for On-prem. For many developers, using managed Kubernetes services like GKE, EKS, or AKS can be convenient, but they often abstract away the intricate details of how a cluster operates under the hood. 

# Requirements

| NODES             | IP            | HOSTNAME              | MACHINE TYPE          | OPERATING SYSTEM      |
|-------------------|---------------|-----------------------|-----------------------|-----------------------|
| master            | 172.16.39.14  | k8s-master.local      | Standard B2ms         | Ubuntu 24.04          |
| k8s-worker1       | 172.16.39.23  | k8s-worker1.local     | Standard B4ms         | Ubuntu 24.04          |

---

# Provisioning the Servers in Azure

To provision two Linux virtual machines (VMs) in Azure with the specified details, you can use the Azure CLI (az) to achieve this. Here’s how you can provision both machines using az vm create commands.

```bash
# 1. Set common variables
    RESOURCE_GROUP="k8s-cluster"
    LOCATION="eastus"
    MASTER_VM_NAME="k8s-master"
    WORKER_VM_NAME="k8s-worker1"
    MASTER_IP="172.16.39.14"
    WORKER_IP="172.16.39.23"
    VNET_NAME="k8s-vnet"
    SUBNET_NAME="k8s-subnet"
    MASTER_HOSTNAME="k8s-master.local"
    WORKER_HOSTNAME="k8s-worker1.local"

# 2. Resource group creation
    az group create --name $RESOURCE_GROUP --location $LOCATION

# 3. Create a virtual network (VNet)
    az network vnet create \
    --resource-group $RESOURCE_GROUP \
    --name $VNET_NAME \
    --address-prefix 172.16.0.0/16 \
    --subnet-name $SUBNET_NAME \
    --subnet-prefix 172.16.39.0/24


# 4. Create static IP addresses
    # Create public IPs
    az network public-ip create --resource-group $RESOURCE_GROUP --name masterPublicIP --allocation-method Static --sku Standard
    az network public-ip create --resource-group $RESOURCE_GROUP --name worker1PublicIP --allocation-method Static --sku Standard

    # Create NIC for the master node
    az network nic create \
        --resource-group $RESOURCE_GROUP \
        --name masterNIC \
        --vnet-name $VNET_NAME \
        --subnet $SUBNET_NAME \
        --private-ip-address $MASTER_IP \
        --public-ip-address masterPublicIP

    # Create NIC for the worker node
    az network nic create \
        --resource-group $RESOURCE_GROUP \
        --name worker1NIC \
        --vnet-name $VNET_NAME \
        --subnet $SUBNET_NAME \
        --private-ip-address $WORKER_IP \
        --public-ip-address worker1PublicIP

# 5. Provision the master node
    az vm create \
    --resource-group $RESOURCE_GROUP \
    --name $MASTER_VM_NAME \
    --size Standard_B2ms \
    --nics masterNIC \
    --image Canonical:0001-com-ubuntu-server-jammy:24_04-lts:latest \
    --admin-username azureuser \
    --generate-ssh-keys \
    --custom-data cloud-init.yaml \
    --host-name $MASTER_HOSTNAME

# 6. Provision the worker node
    az vm create \
    --resource-group $RESOURCE_GROUP \
    --name $WORKER_VM_NAME \
    --size Standard_B4ms \
    --nics worker1NIC \
    --image Canonical:0001-com-ubuntu-server-jammy:24_04-lts:latest \
    --admin-username azureuser \
    --generate-ssh-keys \
    --custom-data cloud-init.yaml \
    --host-name $WORKER_HOSTNAME

# 7. Verification
    az vm list --resource-group $RESOURCE_GROUP -o table
```

This will show you the VMs with their details. You should see `k8s-master` and `k8s-worker1` with the correct IP addresses and machine types.

---

# System Preparation for Kubernetes Installation

Before diving into the installation of Kubernetes, it's essential to prepare your system for optimal performance and stability. This section outlines the necessary steps to get both the master and worker nodes ready for Kubernetes.

> ℹ️ Execute the following commands on both master and worker nodes.

## 1. Update the OS

First, ensure your system is up-to-date by running the following commands to update and upgrade all installed packages:

```bash
sudo apt update
sudo apt upgrade -y
```

After the upgrade completes, reboot the system to apply all changes:

```bash
sudo reboot
```

## 2. Set Hostname

Assign meaningful hostnames to both your master and worker nodes. This makes it easier to identify and manage the nodes in your cluster.

- **Master Node**:
```bash
sudo hostnamectl set-hostname "k8s-master.local"
```

- **Worker Node**:
```bash
sudo hostnamectl set-hostname "k8s-worker1.local"
```

Next, update the `/etc/hosts` file on both nodes to map the hostnames to their corresponding IP addresses. Add the following lines to the file:

```bash
172.16.39.14 k8s-master.local
172.16.39.23 k8s-worker1.local
```

## 3. Disable Swap

Kubernetes requires swap to be disabled to function properly. This is crucial because the **Kubelet**, the primary Kubernetes agent running on each node, does not handle memory swapping well. Enabling swap can lead to performance degradation and unpredictable behavior in your cluster.

Disable swap immediately with the following commands:

```bash
sudo swapoff -a
sudo sed -i '/ swap / s/^/#/' /etc/fstab
sudo mount -a
```

By commenting out the swap entry in `/etc/fstab`, this ensures swap remains disabled after a reboot. Verify swap is disabled with:

```bash
free -h
```

The output should indicate that swap is set to 0:

```bash
               total        used        free      shared  buff/cache   available
Mem:           7.8Gi       1.4Gi       4.9Gi       5.0Mi       1.7Gi       6.3Gi
Swap:             0B          0B          0B
```

## 4. Update Kernel and Configure Modules

For Kubernetes to run efficiently, specific kernel modules and network parameters need to be configured.

First, create a configuration file for kernel modules:

```bash
sudo tee /etc/modules-load.d/containerd.conf <<EOF
overlay
br_netfilter
EOF
```

- `overlay`: Used for overlay filesystems, which are essential for container storage.
- `br_netfilter`: Enables Kubernetes to manage network traffic between containers.

Next, load the required kernel modules:

```bash
sudo modprobe overlay
sudo modprobe br_netfilter
```

Set the necessary kernel parameters for Kubernetes by creating a configuration file:

```bash
sudo tee /etc/sysctl.d/kubernetes.conf <<EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF
```

Finally, reload the sysctl configuration to apply the new parameters:

```bash
sudo sysctl --system
```

These steps ensure your system is properly prepared for the Kubernetes installation, providing a stable foundation for the cluster to run efficiently.

---

# Installing Containerd Runtime on All Nodes

A critical component of any Kubernetes cluster is the **container runtime**, which is responsible for running containers on each node. **Containerd** is a lightweight and powerful runtime that provides essential container lifecycle management, including image transfer, storage, and execution. Originally developed as part of Docker, it is now a key part of the Cloud Native Computing Foundation (CNCF) and is favored for Kubernetes environments due to its simplicity and performance.

To install **containerd** on all nodes in your Kubernetes cluster, follow these steps:

First, ensure that the necessary packages and dependencies are installed:

```bash
sudo apt install -y curl gnupg2 software-properties-common apt-transport-https ca-certificates
```

Add Docker’s official GPG key and Docker’s repository to your system:

```bash
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmour -o /etc/apt/trusted.gpg.d/docker.gpg
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

Update your package lists to include the newly added Docker repository, and install **containerd**:

```bash
sudo apt update
sudo apt install -y containerd.io
```

Once **containerd** is installed, you need to configure it to work with **Kubernetes**. Generate the default configuration file and enable **SystemdCgroup**, which ensures that **containerd** integrates smoothly with Kubernetes, particularly when using systemd for process management:

```bash
containerd config default | sudo tee /etc/containerd/config.toml >/dev/null 2>&1
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/g' /etc/containerd/config.toml
```

Finally, restart and enable the **containerd** service so that it starts automatically on system boot:

```bash
sudo systemctl restart containerd
sudo systemctl enable containerd
```

By following these steps, you’ll have a robust and efficient container runtime in place, ready for Kubernetes. Repeat this process on each node to ensure consistency across the cluster.

---


# Installing Kubeadm, Kubelet, and Kubectl

Now that your system is prepared, it's time to install the essential Kubernetes components on all of your machines: **kubeadm**, **kubelet**, and **kubectl**.

- **kubeadm**: This tool helps bootstrap the Kubernetes cluster.
- **kubelet**: The agent that runs on all nodes in the cluster, responsible for running pods and containers.
- **kubectl**: A command-line utility that lets you interact with the Kubernetes cluster.

It's important to note that **kubeadm** will not manage or install **kubelet** or **kubectl** for you, so you must ensure that all these tools are on the correct version. Mismatches between **kubeadm**, **kubelet**, and **kubectl** versions can result in instability. Kubernetes does allow a one-minor-version difference between the **kubelet** and the control plane, but the **kubelet** version should never exceed the API server version. For example, **kubelet** v1.7.0 can work with an API server running v1.8.0, but not the other way around.

> Additionally, as of **September 13, 2023**, Kubernetes has moved to a new package repository hosted at **pkgs.k8s.io**, which you must use to install any Kubernetes versions after v1.24. The legacy repositories (apt.kubernetes.io) are deprecated and may be removed without notice.

Follow the steps below to install these packages for Kubernetes v1.31:

## 1. Update Package Index and Install Dependencies

Start by updating the system’s package index and installing the necessary dependencies:

```bash
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl gpg
```

## 2. Add the Kubernetes Signing Key

Download the Kubernetes signing key for the package repositories. If the directory `/etc/apt/keyrings` doesn't exist, create it before running the following command:

```bash
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.31/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
```

This ensures that you are installing authentic Kubernetes packages.

## 3. Add the Kubernetes v1.31 Repository

Add the Kubernetes v1.31 repository to your system’s sources list. If you need a different version, modify the version number in the URL accordingly:

```bash
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.31/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
```

## 4. Install Kubelet, Kubeadm, and Kubectl

Once the repository is added, update your package list and install **kubeadm**, **kubelet**, and **kubectl**:

```bash
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
```

Marking the packages with `apt-mark hold` ensures they won't be accidentally updated during system upgrades, which is important for maintaining version stability across your cluster.

## 5. Enable the Kubelet Service (Optional)

Before you bootstrap the Kubernetes cluster with **kubeadm**, you can enable the **kubelet** service to start automatically on boot:

```bash
sudo systemctl enable --now kubelet
```

These steps install the core tools required for setting up and managing your Kubernetes cluster. Make sure to follow them carefully on both your master and worker nodes.

---


# Initializing the Kubernetes Cluster with Kubeadm

With **kubeadm**, **kubelet**, and **kubectl** installed on your master and worker nodes, it’s time to initialize the Kubernetes cluster. 
> ℹ️ This step should only be executed on the master node, as it sets up the control plane that will manage the cluster.

To begin, use the following command on your **master node** to initialize the cluster:

```bash
sudo kubeadm init \
  --pod-network-cidr=10.10.0.0/16 \
  --control-plane-endpoint=k8s-master.local
```

- **--pod-network-cidr=10.10.0.0/16**: This specifies the CIDR range for the pod network. You can modify this value based on your network architecture.
- **--control-plane-endpoint=k8s-master.local**: This is the DNS or IP address of your control plane (master node). Ensure that the DNS or IP is resolvable by all worker nodes in your cluster.

After running this command, kubeadm will perform the following tasks:

1. Download and install the necessary control plane components such as **etcd**, **kube-apiserver**, **kube-scheduler**, and **kube-controller-manager**.
2. Set up your cluster according to the parameters provided.
3. Generate a join token that worker nodes can use to join the cluster.

Once the initialization is complete, kubeadm will output instructions to finish setting up **kubectl** on the master node and provide the join command for your worker nodes.

**Notes:**

- The `--pod-network-cidr` value must align with the configuration of the pod network solution (e.g., Calico, Flannel) you plan to deploy.
- Make sure that the control plane endpoint (`k8s-master.local`) is properly configured in your DNS or `/etc/hosts` file so that all nodes can resolve it.

At this point, the control plane will be ready, and the next step will be to install a network add-on to allow pod-to-pod communication within the cluster.

**Output**:
```
azureuser@k8s-master:~$ sudo kubeadm init \
  --pod-network-cidr=10.10.0.0/16 \
  --control-plane-endpoint=k8s-master.local
[init] Using Kubernetes version: v1.26.1
[preflight] Running pre-flight checks
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'
[certs] Using certificateDir folder "/etc/kubernetes/pki"
[certs] Generating "ca" certificate and key
[certs] Generating "apiserver" certificate and key
[certs] apiserver serving cert is signed for DNS names [k8s-master.local kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 192.168.1.10]
[certs] Generating "apiserver-kubelet-client" certificate and key
[certs] Generating "front-proxy-ca" certificate and key
[certs] Generating "front-proxy-client" certificate and key
[certs] Generating "etcd/ca" certificate and key
[certs] Generating "etcd/server" certificate and key
[certs] etcd/server serving cert is signed for DNS names [k8s-master.local localhost] and IPs [192.168.1.10 127.0.0.1 ::1]
[certs] Generating "etcd/peer" certificate and key
[certs] etcd/peer serving cert is signed for DNS names [k8s-master.local localhost] and IPs [192.168.1.10 127.0.0.1 ::1]
[certs] Generating "etcd/healthcheck-client" certificate and key
[certs] Generating "apiserver-etcd-client" certificate and key
[certs] Generating "sa" key and public key
[kubeconfig] Using kubeconfig folder "/etc/kubernetes"
[kubeconfig] Writing "admin.conf" kubeconfig file
[kubeconfig] Writing "kubelet.conf" kubeconfig file
[kubeconfig] Writing "controller-manager.conf" kubeconfig file
[kubeconfig] Writing "scheduler.conf" kubeconfig file
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Starting the kubelet
[control-plane] Using manifest folder "/etc/kubernetes/manifests"
[control-plane] Creating static Pod manifest for "kube-apiserver"
[control-plane] Creating static Pod manifest for "kube-controller-manager"
[control-plane] Creating static Pod manifest for "kube-scheduler"
[etcd] Creating static Pod manifest for local etcd in "/etc/kubernetes/manifests"
[wait-control-plane] Waiting for the kubelet to boot up the control plane as static Pods from directory "/etc/kubernetes/manifests". This can take up to 4m0s
[apiclient] All control plane components are healthy after 7.503422 seconds
[upload-config] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[kubelet] Creating a ConfigMap "kubelet-config" in namespace kube-system with the configuration for the kubelets in the cluster
[upload-certs] Skipping phase. Please see --upload-certs
[mark-control-plane] Marking the node k8s-master.local as control-plane by adding the labels: [node-role.kubernetes.io/control-plane node.kubernetes.io/exclude-from-external-load-balancers]
[mark-control-plane] Marking the node k8s-master.local as control-plane by adding the taints [node-role.kubernetes.io/control-plane:NoSchedule]
[bootstrap-token] Using token: daii9y.g4dq24u6irkz4pt0
[bootstrap-token] Configuring bootstrap tokens, cluster-info ConfigMap,RBAC Roles
[bootstrap-token] Configured RBAC rules to allow Node Bootstrap tokens to get nodes
[bootstrap-token] Configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstrap-token] Configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstrap-token] Configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstrap-token] Creating the "cluster-info" ConfigMap in the "kube-public" namespace
[kubelet-finalize] Updating "/etc/kubernetes/kubelet.conf" to point to a rotatable kubelet client certificate and key
[addons] Applied essential addon: CoreDNS
[addons] Applied essential addon: kube-proxy

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regularuser:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config==

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listedat:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

You can now join any number of control-plane nodes by copying certificate authorities
and service account keys on each node and then running the following asroot:

  kubeadm join k8s-master.local:6443 --token daii9y.g4dq24u6irkz4pt0 \
        --discovery-token-ca-cert-hash sha256:58b9cc96ed57a5797fddea653756dbda830efbff55b720a10cffb3948d489148 \
        --control-plane

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join k8s-master.local:6443 --token daii9y.g4dq24u6irkz4pt0 \
        --discovery-token-ca-cert-hash sha256:58b9cc96ed57a5797fddea653756dbda830efbff55b720a10cffb3948d489148

```

> ℹ️ Now, As shown in the output execute below command in master node.
```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

Verify the cluster status:
```bash
kubectl cluster-info
kubectl get nodes
```

**Output**:
```bash
azureuser@k8s-master:~$ kubectl cluster-info
Kubernetes control plane is running at https://k8s-master.local:6443
CoreDNS is running at https://k8s-master.local:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
azureuser@k8s-master:~$ kubectl get nodes
NAME                    STATUS   ROLES           AGE    VERSION
k8s-master.local        Ready    control-plane   3d3h   v1.30.4
```

It seems the control plane is running, we will proceed to add worker nodes to this cluster.

---

# Adding Worker Nodes to the Kubernetes Cluster

After initializing the Kubernetes cluster on the master node, it's time to add your worker nodes to the cluster. This will allow the control plane to distribute workloads across the nodes and manage them.

> ℹ️ To add a worker node, you need to execute the kubeadm join command in worker nodes.

This command securely connects the worker node to the control plane. the command typically looks something like this:

```bash
kubeadm join k8s-master.local:6443 --token daii9y.g4dq24u6irkz4pt0 \
  --discovery-token-ca-cert-hash sha256:58b9cc96ed57a5797fddea653756dbda830efbff55b720a10cffb3948d489148
```
- **k8s-master.local:6443**: This is the control plane endpoint (master node's address).
- **--token**: The token generated during the kubeadm init process, which allows the worker node to authenticate with the control plane.
- **--discovery-token-ca-cert-hash**: A hash that ensures the worker node securely discovers the control plane’s certificate authority.


Once this command completes successfully, the worker node will be part of the Kubernetes cluster, ready to run workloads distributed by the control plane. You can verify that the node has joined the cluster by running the following command on the master node:

```bash
kubectl get nodes
```

**Output**:
```bash
azureuser@k8s-master:~$ kubectl get nodes
NAME                    STATUS   ROLES           AGE    VERSION
k8s-master.local        Ready    control-plane   3d3h   v1.30.4
k8s-worker1.local       Ready    <none>          3d3h   v1.30.4
```

This will list all nodes, including the newly added workers, along with their status in the cluster.

Repeat the process for each worker node to ensure that all machines are part of the cluster.

---

Here’s the updated blog paragraph with the `sed` command for editing the Calico manifest:

---

# Installing Calico (v3.28.1) Pod Network for the Kubernetes Cluster

In order to allow communication between the pods in your cluster, you'll need to install a network add-on. One of the most popular options is **Calico**, which provides networking and network security capabilities for Kubernetes. Below, we'll walk through how to install **Calico** on your Kubernetes cluster. 

> ℹ️ These commands should be run only on the **master node**.

## 1. Download the Calico Manifest File

To begin, download the Calico manifest file, which is pre-configured for clusters with fewer than 50 nodes:

```bash
curl https://raw.githubusercontent.com/projectcalico/calico/v3.28.1/manifests/calico.yaml -O
```

This file contains all the necessary configuration to deploy Calico on your Kubernetes cluster.

## 2. Edit the Calico Manifest Using `sed`

To streamline the process of modifying the **CALICO_IPV4POOL_CIDR** in the **calico.yaml** file, you can use the following `sed` command. This automatically updates the pod network CIDR without manually opening the file:

```bash
sed -i 's/value: "192.168.0.0\/16"/value: "10.10.0.0\/16"/' calico.yaml
```

This command ensures that the pod network CIDR matches the one you specified during cluster initialization (`10.10.0.0/16`).

## 3. Apply the Calico Manifest

Once the manifest is updated, install Calico by applying the configuration using **kubectl**:

```bash
kubectl apply -f calico.yaml
```

Calico will be deployed on your cluster, enabling pod-to-pod communication and enforcing network policies.

**Output**:
```bash
azureuser@k8s-master:~$ kubectl apply -f calico.yaml
poddisruptionbudget.policy/calico-kube-controllers created
serviceaccount/calico-kube-controllers created
serviceaccount/calico-node created
configmap/calico-config created
customresourcedefinition.apiextensions.k8s.io/bgpconfigurations.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/bgppeers.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/blockaffinities.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/caliconodestatuses.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/clusterinformations.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/felixconfigurations.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/globalnetworkpolicies.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/globalnetworksets.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/hostendpoints.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/ipamblocks.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/ipamconfigs.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/ipamhandles.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/ippools.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/ipreservations.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/kubecontrollersconfigurations.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/networkpolicies.crd.projectcalico.org created
customresourcedefinition.apiextensions.k8s.io/networksets.crd.projectcalico.org created
clusterrole.rbac.authorization.k8s.io/calico-kube-controllers created
clusterrole.rbac.authorization.k8s.io/calico-node created
clusterrolebinding.rbac.authorization.k8s.io/calico-kube-controllers created
clusterrolebinding.rbac.authorization.k8s.io/calico-node created
daemonset.apps/calico-node created
deployment.apps/calico-kube-controllers created
```

# Verifying the K8s Installation

You can verify that Calico is running correctly by checking the status of the pods in the `kube-system` namespace:

```bash
kubectl get pods -n kube-system
```

**Output**:
```bash
azureuser@k8s-master:~$ kubectl get pods -n kube-system
NAME                                           READY   STATUS    RESTARTS        AGE
calico-kube-controllers-77d59654f4-25crd       1/1     Running   5 (3h59m ago)   3d3h
calico-node-hqf82                              1/1     Running   2 (3h59m ago)   3d3h
calico-node-jxwbm                              1/1     Running   4 (3h55m ago)   3d3h
coredns-7db6d8ff4d-6f9cn                       1/1     Running   2 (3h59m ago)   3d4h
coredns-7db6d8ff4d-dnzq2                       1/1     Running   2 (3h59m ago)   3d4h
```

You should see Calico components such as `calico-node` and `calico-kube-controllers` running successfully.

With Calico installed, your Kubernetes cluster is now fully networked, allowing pods to communicate across nodes as necessary. You can also configure Calico for advanced network security features if needed.

Now if we check the status of the nodes, the status will be Ready.
```bash
kubectl get nodes
```

**Output**:
```bash
azureuser@k8s-master:~$ kubectl get nodes
NAME                    STATUS   ROLES           AGE    VERSION
k8s-master.local    Ready    control-plane   3d4h   v1.30.4
k8s-worker1.local   Ready    <none>          3d4h   v1.30.4
```

---

Congrats, if you reach till the end 😊. You are a soldier 🪖.
