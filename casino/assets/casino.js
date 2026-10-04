"use strict";

const loadingScreen = document.querySelector("#loadingScreen");
const landingPage = document.querySelector("#landingPage");
const metaDescription = document.querySelector("#metaDescription");

const siteLogoLink = document.querySelector("#siteLogoLink");
const siteLogo = document.querySelector("#siteLogo");

const signupLink = document.querySelector("#Link");
const loginLink = document.querySelector("#loginLink");

const preHeader = document.querySelector("#preHeader");
const casinoHeadline = document.querySelector("#casinoHeadline");
const casinoIntro = document.querySelector("#casinoIntro");

const wheel = document.querySelector("#wheel");
const wheelTitle = document.querySelector("#wheelTitle");
const wheelDisc = document.querySelector("#wheelDisc");
const wheelDiscImage = wheelDisc ? wheelDisc.querySelector("img") : null;
const wheelFrame = document.querySelector("#wheelFrame");
const wheelPointer = document.querySelector("#wheelPointer");
const wheelSpinButtonImage = document.querySelector("#wheelSpinButtonImage");
const spinButton = document.querySelector("#spinButton");

const rewardPopup = document.querySelector("#rewardPopup");
const rewardCard = document.querySelector("#rewardCard");
const rewardLabel = document.querySelector("#rewardLabel");
const rewardTitle = document.querySelector("#rewardTitle");
const rewardDescription = document.querySelector("#rewardDescription");
const claimButton = document.querySelector("#claimButton");
const rewardTerms = document.querySelector("#rewardTerms");
const rewardCloseButton = document.querySelector("#rewardCloseButton");

const spinCompletePopup = document.querySelector("#spinCompletePopup");
const spinCompleteLabel = document.querySelector("#spinCompleteLabel");
const spinCompleteTitle = document.querySelector("#spinCompleteTitle");
const howItWorks = document.querySelector("#howItWorks");
const paymentLogos = document.querySelector("#paymentLogos");
const legalText = document.querySelector("#legalText");
const legalLinks = document.querySelector("#legalLinks");

let config = null;
let interactionLocked = true;
let spinComplete = false;
let currentRotation = 0;

initializeCasino();

async function initializeCasino() {
  const loaderDuration = 1500;
  const startTime = performance.now();

  try {
    const response = await fetch("config.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(
        `Could not load config.json. Status: ${response.status}`
      );
    }

    config = await response.json();

    validateConfig();
    applySeo();
    applyBrand();
    applyHeader();
    applyCampaign();
    applyWheelAssets();
    applySpinCompleteContent();
    renderSteps();
    renderPayments();
    renderLegal();
    bindEvents();

    const elapsedTime =
      performance.now() - startTime;

    const remainingTime =
      Math.max(
        0,
        loaderDuration - elapsedTime
      );

    await wait(
      remainingTime
    );

    finishLoading();
  } catch (error) {
    console.error(
      "Casino initialization failed:",
      error
    );

    showError();
  }
}

function validateConfig() {
  if (
    !config ||
    typeof config !== "object"
  ) {
    throw new Error(
      "Configuration missing"
    );
  }

  if (
    !config.campaign ||
    typeof config.campaign !== "object"
  ) {
    throw new Error(
      "Campaign configuration missing"
    );
  }

  if (
    !config.wheel ||
    typeof config.wheel !== "object"
  ) {
    throw new Error(
      "Wheel configuration missing"
    );
  }

  if (
    !Array.isArray(config.rewards) ||
    config.rewards.length === 0
  ) {
    throw new Error(
      "Rewards configuration missing"
    );
  }

  if (!wheelDisc) {
    throw new Error(
      "Wheel disc holder not found"
    );
  }

  if (!wheelDiscImage) {
    throw new Error(
      "Wheel disc image not found"
    );
  }

  if (!spinButton) {
    throw new Error(
      "Spin button not found"
    );
  }
}

function applySeo() {
  if (config.seo?.title) {
    document.title =
      config.seo.title;
  }

  if (
    metaDescription &&
    config.seo?.description
  ) {
    metaDescription.setAttribute(
      "content",
      config.seo.description
    );
  }
}

function applyBrand() {
  if (
    siteLogo &&
    config.brand?.logo
  ) {
    siteLogo.src =
      config.brand.logo;
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
      "#";
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
  const urlParameters =
    new URLSearchParams(
      window.location.search
    );

  const variant =
    urlParameters
      .get("variant")
      ?.toUpperCase() ||
    "A";

  const variants =
    config.campaign?.headlineVariants ||
    {};

  if (preHeader) {
    preHeader.textContent =
      config.campaign.preHeader ||
      "";
  }

  if (casinoHeadline) {
    casinoHeadline.textContent =
      variants[variant] ||
      variants.A ||
      "";
  }

  if (casinoIntro) {
    casinoIntro.textContent =
      config.campaign.intro ||
      "";
  }
}

function applyWheelAssets() {
  if (
    wheelTitle &&
    config.wheel.titleImage
  ) {
    wheelTitle.src =
      config.wheel.titleImage;
  }

  if (
    wheelDiscImage &&
    config.wheel.discImage
  ) {
    wheelDiscImage.src =
      config.wheel.discImage;
  }

  if (
    wheelFrame &&
    config.wheel.frameImage
  ) {
    wheelFrame.src =
      config.wheel.frameImage;
  }

  if (
    wheelPointer &&
    config.wheel.pointerImage
  ) {
    wheelPointer.src =
      config.wheel.pointerImage;
  }

  if (
    wheelSpinButtonImage &&
    config.wheel.buttonImage
  ) {
    wheelSpinButtonImage.src =
      config.wheel.buttonImage;
  }
}

function applySpinCompleteContent() {
  const content =
    config.spinComplete ||
    {};

  if (spinCompleteLabel) {
    spinCompleteLabel.textContent =
      content.label ||
      "Daily Spin Complete";
  }

  if (spinCompleteTitle) {
    spinCompleteTitle.textContent =
      content.title ||
      "You've Already Spun";
  }
}

function bindEvents() {
  spinButton.addEventListener(
    "click",
    spinWheel
  );

  rewardCloseButton?.addEventListener(
    "click",
    closeRewardPopup
  );

  document.addEventListener(
    "keydown",
    handleKeydown
  );
}

async function spinWheel() {
  if (
    interactionLocked ||
    spinComplete
  ) {
    return;
  }

  interactionLocked = true;

  spinComplete = true;

  spinButton.disabled = true;

  const reward =
    getRandomReward();

  const targetRotation =
    calculateRotation(reward);

  const duration =
    Number(
      config.wheel.spinDuration
    ) ||
    5000;

  wheelDisc.style.transition =
    `transform ${duration}ms cubic-bezier(0.12, 0.72, 0.18, 1)`;

  wheelDisc.style.transform =
    `translate(-50%, -50%) rotate(${targetRotation}deg)`;

  currentRotation =
    targetRotation;

  await wait(
    duration + 250
  );

  showReward(
    reward
  );
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

function calculateRotation(reward) {
  const segmentCount =
    Number(
      config.wheel.segmentCount
    ) ||
    6;

  const segmentSize =
    360 /
    segmentCount;

  const extraTurns =
    Number(
      config.wheel.extraTurns
    ) ||
    6;

  const segmentOffset =
    Number(
      config.wheel.segmentOffset
    ) ||
    0;

  const segmentIndex =
    Number(
      reward.segmentIndex
    ) ||
    0;

  const targetAngle =
    360 -
    segmentIndex *
    segmentSize +
    segmentOffset;

  return (
    currentRotation +
    extraTurns *
    360 +
    targetAngle
  );
}

function showReward(reward) {
  if (
    !rewardPopup ||
    !rewardCard
  ) {
    return;
  }

  rewardPopup.classList.add(
    "is-visible"
  );

  rewardPopup.setAttribute(
    "aria-hidden",
    "false"
  );

  if (rewardTerms) {
    rewardTerms.textContent =
      config.rewardModal?.terms ||
      "";
  }

  if (
    reward.isWin === false
  ) {
    showNoRewardResult();
  } else {
    showWinningResult(
      reward
    );
  }

  rewardCard.focus({
    preventScroll: true
  });

  interactionLocked =
    false;
}

function showWinningResult(reward) {
  const modal =
    config.rewardModal?.win;

  if (!modal) {
    return;
  }

  rewardCard.classList.remove(
    "is-no-reward"
  );

  if (rewardLabel) {
    rewardLabel.textContent =
      modal.label ||
      "";
  }

  if (rewardTitle) {
    rewardTitle.textContent =
      (
        modal.titleTemplate ||
        "{{reward}}"
      ).replace(
        "{{reward}}",
        reward.label
      );
  }

  if (rewardDescription) {
    rewardDescription.textContent =
      modal.description ||
      "";
  }

  if (claimButton) {
    claimButton.classList.remove(
      "is-hidden"
    );

    claimButton.textContent =
      modal.claimButton ||
      "Log In to Claim";

    claimButton.href =
      modal.claimUrl ||
      "#login";
  }
}

function showNoRewardResult() {
  const modal =
    config.rewardModal?.lose;

  if (!modal) {
    return;
  }

  rewardCard.classList.add(
    "is-no-reward"
  );

  if (rewardLabel) {
    rewardLabel.textContent =
      modal.label ||
      "";
  }

  if (rewardTitle) {
    rewardTitle.textContent =
      modal.title ||
      "No Reward Today";
  }

  if (rewardDescription) {
    rewardDescription.textContent =
      modal.description ||
      "Better luck tomorrow.";
  }

  if (claimButton) {
    claimButton.classList.add(
      "is-hidden"
    );
  }
}

function closeRewardPopup() {
  if (
    !rewardPopup ||
    !spinComplete
  ) {
    return;
  }

  rewardPopup.classList.remove(
    "is-visible"
  );

  rewardPopup.setAttribute(
    "aria-hidden",
    "true"
  );

  landingPage?.classList.add(
    "has-completed-spin"
  );

  spinCompletePopup?.classList.add(
    "is-visible"
  );

  spinCompletePopup?.setAttribute(
    "aria-hidden",
    "false"
  );
}

function handleKeydown(event) {
  if (
    event.key === "Escape" &&
    rewardPopup?.classList.contains(
      "is-visible"
    )
  ) {
    closeRewardPopup();
  }
}

function renderSteps() {
  if (!howItWorks) {
    return;
  }

  howItWorks.replaceChildren();

  const steps =
    Array.isArray(config.steps)
      ? config.steps
      : [];

  steps.forEach((step) => {
    const card =
      document.createElement(
        "article"
      );

    card.className =
      "step-card";

    const number =
      document.createElement(
        "span"
      );

    number.className =
      "step-number";

    number.textContent =
      step.number;

    const title =
      document.createElement(
        "h3"
      );

    title.textContent =
      step.title;

    card.append(
      number,
      title
    );

    howItWorks.appendChild(
      card
    );
  });
}

function renderPayments() {
  if (!paymentLogos) {
    return;
  }

  paymentLogos.replaceChildren();

  const methods =
    Array.isArray(
      config.paymentMethods
    )
      ? config.paymentMethods
      : [];

  methods.forEach((method) => {
    const image =
      document.createElement(
        "img"
      );

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
    Array.isArray(
      config.legal?.links
    )
      ? config.legal.links
      : [];

  links.forEach((item) => {
    const link =
      document.createElement(
        "a"
      );

    link.href =
      item.url;

    link.textContent =
      item.label;

    legalLinks.appendChild(
      link
    );
  });
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
  return new Promise(
    (resolve) => {
      setTimeout(
        resolve,
        milliseconds
      );
    }
  );
}