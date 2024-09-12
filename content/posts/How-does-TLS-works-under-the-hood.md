---
title: "How Does TLS Works Under the Hood"
date: 2024-09-12T13:34:23+05:30
lastmod: 2024-09-12T13:34:23+05:30
author: ["Dan"]
categories: 
- Tech
description: ""
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
    image: ""
    caption: ""
    alt: ""
    relative: false
---
In the cold winter of 1944, Germany’s once-unbreakable Enigma code had been compromised by the Allies. With every intercepted message, their plans were at risk of exposure, and entire operations could be jeopardized. In response, German High Command devised a new, unbreakable system of communication. They called it **Operation Valkyrie**.

This wasn’t just another machine like the Enigma; this was a new system that couldn’t be cracked, even if the messages were intercepted. Colonel Franz Richter, a seasoned officer in charge of communications, knew that their most sensitive military orders would need to be protected more securely than ever. He gathered his top commanders, including Major Klaus Weber, to unveil the system that could change the course of the war.

#### The Commander’s Key and the Small Vault

As Colonel Richter spoke, the tension in the room was palpable. “Our enemies have learned how to read our messages,” he began, “but what I’m about to give you is unbreakable.”

He handed each commander a **Commander’s Key**, a tool that would allow them to lock their orders inside a **small vault**. These vaults, forged from rare metals, couldn’t be opened by anyone once sealed—except by those with the matching **General’s Cipher**, a key held only by German High Command.

“You will use this key to lock your messages in the vault,” Richter explained, “and no one, not even our couriers, will be able to open them. Only we at High Command have the cipher to unlock it.”

This was no ordinary encryption. It was based on a cutting-edge cryptographic technique called **asymmetric encryption**. The Commander’s Key (known today as the **public key**) could lock the message, but only the private key—the General’s Cipher—could unlock it. If the vault was intercepted, it would remain sealed and secure, its contents unreadable.

#### The Symmetric Key: Securing the Message Inside

Colonel Richter wasn’t finished. “Locking the vault is only part of the plan,” he said. “The contents inside must also be encrypted.”

The commanders were introduced to another tool: the **Symmetric Key**. This key would allow both commanders and High Command to encode and decode the actual message. Even if an enemy opened the vault, they wouldn’t understand the orders unless they also had the symmetric key. This was a shared code, known only to the German officials and commanders.

With this two-part system—locking the vault with the Commander’s Key and encrypting the message with the Symmetric Key—Germany’s vital communications were more secure than ever.

#### The Seal of Trust: Ensuring Authenticity

There was still one final safeguard to prevent sabotage. In wartime, it wasn’t just about intercepting messages; the Allies could attempt to forge fake orders. To prevent this, every vault was sealed with a **certificate**, a unique symbol that proved the authenticity of the sender.

“If the seal on the vault does not match the certificate we have on file,” Colonel Richter warned, “we will know it’s a forgery.”

This certificate acted like a digital signature, guaranteeing that the message came from the true sender. Much like modern **digital certificates**, it was impossible to fake, and it provided the final layer of trust needed for secure communications.

#### The Test: A Dangerous Mission

The system was put to the test almost immediately. Major Weber had been given a critical task—his orders contained the exact coordinates for a surprise attack that could turn the tide of the war. If those coordinates were compromised, his entire unit would be walking into a trap.

Following the new protocol, Weber encrypted his message using the Symmetric Key, locked it in the small vault with his Commander’s Key, and sealed it with his unique certificate. The vault was handed to Lieutenant Heiner, a trusted courier, who set off through enemy territory, carrying Germany’s future in his satchel.

The journey was fraught with danger. Allied patrols were everywhere, and if Heiner were caught, the vault could fall into enemy hands. But even if it did, the Allies wouldn’t be able to open it. The vault was locked, the message encrypted, and the certificate verified.

#### Victory Sealed

After days of travel, Heiner reached German High Command. The vault, still sealed, was inspected carefully. Colonel Richter checked the certificate against the records and, satisfied with its authenticity, used the General’s Cipher to unlock the vault. Inside, the encrypted message was revealed, and with the Symmetric Key, the orders were finally decrypted.

The operation proceeded flawlessly. Major Weber’s unit executed the attack with precision, and the Allies were left in the dark, unaware of how their enemies had communicated so securely.

#### The Fiction Behind the Facts

Although this story of Operation Valkyrie is a fictional account, the methods it describes are very real. The **Commander’s Key** represents the **public key** used to lock (encrypt) information, while the **General’s Cipher** is the **private key** used to unlock (decrypt) it. The **Symmetric Key** is the shared key used to encrypt and decrypt the actual message, ensuring that both sender and receiver understand the contents.

Finally, the **certificate** acts as a **digital signature**, ensuring the message hasn’t been tampered with and confirming its authenticity. These are the foundational concepts of **Public Key Infrastructure (PKI)**, the system that secures everything from your bank transactions to your emails in today’s digital world.

The vault may be fictional, but the principles behind it now protect millions of sensitive communications every day.

---
