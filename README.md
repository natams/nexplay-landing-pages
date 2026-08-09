# NexPlay Interactive Landing Pages

<sub>Casino + Sports promotional landing page concepts created for the home assignment.</sub>

### Live Demo
https://natams.github.io/nexplay-landing-pages/



## Overview

This project includes two promotional landing page concepts:

**Casino**  
Daily reward wheel

**Sports**  
Match prediction + reward reveal

I also created a simple index page so both concepts can be accessed from one place.

Built with **HTML, CSS and vanilla JavaScript**.

I kept the project intentionally lightweight and avoided adding frameworks or external libraries that were not necessary for this type of landing page.



## Why I used config files

Campaign content is separated from the interaction logic using local `config.json` files.

This includes things like:

- headlines
- rewards
- teams
- odds
- CTA copy
- images
- legal copy

This means campaign content can be updated without rewriting the JavaScript.

Both pages also support simple headline variants using:

`?variant=A`

or:

`?variant=B`



## Casino

The Casino concept follows a very simple flow:

**Spin → reveal reward → claim reward**

The wheel result is connected to the reward popup, so the result shown matches the segment where the wheel stops.

There is also a possible **No Reward** result.

### Why the wheel resets on refresh

After the user spins, the wheel is locked for the current page session.

I deliberately did **not** save this state in `localStorage`.

This is a standalone demo for an assessment, and I wanted the reviewer to be able to refresh the page and replay the interaction without clearing browser data.

<sub>In production, this state should come from the authenticated user account rather than from the browser.</sub>

### How I handled this at Playtech

When I worked at Playtech, promotional mechanics such as cards and spin wheels were connected to the user account and IMS.

A typical flow was:

**Open promotion → check eligibility → play mechanic → reveal reward → opt in → update user tag → prevent another play**

For example, once a user opted in to a reward, a tag could be added to their account in IMS. That tag could then be used to determine whether they were still eligible to interact with the promotion.

That is how I would expect this mechanic to work once connected to a real user system.

### Logged-in vs logged-out users

The CTA would also change based on login state.

Logged-out user:

`LOG IN TO CLAIM`

Logged-in eligible user:

`CLAIM NOW`

This is also the type of segmentation I worked with at Playtech.

Another possible setup would allow a logged-out user to reveal a reward first and reserve it for a limited time while they log in or register.

The exact flow would depend on the campaign rules.



## Sports

For Sports I wanted a different interaction rather than repeating another random mechanic.

The flow is:

**Choose match → select 1 / X / 2 → confirm prediction → reveal reward**

The user can change their prediction before confirming it.

The fixtures, odds and rewards are demo content.

<sub>In production, these would normally come from backend services or a live sports data feed.</sub>



## Responsive design

Both pages were designed mobile-first and then adapted for larger screens.

I also made layout decisions based on the content rather than simply stretching the mobile version.

For example, the Sports match cards keep the odds aligned even when longer team names wrap onto two lines.



## Fonts and external libraries

I intentionally did not add external font libraries or services for this assignment.

I wanted the project to stay self-contained and avoid adding dependencies only for typography.

For the demo I used browser and system-available fonts and created the visual hierarchy through CSS.

<sub>In a real work task I would use the approved brand fonts and load them according to the brand and technical requirements of the product.</sub>

The same approach applies to JavaScript libraries. If vanilla JavaScript and CSS were enough, I preferred not to add another dependency.



## Accessibility and interaction

I included:

- semantic buttons
- ARIA labels
- keyboard focus after important interactions
- Escape support for the Casino reward popup
- expandable Sports offer terms
- disabled states to prevent duplicate actions
- reduced-motion handling

<sub>A production release would still go through full keyboard, screen-reader and accessibility QA.</sub>



## Production setup

This demo uses local JSON and client-side state only.

In production I would expect it to connect to systems for:

- authentication
- player eligibility
- user tags
- reward / bonus opt-in
- live sportsbook data
- promotion dates
- localisation
- compliance content
- analytics

The important interaction events I would want to track include:

`spin_started`  
`reward_revealed`  
`prediction_selected`  
`prediction_confirmed`  
`claim_clicked`  
`login_clicked`



## Final note

I wanted both pages to feel like real promotional experiences rather than static landing page designs with an animation added on top.

The demo keeps account-dependent logic separate instead of pretending that browser storage is a real user system.