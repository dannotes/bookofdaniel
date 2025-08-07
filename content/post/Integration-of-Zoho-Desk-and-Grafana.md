+++
title = 'Integration of Zoho Desk and Grafana'
date = '2024-09-12T13:47:21+05:30'
draft = false
categories = ['Tech']
+++

Have you ever been a part of a hardworking team that, despite their efforts, ends up shouldering blame? If yes, our situation in operations might resonate with you. On any given day, our Zoho Desk is inundated with approximately 300 tickets, each falling under various classifications and priorities. Many of these tickets are complex and time-consuming to resolve, causing them to carry over to the next day and become overdue.

The challenge we face is the lack of visibility into critical metrics. Questions like the total number of tickets created, the various classifications in use, the resource who close the most tickets, and pending tickets are difficult to answer definitively. Convincing others about the work overload has proven to be quite a task.

While Zoho Desk does offer predefined dashboards and customization options, our workflow relies heavily on custom fields. Additionally, the platform lacks real-time monitoring capabilities.

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
    Zoho Desk offers a convenient feature that allows users to raise tickets via email. However, this feature creates tickets without mandatory fields, such as client or environment name. This calls for communicating the team over and over again resulting in time consumption.

**5. Real-Time Monitoring & Scoreboard:**
    The absence of a real-time dashboard has caused inefficiencies in tracking productivity.




> **Improving Daily work is even more important than doing daily work.**  - The Phoenix Project




# Solutions 

I have slept on these challenges for a day and explored the Zoho documentation along with some Google search. It seemed like I could solve some of these issues using zoho's features, while others might require development.

| Challenge     |   Solution    |
| :---------    | :--------     |
| Large Team Management | Proposed to split the team into multiple pods or pools. So that it can be managed by a senior / lead with minimal members and work can be monitored efficiently. <br> Pool segregation will be based on the number of clients.|
| Ticket Assignment Automation | Since the team is arranged into multiple pools, based on the client hierarchy, whenever a ticket is raised for the specific client it should be allocated directly to the respecitve pool. Then the pool lead / member can assign and work accordingly. <br> To Automate this process Zoho Desk provides a feature called [Direct Assignment](https://help.zoho.com/portal/en/kb/desk/automation/assignment-rules-notification/articles/creating-ticket-assignment-rules). Create an assignment rule with client name and select respective pool account. Viola! The ticket will be assigned automatically on creation. |
| Timely Escalation |  Zoho provides a feature called [SLAs](https://help.zoho.com/portal/en/kb/desk/automation/escalate-sla/articles/creating-and-using-slas) escalation. If an escalation occurs within x minutes it will be escalated to 2 levels. We chose to adopt it, so that the breached ticket will be esclated to the respective lead / manager of the pool within 30 mins. | 
Email Ticket with mandatory fields | We created a [Zoho Task](https://help.zoho.com/portal/en/kb/desk/activities/articles/working-with-tasks-zoho-desk#Creating_Tasks) to close the email ticket with an automated reply to fill the mandatory fields. So the tickets in which the mandatory fields are not filled will be closed automatically. |

## Real-Time Monitoring & Scoreboard
Zoho analytics with additional license offers Dashboard experience but I needed something more interesting like a real-time dashboard to proactively act on tickets which does not require additional license.

So I came up with a solution which is powered by Grafana Dashboard and projected it on a monitor. For that, I used zoho web hook, instead of polling ticket meta details from Zoho desk.

The Webhook listener is developed using a simple java script. The json payload recieved will be deserialized and stored in a relational database like SQL Server.

Then I created a Grafana Dashboard to pull the details from the database. 

### Architecture Diagram

![b](/images/zoho-integration-arch-diagram.webp)



### Final Results

![Zoho Real-Time Grafana Dashbord](/images/Zoho-Desk-Real-Time-Monitoring-on-TV.jpg)



By incorporating real-time monitoring for Zoho tickets, my team's productivity and efficiency increased tenfold. This enhancement not only bolstered accountability but also motivated everyone to aim higher and soar!


> **A great team doesn’t mean that they had the smartest people. What made those teams great is that everyone trusted one another. It can be a powerful thing when that magic dynamic exists.** - The Phoenix Project





