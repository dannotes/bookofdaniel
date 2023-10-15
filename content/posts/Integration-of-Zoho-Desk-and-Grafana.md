---
date : 2023-10-02T17:40:05+05:30
title : "Push your team to be Good to Great: Integration of Zoho Desk and Grafana"
featured_image: "/images/Push your team to be Good to Great Integration of Zoho Desk and Grafana.png"
categories: "Case Study"
tags: ["zoho", "grafana", "sql server", "java script", "team building"]
draft : false    
---

Have you ever been a part of a hardworking team that, despite their efforts, ends up shouldering blame? If yes, our situation in operations might resonate with you. On any given day, our Zoho Desk is inundated with approximately 300 tickets, each falling under various classifications and priorities. Many of these tickets are complex and time-consuming to resolve, causing them to carry over to the next day and become overdue.

The challenge we face is the lack of visibility into critical metrics. Questions like the total number of tickets created, the various classifications in use, who is closing the most tickets, and what remains pending are difficult to answer definitively. Convincing others about the workload overload has proven to be quite a task.

While Zoho Desk does offer predefined dashboards and customization options, our workflow relies heavily on custom fields. Additionally, the platform lacks real-time monitoring capabilities out of the box.

If you've followed along this far, you may find yourself in a similar scenario or be seeking solutions for building real-time monitoring functionality within Zoho Desk. Keep reading!

# Challenges 
As a team, we set out to tackle these challenges head-on, with the ultimate goal of maximizing throughput and efficiency to ensure customer satisfaction. Here are the key challenges we identified on our team board:

**1. Large Team Management:** <br>
    With a growing client base, our team size has expanded proportionally. Managing a larger team is becoming increasingly challenging without access to key metrics.

**2. Ticket Assignment Automation:**
    Currently, our ticket assignment process involves agents or team members manually assigning tickets from a common email account. Some agents assign tickets to themselves, while others choose to assign them to the next team member. This variation in assignment might be due to differences in ticket complexity, with some opting for the low-hanging fruit.

**3. Timely Escalation:**
    To maintain SLA compliance, we required a solution which will escalate the tickets to a manager when there is breach in a predefined time threshold (e.g., x minutes/hours).

**4. Email Tickets with Mandatory Fields:**
    Zoho Desk offers a convenient feature that allows users to raise tickets via email. However, this feature creates tickets without mandatory fields, such as client or environment name. 

**5. Real-Time Monitoring & Scoreboard:**
    The absence of a real-time dashboard has caused inefficiencies in tracking productivity.




> **Improving Daily work is even more important than doing daily work.**  - The Phoenix Project




# Solutions 

I have slept with this challenges for a day and explored the Zoho documentation along with some Google search. it look like we can solve some of these issues using zoho's features, while others might require custom development.

| Challenge     |   Solution    |
| :---------    | :--------     |
| Large Team Management | Proposed to split the team into multiple pod or pool. So that it can be managed with a senior / lead with minimal members and work can be monitored efficiently. <br> Pool segregation will be based on the client, X number client for pool 1, Y no.of client to pool 2, so on. <br> Additional Zoho Desk account with standard license is required per pool. |
| Ticket Assignment Automation | Since the team is arranged into multiple pool based on the client hierarchy, whenever a ticket raise for the specific client it should be allocated directly to the respecitve pool. Then the pool lead / member can assign and work accordingly. <br> To Automate this process Zoho Desk provide a feature called [Direct Assignment](https://help.zoho.com/portal/en/kb/desk/automation/assignment-rules-notification/articles/creating-ticket-assignment-rules). Create an assignment rule with client name and select respective pool account. Viola ticket will be assigned automatically on creation. |
| Timely Escalation |  Zoho provided a feature called [SLAs](https://help.zoho.com/portal/en/kb/desk/automation/escalate-sla/articles/creating-and-using-slas) escalation, if an escalation is happened with in x minutes it will be escalated to 2 levels. We have adopted that so breached ticket will be esclated to respective pool lead and manager with in 30 mins. | 
Email Ticket with mandatory fields | We have created a [Zoho Task](https://help.zoho.com/portal/en/kb/desk/activities/articles/working-with-tasks-zoho-desk#Creating_Tasks) to close email ticket with an automated reply to fill mandatory fields. So tickets raised through email will be closed automatically if mandatory fields are not available. |

## Real-Time Monitoring & Scoreboard
Zoho analytics with additional license offers dashboard experience but we need something more interesting like a real-time dashboard to proactively act on tickets without additional license.

So we came up with a solution using Grafana dashbaord and project it in a monitor. For that we used zoho web hook, instead of polling ticket meta details from Zoho desk.

The Webhook listener is developed using a simple java script. The json payload recieved will be deserialized and stored in a relational database like SQL Server.

Then we created a grafana dashboard to pull the details from the database. 

### Architecture Diagram
<img title="Zoho Real-Time Grafana Dashbord" alt="Zoho Real-Time Dashboard Solution" src="/images/Zoho Desk Real Time Monitoring.png">





### Final Results
<img title="Zoho Real-Time Grafana Dashbord" alt="Zoho Real-Time Dashboard Solution on TV" src="/images/Zoho Desk Real Time Monitoring on TV.jpg">


> **A great team doesn’t mean that they had the smartest people. What made those teams great is that everyone trusted one another. It can be a powerful thing when that magic dynamic exists.** - The Phoenix Project











