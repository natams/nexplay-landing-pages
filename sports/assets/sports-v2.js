"use strict";

const $ = (selector) => document.querySelector(selector);

const loadingScreen = $("#loadingScreen");
const landingPage = $("#landingPage");
const metaDescription = $("#metaDescription");
const sportsHero = $(".sports-hero");

const siteLogoLink = $("#siteLogoLink");
const siteLogo = $("#siteLogo");
const signupLink = $("#signupLink");
const loginLink = $("#loginLink");

const offerStage = $("#offerStage");
const sportsPreHeader = $("#sportsPreHeader");
const headlineTop = $("#headlineTop");
const headlineBottom = $("#headlineBottom");
const sportsIntro = $("#sportsIntro");
const startButton = $("#startButton");

const shotStage = $("#shotStage");
const shotEyebrow = $("#shotEyebrow");
const shotTitle = $("#shotTitle");
const shotIntro = $("#shotIntro");
const goalZone = $("#goalZone");
const targetLayer = $("#targetLayer");
const pitchInteraction = $("#pitchInteraction");
const shotBall = $("#shotBall");
const shootButton = $("#shootButton");

const resultStage = $("#resultStage");
const resultEyebrow = $("#resultEyebrow");
const resultTitle = $("#resultTitle");
const resultCopy = $("#resultCopy");
const claimButton = $("#claimButton");
const stadiumLights = $("#stadiumLights");

const sportsTermsSummary = $("#sportsTermsSummary");
const sportsTermsToggle = $("#sportsTermsToggle");
const sportsTermsDetails = $("#sportsTermsDetails");
const sportsTermsDetailsText = $("#sportsTermsDetailsText");
const paymentLogos = $("#paymentLogos");
const legalText = $("#legalText");
const legalLinks = $("#legalLinks");

let config = null;
let selectedTarget = null;
let selectedTargetButton = null;
let interactionLocked = true;

initializeSports();

async function initializeSports() {
    const startedAt = performance.now();

    try {
        const response = await fetch("config-v2.json", { cache: "no-store" });
        if (!response.ok) throw new Error(`Could not load config-v2.json (${response.status})`);

        config = await response.json();
        validateConfig();
        applyConfig();
        bindEvents();

        const remaining = Math.max(0, 900 - (performance.now() - startedAt));
        await wait(remaining);
        finishLoading();
    } catch (error) {
        console.error("Sports V2 initialization failed:", error);
        showError();
    }
}

function validateConfig() {
    if (!config?.campaign) throw new Error("Campaign configuration missing");
    if (!config?.shotGame?.targets?.length) throw new Error("Shot targets missing");
    if (!config?.result) throw new Error("Result configuration missing");
}

function applyConfig() {
    applySeoAndBrand();
    applyCampaign();
    applyShotGame();
    applyResult();
    applyAssets();
    applyTerms();
    renderPayments();
    renderLegal();
}

function applySeoAndBrand() {
    if (config.seo?.title) document.title = config.seo.title;
    if (metaDescription && config.seo?.description) metaDescription.content = config.seo.description;

    if (siteLogo) {
        siteLogo.src = config.brand?.logo || "img/logo.svg";
        siteLogo.alt = config.brand?.logoAlt || config.brand?.name || "NexPlay";
    }

    if (siteLogoLink) {
        siteLogoLink.href = config.brand?.homeUrl || "../index.html";
        siteLogoLink.setAttribute("aria-label", `${config.brand?.name || "NexPlay"} home`);
    }

    if (signupLink) {
        signupLink.textContent = config.header?.signup?.label || "Sign Up";
        signupLink.href = config.header?.signup?.url || "#claim";
    }

    if (loginLink) {
        loginLink.textContent = config.header?.login?.label || "Log In";
        loginLink.href = config.header?.login?.url || "#login";
    }
}

function applyCampaign() {
    sportsPreHeader.textContent = config.campaign.preHeader || "";
    headlineTop.textContent = config.campaign.headlineTop || "";
    headlineBottom.textContent = config.campaign.headlineBottom || "";
    sportsIntro.textContent = config.campaign.intro || "";
    startButton.textContent = config.campaign.startButton || "Take Your Shot";
}

function applyShotGame() {
    const game = config.shotGame;
    shotEyebrow.textContent = game.eyebrow || "";
    shotTitle.textContent = game.title || "";
    shotIntro.textContent = game.intro || "";
    shootButton.textContent = game.shootButton || "Shoot";
    goalZone.setAttribute("aria-label", game.ariaInstruction || "Choose a goal target");

    targetLayer.replaceChildren();

    game.targets.forEach((target) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "shot-target";
        button.dataset.targetId = target.id;
        button.style.left = `${target.x}%`;
        button.style.top = `${target.y}%`;
        button.setAttribute("aria-pressed", "false");
        button.setAttribute("aria-label", "Select this target");

        button.addEventListener("click", () => chooseTarget(target, button));
        targetLayer.appendChild(button);
    });
}

function applyResult() {
    resultEyebrow.textContent = config.result.eyebrow || "";
    resultTitle.textContent = config.result.title || "";
    resultCopy.textContent = config.result.copy || "";
    claimButton.textContent = config.result.claimButton || "Claim Offer";
    claimButton.href = config.result.claimUrl || "#claim";
}

function applyAssets() {
    const assets = config.assets || {};

    if (shotBall && assets.ball) shotBall.src = assets.ball;
    if (stadiumLights && assets.lights) stadiumLights.src = assets.lights;
}

function applyTerms() {
    sportsTermsSummary.textContent = config.offerTerms?.summary || "";
    sportsTermsDetailsText.textContent = config.offerTerms?.details || "";
}

function chooseTarget(target, button) {
    if (interactionLocked) return;

    selectedTarget = target;

    if (selectedTargetButton) {
        selectedTargetButton.classList.remove("is-selected");
        selectedTargetButton.setAttribute("aria-pressed", "false");
    }

    selectedTargetButton = button;
    selectedTargetButton.classList.add("is-selected");
    selectedTargetButton.setAttribute("aria-pressed", "true");

    shootButton.disabled = false;
}


function fireGoalConfetti(targetButton) {
    if (typeof confetti !== "function" || !targetButton) return;

    const rect = targetButton.getBoundingClientRect();
    const origin = {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight
    };

    const colors = ["#ff3aa8", "#9d18ff", "#2f63ff", "#ffffff"];

    confetti({
        particleCount: 90,
        startVelocity: 44,
        spread: 78,
        ticks: 180,
        gravity: 1,
        scalar: 0.9,
        colors,
        origin
    });

    setTimeout(() => {
        confetti({
            particleCount: 55,
            startVelocity: 32,
            spread: 115,
            ticks: 165,
            gravity: 1.08,
            scalar: 0.8,
            colors,
            origin
        });
    }, 140);
}

async function startGame() {
    if (interactionLocked) return;
    interactionLocked = true;

    switchStage(offerStage, shotStage);
    await wait(430);

    interactionLocked = false;
    targetLayer.querySelector(".shot-target")?.focus({ preventScroll: true });
}

async function takeShot() {
    if (interactionLocked || !selectedTarget || !selectedTargetButton) return;
    interactionLocked = true;
    shootButton.disabled = true;

    targetLayer.querySelectorAll(".shot-target").forEach((button) => {
        button.disabled = true;
        if (button !== selectedTargetButton) button.style.opacity = ".3";
    });

    const ballRect = shotBall.getBoundingClientRect();
    const targetRect = selectedTargetButton.getBoundingClientRect();
    const dx = (targetRect.left + targetRect.width / 2) - (ballRect.left + ballRect.width / 2);
    const dy = (targetRect.top + targetRect.height / 2) - (ballRect.top + ballRect.height / 2);
    const curve = dx === 0 ? 14 : Math.sign(dx) * Math.min(58, Math.abs(dx) * .18);

    pitchInteraction.classList.add("is-shooting");

const animation = shotBall.animate([
    {
        transform: "translate(0, 0) rotate(0deg) scale(1)",
        offset: 0
    },
    {
        transform: `translate(${dx * .48 + curve}px, ${dy * .43 - 34}px) rotate(${dx > 0 ? 260 : -260}deg) scale(.72)`,
        offset: .48
    },
    {
        transform: `translate(${dx}px, ${dy}px) rotate(${dx > 0 ? 620 : -620}deg) scale(.24)`,
        offset: 1
    }
], {
    duration: 820,
    easing: "cubic-bezier(.18,.7,.22,1)",
    fill: "forwards"
});

    await animation.finished;

    selectedTargetButton.classList.add("is-hit");
    fireGoalConfetti(selectedTargetButton);
    sportsHero.classList.remove("is-impact");
    void sportsHero.offsetWidth;
    sportsHero.classList.add("is-impact");

    await wait(430);
    switchStage(shotStage, resultStage);
    await wait(500);

    claimButton.focus({ preventScroll: true });
    interactionLocked = false;
}


function resetShot() {
    selectedTarget = null;
    selectedTargetButton = null;
    shootButton.disabled = true;
    pitchInteraction.classList.remove("is-shooting");
    sportsHero.classList.remove("is-impact");

    shotBall.getAnimations().forEach((animation) => animation.cancel());
    shotBall.style.removeProperty("transform");

    targetLayer.querySelectorAll(".shot-target").forEach((button) => {
        button.disabled = false;
        button.style.removeProperty("opacity");
        button.classList.remove("is-selected", "is-hit");
        button.setAttribute("aria-pressed", "false");
    });
}

function switchStage(from, to) {
    from?.classList.remove("is-active");
    from?.setAttribute("aria-hidden", "true");
    to?.classList.add("is-active");
    to?.setAttribute("aria-hidden", "false");
}

function toggleTerms() {
    const expanded = sportsTermsToggle.getAttribute("aria-expanded") === "true";
    sportsTermsToggle.setAttribute("aria-expanded", String(!expanded));
    sportsTermsDetails.classList.toggle("is-open", !expanded);
}

function renderPayments() {
    paymentLogos.replaceChildren();
    (config.paymentMethods || []).forEach((method) => {
        const image = document.createElement("img");
        image.className = "payment-logo";
        image.src = method.image;
        image.alt = method.name;
        image.height = 26;
        if (method.width) image.width = method.width;
        paymentLogos.appendChild(image);
    });
}

function renderLegal() {
    legalText.textContent = config.legal?.text || "";
    legalLinks.replaceChildren();

    (config.legal?.links || []).forEach((item) => {
        const link = document.createElement("a");
        link.href = item.url;
        link.textContent = item.label;
        legalLinks.appendChild(link);
    });
}

function bindEvents() {
    startButton.addEventListener("click", startGame);
    shootButton.addEventListener("click", takeShot);
    sportsTermsToggle.addEventListener("click", toggleTerms);
}

function finishLoading() {
    interactionLocked = false;
    landingPage.classList.add("is-ready");
    landingPage.setAttribute("aria-hidden", "false");
    loadingScreen.classList.add("is-hidden");
    loadingScreen.setAttribute("aria-hidden", "true");
}

function showError() {
    loadingScreen?.classList.add("is-hidden");
    landingPage?.classList.add("is-ready");
    landingPage?.setAttribute("aria-hidden", "false");

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
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
