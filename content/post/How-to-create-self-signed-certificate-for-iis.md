+++
title = "How to Create a Self-Signed Certificate for IIS and Host a Website"
date = '2024-09-19T16:03:25+05:30'
categories = ['Tech']
draft = false # draft or not
+++ 

A few weeks ago, I got a task from my manager that seemed straightforward at first: set up a development environment for one of our upcoming projects. The catch? It needed to be accessible over HTTPS, just like our production sites. Now, getting a certificate from a trusted Certificate Authority (CA) for a development environment didn’t make much sense, and we certainly didn’t want to incur extra costs or deal with the complexities of a CA for something internal.

So, I figured I’d go the route of creating a self-signed certificate. This way, we could get our development site up and running with HTTPS quickly and securely, without any unnecessary overhead. After a bit of tinkering and some PowerShell magic, I had everything set up. And since it worked so well, I thought I’d share the process with you.

Here’s how you can create a self-signed certificate for IIS and host a website on your development environment, using a simple PowerShell script.

### The Script

Let's dive into the script that makes all this possible:

```powershell
param(
    [Parameter(Mandatory=$true)]
    [string]$DomainName,

    [Parameter(Mandatory=$true)]
    [string]$WebsiteName
)

# Import the WebAdministration module to work with IIS
Import-Module WebAdministration

# Generate a new self-signed certificate
$cert = New-SelfSignedCertificate -DnsName $DomainName -CertStoreLocation "cert:\LocalMachine\My"

# Export the certificate's thumbprint
$certThumbprint = $cert.Thumbprint

# Get the site object in IIS
$site = Get-Item "IIS:\Sites\$WebsiteName"

# Remove existing HTTPS bindings (if any)
$bindings = $site.Bindings.Collection | Where-Object { $_.protocol -eq "https" }
foreach ($binding in $bindings) {
    Remove-WebBinding -Name $WebsiteName -BindingInformation $binding.bindingInformation -Protocol https
}

# Create a new HTTPS binding
New-WebBinding -Name $WebsiteName -IPAddress "*" -Port 443 -HostHeader $DomainName -Protocol https

# Assign the certificate to the new binding
$binding = Get-WebBinding -Name $WebsiteName -Protocol https -Port 443
$binding.AddSslCertificate($certThumbprint, "My")

Write-Host "Self-signed certificate created and bound to site '$WebsiteName' with domain '$DomainName'."
```

### Step-by-Step Breakdown

1. **Parameter Setup**: The script starts by asking for two mandatory parameters: the domain name (`DomainName`) and the website name (`WebsiteName`). These parameters will guide the rest of the script.

2. **Load the WebAdministration Module**: This module is necessary to interact with IIS through PowerShell. It’s what allows us to create and manage sites, bindings, and other IIS configurations.

3. **Create a Self-Signed Certificate**: Using the `New-SelfSignedCertificate` cmdlet, the script generates a self-signed certificate for the specified domain. The certificate is stored in the local machine's "My" certificate store.

4. **Retrieve the Certificate Thumbprint**: The thumbprint is a unique identifier for the certificate, which is necessary to link it to the site’s binding.

5. **Get the IIS Site Object**: The script uses `Get-Item` to grab the IIS site object for the specified website. This allows us to work directly with the site's properties, including its bindings.

6. **Remove Existing HTTPS Bindings**: Before adding a new HTTPS binding, any existing ones are removed to ensure there are no conflicts or duplicate bindings.

7. **Create a New HTTPS Binding**: The script sets up a new HTTPS binding on port 443, using the provided domain name.

8. **Bind the Certificate**: Finally, the script attaches the self-signed certificate to the HTTPS binding using its thumbprint, ensuring that the site is now accessible via HTTPS.

9. **Confirmation**: After everything is done, the script outputs a confirmation message to let you know the certificate was successfully created and bound to the website.


### Avoiding Browser Warnings Due to the Self-Signed Certificate

When using a self-signed certificate, most browsers will display a warning because the certificate isn’t issued by a trusted Certificate Authority (CA). To avoid these warnings, you can import the certificate into your browser's trusted root certificate store. Here’s how you can do that in major browsers:

#### How to Import a Self-Signed Certificate into Your Browser

#### **1. Google Chrome**
   - **Windows/macOS:**
     1. Open Chrome and go to `chrome://settings`.
     2. Scroll down and click on "Advanced" to expand more settings.
     3. Under "Privacy and security," click on "Manage certificates" (or "Security" > "Manage certificates" on macOS).
     4. In the "Certificates" window, click on the "Trusted Root Certification Authorities" tab.
     5. Click "Import" and follow the wizard to import the self-signed certificate.
     6. Once imported, restart Chrome, and the browser should no longer show a warning for sites using this certificate.

#### **2. Mozilla Firefox**
   - **Windows/macOS/Linux:**
     1. Open Firefox and go to `about:preferences`.
     2. Scroll down to "Privacy & Security."
     3. Under the "Certificates" section, click on "View Certificates."
     4. In the "Certificate Manager" window, go to the "Authorities" tab.
     5. Click on "Import" and select the self-signed certificate file.
     6. Choose "Trust this CA to identify websites" and click "OK."
     7. The certificate is now trusted by Firefox.

#### **3. Microsoft Edge (Chromium-based)**
   - **Windows/macOS:**
     1. Open Edge and go to `edge://settings`.
     2. Scroll down and click on "Advanced settings."
     3. Click on "Manage certificates" under "Privacy and services."
     4. In the "Certificates" window, go to the "Trusted Root Certification Authorities" tab.
     5. Click "Import" and follow the wizard to import the certificate.
     6. Restart Edge, and the warning should disappear for sites using the self-signed certificate.

#### **4. Safari (macOS)**
   - 1. Double-click the self-signed certificate file (.cer or .crt) to open it in Keychain Access.
   - 2. In the Keychain Access window, locate the certificate, which will be listed under the "Certificates" category.
   - 3. Double-click on the certificate, and a new window will open.
   - 4. Expand the "Trust" section.
   - 5. Change "When using this certificate" to "Always Trust."
   - 6. Close the window and enter your macOS password to confirm the change.
   - 7. Safari will now trust the certificate, and you won’t see any warnings when visiting the site.

#### **5. Internet Explorer**
   - **Windows:**
     1. Open Internet Explorer and go to `Internet Options`.
     2. Go to the "Content" tab and click on "Certificates."
     3. Go to the "Trusted Root Certification Authorities" tab and click "Import."
     4. Follow the wizard to import the self-signed certificate.
     5. Once imported, restart Internet Explorer.


### Wrapping Up

Setting up HTTPS for a development environment doesn’t have to be complicated or expensive. By creating a self-signed certificate, you can quickly secure your site and make sure it mirrors your production environment as closely as possible. Whether you’re preparing for a presentation or just want to ensure everything is configured correctly before going live, this PowerShell script has you covered.

So, next time your manager asks you to spin up a development environment with HTTPS, you’ll know exactly what to do! 😊