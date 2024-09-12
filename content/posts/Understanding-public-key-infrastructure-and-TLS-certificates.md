---
title: "Understanding Public Key Infrastructure and TLS Certificates"
date: 2024-09-12T16:31:09+05:30
lastmod: 2024-09-12T16:31:09+05:30
author: ["Dan"]
categories: 
- Tech
description: "How does your information securely transfer through internet."
weight: # 1 means pin the article, sort articles according to this number
slug: ""
draft: false # draft or not
comments: true
showToc: true # show contents
TocOpen: true # open contents automantically
hidemeta: false # hide information (author, create date, etc.)
disableShare: true	# do not show share button
showbreadcrumbs: true # show current path
cover:
    image: "/images/Understanding-pki.webp"
    caption: "How does the communication happend in real world."
    alt: ""
    relative: false
---

In today's interconnected world, securing online communication is paramount. Public Key Infrastructure (PKI) acts as the backbone of this security, ensuring that sensitive information transferred over networks remains encrypted and trustworthy, facilitating secure communication between servers and users. A crucial component of this infrastructure is the TLS certificate, widely used to secure websites. Let's delve into how PKI and TLS certificates work to provide encryption and trust in digital transactions.

## The Role of PKI in Securing Communication

PKI is a system that establishes trust between two parties, typically a user and a server, by guaranteeing that communication is encrypted and transferred securely. It employs two key encryption methods: symmetric and asymmetric encryption.

### Symmetric Encryption

Symmetric encryption uses a single shared key to both encrypt and decrypt the data. While efficient, it presents a vulnerability: if a hacker intercepts the key, they can easily decrypt the message. The challenge lies in securely sharing the symmetric key without exposing it to attackers.

### Asymmetric Encryption

To address the limitations of symmetric encryption, PKI utilizes asymmetric encryption. This involves two mathematically linked keys: a **public key**, which is openly available, and a **private key**, known only to the owner (server or user). The public key encrypts messages, but only the corresponding private key can decrypt them.

Imagine a secure mailbox with two locks. You can give the combination to the first lock (public key) to anyone, allowing them to put messages inside. However, only you possess the key to the second lock (private key), which is needed to retrieve messages. 

Asymmetric encryption forms the basis for secure communication protocols like Secure Shell (SSH). In SSH, the public key resides on the server, and users log in using their private key. This ensures that only users with the matching private key can access the server.

## How TLS Certificates Work in PKI

When a user visits a secure website (indicated by "https" in the URL), the web server and the user's browser establish a secure communication channel using TLS (Transport Layer Security) certificates. Here's a simplified breakdown of the process:

1. **Initial Connection**: When a user accesses a website, the server provides its public key along with a digital certificate, which includes the server's identity and its public key.

2. **Encrypting the Symmetric Key**: The browser then generates a temporary symmetric key for encrypting further communication. However, instead of sending this symmetric key in plain text, the browser encrypts it using the server's public key.

3. **Secure Key Exchange**: The encrypted symmetric key is sent to the server. Since the server holds the corresponding private key, it can decrypt the symmetric key and establish a secure connection. A hacker, even with access to the public key, cannot decrypt the symmetric key due to the mathematical relationship between the keys.

4. **Ongoing Secure Communication**: Now that both the server and browser have the symmetric key, they can use it to encrypt and decrypt data exchanged between them, ensuring secure and fast communication.

### Protection from Fake Websites

Despite this system, it's not foolproof. Malicious actors can create phishing websites designed to mimic legitimate sites and trick users into revealing their credentials. They could even potentially generate fake certificates. So, how do users know the certificate is genuine and not from a hacker?

## Digital Certificates and Certificate Authorities (CAs)

A digital certificate serves as proof that a website's public key is legitimate and issued by a trusted authority. When a user visits a website, the browser checks whether the website’s certificate matches the domain name and whether it has been issued by a legitimate Certificate Authority (CA).

### Certificate Signing Authority

To create a trusted certificate, organizations generate a **Certificate Signing Request (CSR)**. The CSR contains information about the organization and its domain name, which is then sent to a CA for verification.

```bash
openssl req -new -key my-bank.key -out my-bank.csr -subj "/C=US/ST=CA/O=MyOrg, Inc./CN=my-bank.com"
# Output will be: my-bank.key my-bank.csr
```

The CA validates the information and, if approved, signs the certificate with its private key. This signed certificate is sent back to the organization, which can then use it to secure its website. If a hacker tries to obtain a certificate, the CA’s validation process ensures that fake certificates are rejected.

### Browser Trust in CAs

Browsers are pre-configured to trust certificates from well-known CAs, such as Symantec, DigiCert, Comodo,GlobalSign, etc. Each CA has its own public and private key pair. The browser uses the CA's public key (built into the browser) to verify the authenticity of the website’s certificate. If the certificate is signed by a trusted CA, the browser allows access. If not, the browser displays a warning, alerting the user that the site may not be secure.

You can view the trusted CAs in your browser's settings under "Trusted Root Certification Authorities."

![](/images/Browser-Trusted-Certificates.png)

### Private CAs for Internal Networks

While public CAs are essential for securing public websites, they may not be practical for internal networks, such as those used for payroll or intranet applications. For this, organizations can deploy their own **private CAs** to sign certificates for internal websites. Employees’ browsers can be configured to trust these private CAs, establishing secure connections within the organization.

## Conclusion

PKI and TLS certificates are critical components of modern internet security. By leveraging asymmetric encryption, digital certificates, and trusted Certificate Authorities, PKI ensures that communication between users and servers is encrypted and that the server's identity is verified. Whether you are securing a public website or an internal network, PKI and TLS certificates provide the foundation for establishing trust and safeguarding sensitive information online.

Always remember: while public keys are widely distributed, private keys should remain confidential, ensuring that only the intended recipient can decrypt sensitive data.

**Additional Notes:**

* **Certificate Revocation List (CRL) and Online Certificate Status Protocol (OCSP):** To inform browsers about revoked certificates, CAs use CRLs or OCSP. CRLs are lists of revoked certificates, while OCSP provides real-time status checks.
* **Private Key Security:** It's crucial to store private keys securely and protect them from unauthorized access.
* **Certificate Expiration:** Certificates have a limited lifespan. Organizations must regularly renew their certificates to maintain security.
* **Best Practices:** Follow industry best practices for PKI implementation and management, including using strong cryptographic algorithms, regularly updating certificates, and implementing robust key management practices.

By understanding the fundamentals of PKI and TLS, you can ensure that your online interactions are secure and protected from unauthorized access.
