"use strict";

const metaDescription = document.querySelector("#metaDescription");
const favicon = document.querySelector("#favicon");

const siteLogoLink = document.querySelector("#siteLogoLink");
const siteLogo = document.querySelector("#siteLogo");

const signupLink = document.querySelector("#signupLink");
const loginLink = document.querySelector("#loginLink");

const pageLabel = document.querySelector("#pageLabel");
const experienceTitle = document.querySelector("#experienceTitle");
const pageAuthor = document.querySelector("#pageAuthor");

const experienceGrid = document.querySelector("#experienceGrid");

const legalText = document.querySelector("#legalText");
const legalLinks = document.querySelector("#legalLinks");

let config = null;

initializePage();

async function initializePage() {
    try {
        const response = await fetch("config.json", {
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Could not load config.json. Status: ${response.status}`);
        }

        config = await response.json();

        validateConfig();
        applySeo();
        applyBrand();
        applyHeader();
        applyHero();
        renderExperiences();
        renderLegal();
    } catch (error) {
        console.error("Index page initialization failed:", error);
    }
}

function validateConfig() {
    if (!config || typeof config !== "object") {
        throw new Error("Configuration missing");
    }

    if (!Array.isArray(config.experiences)) {
        throw new Error("Experiences configuration missing");
    }
}

function applySeo() {
    if (config.seo?.title) {
        document.title = config.seo.title;
    }

    if (metaDescription && config.seo?.description) {
        metaDescription.setAttribute("content", config.seo.description);
    }

    if (favicon && config.seo?.favicon) {
        favicon.href = config.seo.favicon;
    }
}

function applyBrand() {
    if (siteLogo && config.brand?.logo) {
        siteLogo.src = config.brand.logo;
    }

    if (siteLogo) {
        siteLogo.alt = config.brand?.logoAlt || config.brand?.name || "";
    }

    if (siteLogoLink) {
        siteLogoLink.href = config.brand?.homeUrl || "index.html";

        siteLogoLink.setAttribute(
            "aria-label",
            `${config.brand?.name || "NexPlay"} home`,
        );
    }
}

function applyHeader() {
    if (signupLink) {
        signupLink.textContent = config.header?.signup?.label || "";

        signupLink.href = config.header?.signup?.url || "#";
    }

    if (loginLink) {
        loginLink.textContent = config.header?.login?.label || "";

        loginLink.href = config.header?.login?.url || "#";
    }
}

function applyHero() {
    if (pageLabel) {
        pageLabel.textContent = config.hero?.label || "";
    }

    if (experienceTitle) {
        experienceTitle.textContent = config.hero?.title || "";
    }

    if (pageAuthor) {
        pageAuthor.textContent = config.hero?.author || "";
    }
}

function renderExperiences() {
    if (!experienceGrid) {
        return;
    }

    experienceGrid.replaceChildren();

    config.experiences.forEach((experience) => {
        const article = document.createElement("article");
        article.className = "experience-card";

        const imageLink = document.createElement("a");
        imageLink.className = "experience-image-link";
        imageLink.href = experience.url;

        imageLink.setAttribute(
            "aria-label",
            experience.ariaLabel || `Open the ${experience.label} experience`,
        );

        const image = document.createElement("img");
        image.className = "experience-image";
        image.src = experience.image;
        image.alt = experience.imageAlt || "";
        image.width = 1200;
        image.height = 650;

        imageLink.appendChild(image);

        const content = document.createElement("div");
        content.className = "experience-card-content";

        const label = document.createElement("p");
        label.className = "experience-label";
        label.textContent = experience.label;

        const title = document.createElement("h2");
        title.textContent = experience.title;

        const description = document.createElement("p");
        description.className = "experience-description";
        description.textContent = experience.description;

        const button = document.createElement("a");
        button.className = "experience-button";
        button.href = experience.url;
        button.textContent = experience.buttonLabel;

        content.append(label, title, description, button);

        article.append(imageLink, content);

        experienceGrid.appendChild(article);
    });
}

function renderLegal() {
    if (legalText) {
        legalText.textContent = config.legal?.text || "";
    }

    if (!legalLinks) {
        return;
    }

    legalLinks.replaceChildren();

    const links = Array.isArray(config.legal?.links) ? config.legal.links : [];

    links.forEach((item) => {
        const link = document.createElement("a");

        link.href = item.url;
        link.textContent = item.label;

        legalLinks.appendChild(link);
    });
}
