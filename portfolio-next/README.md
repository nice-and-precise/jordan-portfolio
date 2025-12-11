# Antigravity Portfolio

A high-performance, interactive portfolio designed to showcase complex ERP engineering work. Built with Next.js, Tailwind CSS, and Framer Motion.

> **For Developers & AI Agents:** Please refer to [`../docs/AI_INSTRUCTIONS.md`](../docs/AI_INSTRUCTIONS.md) for contribution guidelines.

## 🚀 Key Features

*   **Antigravity Hero:** Physics-based floating elements that react to mouse gravity (`src/components/AntigravityHero.tsx`).
*   **Parallax Showcase:** Scroll-triggered "exploded view" of dashboard layers (`src/components/ParallaxShowcase.tsx`).
*   **Gravity Dock:** MacOS-style floating navigation with magnetic magnification (`src/components/GravityDock.tsx`).
*   **Project Modals:** Seamless shared-layout transitions for case study details (`src/components/ProjectModal.tsx`).

## 🛠 Tech Stack

*   **Framework:** Next.js 14+ (App Router)
*   **Styling:** Tailwind CSS + Custom Noise Textures
*   **Animation:** Framer Motion (Spring Physics & Layout Animations)
*   **Icons:** Lucide React

## 🏃‍♂️ Getting Started

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Run the development server:
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:3000](http://localhost:3000)

## 🏗 Architecture

*   **SSG (Static Site Generation):** Optimized for Vercel deployment.
*   **Dynamic Imports:** Modals are loaded lazily to reduce initial bundle size.
*   **Image Optimization:** Heavy assets use `priority` loading and Next.js image optimization.
