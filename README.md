# A timesheet generator to circumvent bureaucracy

The [German Mindestlohngesetz](https://de.wikipedia.org/wiki/Mindestlohngesetz_%28Deutschland%29)
([MiLoG](http://www.gesetze-im-internet.de/milog/)) protects marginally employeed people.
It is probably helpful for social equity. Unfortunately, also scientific assistants (Hiwis) and
even some research assistants belong to the group of the marginally employeed.

Within the scope of the new law (since April 2015), all these people are asked to fill out timesheets
to document their work. This is supposed to protect them from exploitation. However, this
created a bureaucratic monster in the academic environment. A scientific assistant gets a salary of
8,50 €/hour. With typically 20-80 hours per month, this does not make a good salary. Anyway in many
employment relationships, Professors as well as students do not track the working time. It is even
common practise to pay tutors generously with 60 hours/month, while they only hold 2 hour/week tutorials.
This practice compensates a bit the bad salary. In contrast, in other affairs, the actual work per month
is measured, not the time. In all cases, the working time is not that much a subject.

This repository contains Python2 code to generate time sheets which meet a desired amount of hours
per month. This meets the constraints required by the contracts and makes both the employee as well as
the leader happy. Employees are free to make use of this generator to get rid of this obligation.

## What it does

The code rolls the dice to create a realistic monthly working schedule, including

  * Random starting and end times
  * Breaks
  * Constraints on daily working times
  * Considering weekends
  * Considering national holidays (based on lists)

After creating a schedule, it is capable of evaluating an OpenOffic calc table as a template, modifying
the file and rendering the result as a PDF, ready for printing and signing.
