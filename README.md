# NexPlay Interactive Campaign Landing Pages

A pair of interactive promotional landing page concepts for a fictional sports and casino brand, created as part of a recruitment assessment for the Growth Product Builder, Performance Marketing role at 365Scores / Entain.

**Live demo:** https://natams.github.io/nexplay-landing-pages/

## Project overview

The project explores how a promotional landing page can do more than communicate an offer. Each concept uses a simple, focused interaction to make the campaign feel engaging and connected to the product.

The project includes:

**Casino**

An interactive daily reward wheel. Users spin the wheel, see the result and are invited to claim their reward.

**Sports**

A football themed take on a familiar “Bet 10, Get 10” promotion. The interaction adds a twist to the offer, giving users the chance to unlock a higher reward of 20 or 30 instead of the standard 10.

I also created a simple index page so both experiences can be accessed from one place.

Built with **HTML, CSS and vanilla JavaScript**.

I kept the implementation lightweight and avoided frameworks or external libraries that were not necessary for the experience.

## Thinking behind the concepts

Before designing the pages, I looked at promotional experiences across casino and sportsbook products. Many campaign pages rely mainly on an offer, a headline and a call to action. I wanted to keep that clarity while giving users a reason to interact with the page before reaching the conversion point.

For Casino, I chose a reward wheel because it is an instantly recognisable mechanic. The anticipation of the spin and the reveal make the reward feel more engaging than a static offer.

For Sports, I started with a familiar sportsbook promotion: “Bet 10, Get 10”. I wanted to give that straightforward offer an extra layer of excitement by introducing the chance to receive 20 or 30. The football themed interaction makes the enhanced reward feel like part of the campaign experience, rather than simply presenting different bonus amounts in the offer copy.

Both concepts were designed around a clear sequence. The interaction should be easy to understand, quick to complete and focused on the campaign objective rather than feeling like a separate game.

## Campaign content and configuration

Campaign content is separated from the interaction logic using local `config.json` files.

The configuration includes content such as:

* Headlines and supporting copy
* Rewards
* Teams and match information where relevant
* Odds where relevant
* Call to action copy
* Images
* Legal copy

This makes it possible to update campaign content without rewriting the JavaScript.

Both experiences also support headline variants through URL parameters:

`?variant=A`

`?variant=B`

This provides a simple way to test alternative campaign messaging.

## Casino experience

### Reward wheel

The Casino experience follows one clear flow:

**Spin → Reveal reward → Claim reward**

The result is connected to the reward reveal, so the reward shown matches the segment where the wheel stops. The wheel also includes a possible no reward result.

### Session behaviour

After a user spins, the wheel is locked for the current page session. I chose not to save this state in `localStorage` because this is a standalone demo and I wanted it to be easy to refresh and replay during review.

In a production environment, eligibility and play history would be managed by the relevant account and campaign systems rather than by browser storage.

### Login and claim states

The concept also considers different user states. For example, a logged out user can be prompted to log in to claim, while an eligible logged in user can proceed directly to the claim action.

The exact flow would depend on the campaign rules and the operator's account and reward systems.

## Sports experience

### A twist on “Bet 10, Get 10”

The Sports concept takes a familiar “Bet 10, Get 10” promotion and adds a chance to receive a higher reward of 20 or 30.

The football themed interaction gives the user a more engaging way to take part in the offer. Instead of displaying a standard bonus message alone, the campaign builds a moment of anticipation around which reward the user might unlock.

I chose this direction because it keeps the underlying promotion easy to understand while adding an interactive element that makes the offer feel more memorable. The reward amounts and campaign rules shown in the demo are illustrative. In a production environment, the reward outcome, eligibility and claim process would need to be validated by backend services and governed by the campaign's terms.

## Responsive design

Both pages were designed with mobile use in mind and adapted for larger screens.

I made layout decisions based on the content and interaction rather than simply stretching the mobile layout. The goal was to keep the main action clear and the experience usable across screen sizes.

## Technical approach

I used HTML, CSS and vanilla JavaScript to keep the project self contained and easy to understand.

Campaign content is kept separate from interaction logic through configuration files. This makes the concepts easier to maintain and allows copy, rewards and other campaign details to be changed without editing the core behaviour.

I avoided adding dependencies where native browser capabilities were sufficient.

## Accessibility and interaction

The implementation includes:

* Semantic buttons
* ARIA labels
* Keyboard focus management after important interactions
* Escape key support for the Casino reward popup
* Expandable Sports offer terms
* Disabled states to prevent duplicate actions
* Reduced motion handling

A production release would still require a full accessibility review, including keyboard and screen reader testing.

## What I would consider for production

The current project is a front end demonstration. A production version would need to connect to the operator's systems and campaign services.

Depending on the final campaign requirements, this could include:

* User authentication
* Reward eligibility and claim validation
* Campaign dates and availability
* Account and session state
* Live campaign content
* Localisation
* Legal and compliance content
* Analytics and conversion tracking

I would also run a full QA process in a staging environment, covering responsive behaviour, interaction states, accessibility, cross browser compatibility and validation of the connected campaign logic.

Useful interaction events to measure could include:

`spin_started`

`reward_revealed`

`sports_offer_interaction`

`reward_amount_revealed`

`reward_claim_clicked`

`login_clicked`

These events would help measure engagement with each mechanic and identify where users leave the campaign flow.

## Final thoughts

My aim was to create two promotional experiences that feel interactive and purposeful, rather than static landing pages with an animation added for decoration.

The Casino concept uses a familiar reward mechanic to build anticipation. The Sports concept takes a more visual approach, using movement and a reward reveal to create a stronger connection to the sporting context.

Throughout the project, I focused on keeping the user journey clear, the implementation lightweight and the campaign content easy to update.
