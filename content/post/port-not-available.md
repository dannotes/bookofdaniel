+++
title = 'Port Not Available'
date = '2024-09-12T13:56:19+05:30'
draft = false
+++

**Yes, you read that right.** The port you’re trying to use is already occupied by another application. If you’re a system or network administrator, you’ve likely encountered this frustrating message more times than you care to remember. It’s challenging to pinpoint which application is hogging the port (though it’s not as hard as it seems, as I’ll show you 😉). These ghost messages can leave you in quite a pickle.

Just yesterday, we faced this exact issue and wasted two hours troubleshooting so that you don’t have to!

Our situation was this: We had installed SQL Server 2019 Reporting Services on one of our development servers, and the default port it selected for installation was `8082`. Unfortunately, this port was already in use by our front-facing application, so we needed to free it up.

![Port Not Available](/images/not-listening.gif)
<img title="Port Not Available" alt="Port Not Available" src="/images/not listening.gif">

After some frantic Googling, we found a solution: we updated the port from `8082` to `8083` in the `config.json` file located in the Reporting Services folder. (You can usually find the file here: `C:\Program Files\Microsoft SQL Server Reporting Services\SSRS\RSHostingService\RSHostingService.exe`.) We then restarted the `SQL Server Reporting Services` Windows service, and voilà—`RSHostingService.exe` started running on port `8083`.

We thought everything was resolved and that port `8082` was free. However, when we configured our front-end application and tried to access it, we were greeted with a `503 Server Unavailable` error. 😢

## Troubleshooting Port Availability

To narrow down the issue, it’s helpful to identify which application is using the port.

### Finding the Process Using `netstat`

The **netstat** command, short for "network statistics," is a command-line tool that displays active network connections, routing tables, and various network interface statistics. By running the `netstat` command with the `noa` parameters, we can list all the listening ports with process ID information and pipe that command to search for the specific port.

```cmd
netstat -noa | find "8082"
```

**Output:**
```
TCP    0.0.0.0:8082           0.0.0.0:0              LISTENING       4
TCP    [::]:8082              [::]:0                 LISTENING       4
```

The process ID `4` indicates that it’s a system process. Unfortunately, this doesn’t tell us which application is using the port, so we need another method.

### Finding the Process Using `netsh`

**Netsh**, short for **Network Shell**, is a command-line utility that allows users to configure and manage network devices both locally and remotely. It’s particularly useful for tasks like changing IP addresses, resetting the TCP/IP stack, and managing wireless settings.

We can use `netsh` to query the HTTP request and find out which process is using port `8082`:

```cmd
netsh http show servicestate view=requestq
```

Save the output of the above command to a file, open it using Notepad, and search for the port details:

```cmd
netsh http show servicestate view=requestq > results.log
notepad results.log
```

**Output:**
```
Request queue name: Request queue is unnamed.
    Version: 2.0
    State: Active
    Request queue 503 verbosity level: Basic
    Max requests: 1000
    Number of active processes attached: 1
    Process IDs:
        2312
    URL groups:
    URL group ID: BE00000340000001
        State: Active
        Request queue name: Request queue is unnamed.
        Properties:
            Max bandwidth: inherited
            Max connections: inherited
            Timeouts:
                Timeout values inherited
            Number of registered URLs: 1
            Registered URLs:
                HTTP://LOCALHOST:8082/
        Server session ID: C000000320000001
            Version: 2.0
            State: Active
            Properties:
                Max bandwidth: 4294967295
                Timeouts:
                    Entity body timeout (secs): 120
                    Drain entity body timeout (secs): 120
                    Request queue timeout (secs): 120
                    Idle connection timeout (secs): 120
                    Header wait timeout (secs): 120
                    Minimum send rate (bytes/sec): 150
```

Now you can see that port `8082` is being used by process `2312`. You can check Task Manager to see which process is associated with this PID, or use the following command:

```cmd
tasklist /FI "PID eq 2312"
```

**Output:**
```
Image Name                     PID Session Name        Session#    Mem Usage
========================= ======== ================ =========== ============
SQLServerReportingServices     2312 Services                   0     42,232 K
```

## What the Heck?! 😮

How is this possible? We changed the reporting tool config file, yet `netsh` still shows that port `8082` is in use. Upon rechecking the reporting service logs, we confirmed that the application is indeed running on port `8083`. 🤔

It turns out that the URL with port `8082` was reserved by SQL Reporting Services with an Access Control List (ACL) during installation. Changing the config file alone wasn’t enough. To see the list of URL reservations for HTTP services, use this command:

```cmd
netsh http show urlacl
```

**Output:**
```
 Reserved URL            : https://*:8082/
        User: NT SERVICE\SQLServerReportingServices
            Listen: Yes
            Delegate: No
            SDDL: D:(A;;GX;;;BU)(A;;GX;;;LS)
```

To free up port `8082` for our front-end application, we needed to delete this obsolete HTTP reservation:

```cmd
netsh http delete urlacl url=http://+:8082/
```

**Output:**
```
Deleted Successfully.
```

To confirm that the port is free and available for use, run:

```cmd
netstat -noa | find "8082"
```

The expected output should be blank! 😉

Finally, the port is free!

