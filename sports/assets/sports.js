"use strict";

const loadingScreen = document.querySelector("#loadingScreen");
const landingPage = document.querySelector("#landingPage");
const metaDescription = document.querySelector("#metaDescription");

const siteLogoLink = document.querySelector("#siteLogoLink");
const siteLogo = document.querySelector("#siteLogo");

const signupLink = document.querySelector("#signupLink");
const loginLink = document.querySelector("#loginLink");

const sportsOfferPanel = document.querySelector("#sportsOfferPanel");
const sportsPreHeader = document.querySelector("#sportsPreHeader");
const sportsHeadline = document.querySelector("#sportsHeadline");
const sportsIntro = document.querySelector("#sportsIntro");
const sportsRevealButton = document.querySelector("#sportsRevealButton");

const sportsMatchListStage = document.querySelector("#sportsMatchListStage");
const matchListPreHeader = document.querySelector("#matchListPreHeader");
const matchListTitle = document.querySelector("#matchListTitle");
const matchListIntro = document.querySelector("#matchListIntro");
const matchChoiceGrid = document.querySelector("#matchChoiceGrid");

const selectionSummary = document.querySelector("#selectionSummary");
const selectionSummaryLabel = document.querySelector("#selectionSummaryLabel");
const selectionSummaryText = document.querySelector("#selectionSummaryText");
const sportsConfirmButton = document.querySelector("#sportsConfirmButton");

const sportsTermsSummary = document.querySelector("#sportsTermsSummary");
const sportsTermsToggle = document.querySelector("#sportsTermsToggle");
const sportsTermsDetails = document.querySelector("#sportsTermsDetails");
const sportsTermsDetailsText = document.querySelector("#sportsTermsDetailsText");

const sportsRewardStage = document.querySelector("#sportsRewardStage");
const rewardParticles = document.querySelector("#rewardParticles");
const sportsTicketImage = document.querySelector("#sportsTicketImage");

const sportsRewardLabel = document.querySelector("#sportsRewardLabel");
const sportsRewardTitle = document.querySelector("#sportsRewardTitle");
const sportsRewardPrediction = document.querySelector("#sportsRewardPrediction");
const sportsClaimButton = document.querySelector("#sportsClaimButton");
const sportsRewardTerms = document.querySelector("#sportsRewardTerms");

const paymentLogos = document.querySelector("#paymentLogos");
const legalText = document.querySelector("#legalText");
const legalLinks = document.querySelector("#legalLinks");

let config = null;
let interactionLocked = true;
let selectedMatch = null;
let selectedPrediction = null;
let selectedButton = null;
let predictionComplete = false;

initializeSports();

async function initializeSports() {
    const loaderDuration = 1500;
    const startTime = performance.now();

    try {
        const response = await fetch("config.json", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`Could not load config.json. Status: ${response.status}`);
        }

        config = await response.json();

        validateConfig();
        applySeo();
        applyBrand();
        applyHeader();
        applyCampaign();
        applyMatchSelectionContent();
        applyTerms();
        applyRewardAssets();
        renderMatches();
        renderPayments();
        renderLegal();
        bindEvents();

        const elapsedTime = performance.now() - startTime;
        const remainingTime = Math.max(0, loaderDuration - elapsedTime);

        await wait(remainingTime);

        finishLoading();
    } catch (error) {
        console.error("Sports initialization failed:", error);
        showError();
    }
}

function validateConfig() {
    if (!config || typeof config !== "object") {
        throw new Error("Configuration missing");
    }

    if (!config.campaign) {
        throw new Error("Campaign configuration missing");
    }

    if (!Array.isArray(config.matches) || config.matches.length === 0) {
        throw new Error("Matches configuration missing");
    }

    if (!Array.isArray(config.rewards) || config.rewards.length === 0) {
        throw new Error("Rewards configuration missing");
    }
}

function applySeo() {
    if (config.seo?.title) {
        document.title = config.seo.title;
    }

    if (metaDescription && config.seo?.description) {
        metaDescription.setAttribute(
            "content",
            config.seo.description
        );
    }
}

function applyBrand() {
    if (siteLogo && config.brand?.logo) {
        siteLogo.src = config.brand.logo;
    }

    if (siteLogo) {
        siteLogo.alt =
            config.brand?.logoAlt ||
            config.brand?.name ||
            "NexPlay";
    }

    if (siteLogoLink) {
        siteLogoLink.href =
            config.brand?.homeUrl ||
            "../index.html";

        siteLogoLink.setAttribute(
            "aria-label",
            `${config.brand?.name || "NexPlay"} home`
        );
    }
}

function applyHeader() {
    if (signupLink) {
        signupLink.textContent =
            config.header?.signup?.label ||
            "Sign Up";

        signupLink.href =
            config.header?.signup?.url ||
            "#signup";
    }

    if (loginLink) {
        loginLink.textContent =
            config.header?.login?.label ||
            "Log In";

        loginLink.href =
            config.header?.login?.url ||
            "#login";
    }
}

function applyCampaign() {
    const parameters =
        new URLSearchParams(window.location.search);

    const variant =
        parameters.get("variant")?.toUpperCase() ||
        "A";

    const variants =
        config.campaign?.headlineVariants ||
        {};

    if (sportsPreHeader) {
        sportsPreHeader.textContent =
            config.campaign.preHeader ||
            "";
    }

    if (sportsHeadline) {
        sportsHeadline.textContent =
            variants[variant] ||
            variants.A ||
            "";
    }

    if (sportsIntro) {
        sportsIntro.textContent =
            config.campaign.intro ||
            "";
    }

    if (sportsRevealButton) {
        sportsRevealButton.textContent =
            config.campaign?.revealButton?.label ||
            "Choose Your Match";

        sportsRevealButton.setAttribute(
            "aria-label",
            config.campaign?.revealButton?.ariaLabel ||
            "View today's featured matches"
        );
    }
}

function applyMatchSelectionContent() {
    const section =
        config.matchSelection ||
        {};

    if (matchListPreHeader) {
        matchListPreHeader.textContent =
            section.preHeader ||
            "";
    }

    if (matchListTitle) {
        matchListTitle.textContent =
            section.title ||
            "";
    }

    if (matchListIntro) {
        matchListIntro.textContent =
            section.intro ||
            "";
    }

    if (selectionSummaryLabel) {
        selectionSummaryLabel.textContent =
            section.selectionLabel ||
            "Your selection";
    }

    if (sportsConfirmButton) {
        sportsConfirmButton.textContent =
            section.confirmButton ||
            "Confirm Prediction";
    }
}

function applyTerms() {
    const terms =
        config.offerTerms ||
        {};

    if (sportsTermsSummary) {
        sportsTermsSummary.textContent =
            terms.summary ||
            "";
    }

    if (sportsTermsDetailsText) {
        sportsTermsDetailsText.textContent =
            terms.details ||
            "";
    }
}

function applyRewardAssets() {
    const panel =
        config.rewardPanel ||
        {};

    if (rewardParticles && panel.particlesImage) {
        rewardParticles.src =
            panel.particlesImage;
    }

    if (sportsTicketImage && panel.ticketImage) {
        sportsTicketImage.src =
            panel.ticketImage;
    }
}

function renderMatches() {
    if (!matchChoiceGrid) {
        return;
    }

    matchChoiceGrid.replaceChildren();

    config.matches.forEach((match) => {
        const card =
            document.createElement("article");

        card.className =
            "match-choice-card";

        const header =
            document.createElement("div");

        header.className =
            "match-choice-header";

        const competition =
            document.createElement("span");

        competition.textContent =
            match.competition ||
            "";

        const kickoff =
            document.createElement("small");

        kickoff.textContent =
            match.kickoff ||
            "";

        header.append(
            competition,
            kickoff
        );

        const teams =
            document.createElement("div");

        teams.className =
            "match-choice-teams";

        const home =
            createTeam(match.homeTeam);

        const versus =
            document.createElement("span");

        versus.className =
            "match-choice-vs";

        versus.textContent =
            "VS";

        const away =
            createTeam(match.awayTeam);

        teams.append(
            home,
            versus,
            away
        );

        const odds =
            document.createElement("div");

        odds.className =
            "match-choice-odds";

        match.predictionOptions.forEach((option) => {
            const button =
                document.createElement("button");

            button.type =
                "button";

            button.className =
                "match-odd-button";

            button.dataset.matchId =
                match.id;

            button.dataset.predictionId =
                option.id;

            const market =
                document.createElement("small");

            market.textContent =
                option.marketLabel ||
                "";

            const value =
                document.createElement("strong");

            value.textContent =
                option.odds ||
                "";

            button.append(
                market,
                value
            );

            button.setAttribute(
                "aria-label",
                `${match.homeTeam.name} versus ${match.awayTeam.name}: ${option.label} at ${option.odds}`
            );

            button.addEventListener(
                "click",
                () => {
                    choosePrediction(
                        match,
                        option,
                        button
                    );
                }
            );

            odds.appendChild(
                button
            );
        });

        card.append(
            header,
            teams,
            odds
        );

        matchChoiceGrid.appendChild(
            card
        );
    });
}

function createTeam(team = {}) {
    const wrapper =
        document.createElement("div");

    wrapper.className =
        "match-choice-team";

    const badge =
        document.createElement("div");

    badge.className =
        "match-choice-badge";

    renderTeamBadge(
        badge,
        team
    );

    const name =
        document.createElement("strong");

    name.textContent =
        team.name ||
        "";

    wrapper.append(
        badge,
        name
    );

    return wrapper;
}

function renderTeamBadge(badge, team = {}) {
    if (!badge) {
        return;
    }

    badge.replaceChildren();

    if (team.logo) {
        const image =
            document.createElement("img");

        image.src =
            team.logo;

        image.alt =
            `${team.name || "Team"} logo`;

        image.width =
            30;

        image.height =
            30;

        image.addEventListener(
            "error",
            () => {
                renderTeamInitials(
                    badge,
                    team
                );
            },
            {
                once: true
            }
        );

        badge.appendChild(
            image
        );

        return;
    }

    renderTeamInitials(
        badge,
        team
    );
}

function renderTeamInitials(badge, team = {}) {
    badge.replaceChildren();

    const initials =
        document.createElement("span");

    initials.textContent =
        team.shortName ||
        "";

    badge.appendChild(
        initials
    );
}

function choosePrediction(
    match,
    option,
    button
) {
    if (
        interactionLocked ||
        predictionComplete
    ) {
        return;
    }

    selectedMatch =
        match;

    selectedPrediction =
        option;

    if (selectedButton) {
        selectedButton.classList.remove(
            "is-selected"
        );

        selectedButton.setAttribute(
            "aria-pressed",
            "false"
        );
    }

    selectedButton =
        button;

    selectedButton.classList.add(
        "is-selected"
    );

    selectedButton.setAttribute(
        "aria-pressed",
        "true"
    );

    document
        .querySelectorAll(".match-choice-card")
        .forEach((card) => {
            card.classList.remove(
                "has-selection"
            );
        });

    button
        .closest(".match-choice-card")
        ?.classList.add(
            "has-selection"
        );

    if (selectionSummary) {
        selectionSummary.classList.add(
            "is-visible"
        );
    }

    if (selectionSummaryText) {
        selectionSummaryText.textContent =
            `${option.label} · ${option.odds}`;
    }

    if (sportsConfirmButton) {
        sportsConfirmButton.disabled =
            false;
    }
}

async function confirmPrediction() {
    if (
        interactionLocked ||
        predictionComplete ||
        !selectedMatch ||
        !selectedPrediction
    ) {
        return;
    }

    interactionLocked =
        true;

    predictionComplete =
        true;

    sportsConfirmButton.disabled =
        true;

    const buttons =
        document.querySelectorAll(
            ".match-odd-button"
        );

    buttons.forEach((button) => {
        button.disabled =
            true;

        if (button !== selectedButton) {
            button.classList.add(
                "is-locked"
            );
        }
    });

    await wait(
        500
    );

    const reward =
        getRandomReward();

    applySelectedReward(
        reward
    );

    sportsMatchListStage.classList.add(
        "is-hidden"
    );

    await wait(
        400
    );

    sportsMatchListStage.classList.remove(
        "is-visible"
    );

    sportsMatchListStage.setAttribute(
        "aria-hidden",
        "true"
    );

    sportsRewardStage.classList.add(
        "is-visible"
    );

    sportsRewardStage.setAttribute(
        "aria-hidden",
        "false"
    );

    await wait(
        750
    );

    interactionLocked =
        false;

    sportsClaimButton?.focus({
        preventScroll: true
    });
}

function getRandomReward() {
    const rewards =
        config.rewards;

    const randomIndex =
        Math.floor(
            Math.random() *
            rewards.length
        );

    return rewards[
        randomIndex
    ];
}

function applySelectedReward(reward) {
    const panel =
        config.rewardPanel ||
        {};

    if (sportsRewardLabel) {
        sportsRewardLabel.textContent =
            panel.label ||
            "";
    }

    if (sportsRewardTitle) {
        sportsRewardTitle.textContent =
            reward.label ||
            "";
    }

    if (sportsRewardPrediction) {
        sportsRewardPrediction.textContent =
            getPredictionText();
    }

    if (sportsClaimButton) {
        sportsClaimButton.textContent =
            panel.claimButton ||
            "Claim Now";

        sportsClaimButton.href =
            panel.claimUrl ||
            "#signup";
    }

    if (sportsRewardTerms) {
        sportsRewardTerms.textContent =
            panel.terms ||
            "18+ · Terms apply";
    }
}

function getPredictionText() {
    if (!selectedPrediction) {
        return "";
    }

    if (selectedPrediction.id === "draw") {
        return "Draw";
    }

    return `${selectedPrediction.label} to win`;
}

async function revealMatches() {
    if (
        interactionLocked ||
        !sportsOfferPanel ||
        !sportsMatchListStage
    ) {
        return;
    }

    interactionLocked =
        true;

    sportsRevealButton.disabled =
        true;

    sportsOfferPanel.classList.add(
        "is-hidden"
    );

    await wait(
        320
    );

    sportsMatchListStage.classList.add(
        "is-visible"
    );

    sportsMatchListStage.setAttribute(
        "aria-hidden",
        "false"
    );

    await wait(
        500
    );

    interactionLocked =
        false;

    matchChoiceGrid
        ?.querySelector(".match-odd-button")
        ?.focus();
}

function toggleTerms() {
    if (
        !sportsTermsToggle ||
        !sportsTermsDetails
    ) {
        return;
    }

    const expanded =
        sportsTermsToggle.getAttribute("aria-expanded") === "true";

    const newExpanded =
        !expanded;

    sportsTermsToggle.setAttribute(
        "aria-expanded",
        String(newExpanded)
    );

    sportsTermsToggle.setAttribute(
        "aria-label",
        newExpanded
            ? "Hide offer terms"
            : "Show offer terms"
    );

    sportsTermsDetails.classList.toggle(
        "is-open",
        newExpanded
    );
}

function renderPayments() {
    if (!paymentLogos) {
        return;
    }

    paymentLogos.replaceChildren();

    const methods =
        Array.isArray(config.paymentMethods)
            ? config.paymentMethods
            : [];

    methods.forEach((method) => {
        const image =
            document.createElement("img");

        image.className =
            "payment-logo";

        image.src =
            method.image;

        image.alt =
            method.name;

        image.height =
            26;

        if (method.width) {
            image.width =
                method.width;
        }

        paymentLogos.appendChild(
            image
        );
    });
}

function renderLegal() {
    if (legalText) {
        legalText.textContent =
            config.legal?.text ||
            "";
    }

    if (!legalLinks) {
        return;
    }

    legalLinks.replaceChildren();

    const links =
        Array.isArray(config.legal?.links)
            ? config.legal.links
            : [];

    links.forEach((item) => {
        const link =
            document.createElement("a");

        link.href =
            item.url;

        link.textContent =
            item.label;

        legalLinks.appendChild(
            link
        );
    });
}

function bindEvents() {
    sportsRevealButton?.addEventListener(
        "click",
        revealMatches
    );

    sportsConfirmButton?.addEventListener(
        "click",
        confirmPrediction
    );

    sportsTermsToggle?.addEventListener(
        "click",
        toggleTerms
    );
}

function finishLoading() {
    interactionLocked =
        false;

    landingPage?.classList.add(
        "is-ready"
    );

    landingPage?.setAttribute(
        "aria-hidden",
        "false"
    );

    loadingScreen?.classList.add(
        "is-hidden"
    );

    loadingScreen?.setAttribute(
        "aria-hidden",
        "true"
    );
}

function showError() {
    loadingScreen?.classList.add(
        "is-hidden"
    );

    landingPage?.classList.add(
        "is-ready"
    );

    landingPage?.setAttribute(
        "aria-hidden",
        "false"
    );

    if (landingPage) {
        landingPage.innerHTML = `
            <section class="config-error">
                <h1>Unable to load this experience</h1>
                <p>Please refresh the page and try again.</p>
            </section>
        `;
    }
}

function wait(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(
            resolve,
            milliseconds
        );
    });
}