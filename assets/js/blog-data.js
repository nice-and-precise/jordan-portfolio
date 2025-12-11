export const blogPosts = [
    {
        id: "zero-latency",
        title: "Why I Chose Vanilla JS in 2025",
        date: "Dec 10, 2025",
        readTime: "4 min read",
        content: `
            <h3>The Framework Fatigue</h3>
            <p>Modern frontend development has become an exercise in configuration management. We spend more time fighting Webpack, Babel, and hydration errors than we do shipping value.</p>
            <p>For this portfolio, I returned to first principles. No build step. No hydration. Just the DOM API and ES Modules.</p>
            <h3>The Results</h3>
            <p>Lighthouse scores are consistently 100. Interaction to Next Paint (INP) is effectively zero. The browser is designed to render HTML. Let it.</p>
        `
    },
    {
        id: "industrial-iot",
        title: "Scaling IoT Data for Manufacturing",
        date: "Nov 28, 2025",
        readTime: "6 min read",
        content: `
            <h3>The 5TB Problem</h3>
            <p>When you have 50 CNC machines reporting telemetry every 100ms, standard SQL databases choke. You need a Time Series database approach.</p>
            <p>We implemented a hybrid architecture: Hot storage in Redis for real-time dashboards, warm storage in TimescaleDB for analytics, and cold storage in S3 parquet files.</p>
        `
    },
    {
        id: "ops-efficiency",
        title: "Operational Efficiency is a Code Problem",
        date: "Nov 15, 2025",
        readTime: "5 min read",
        content: `
            <h3>Systems Thinking</h3>
            <p>Most "operations" problems are actually data visibility problems. If a site manager has to call the office to find out where a skid steer is, that's a latency issue.</p>
            <p>By treating physical assets as API endpoints, we can apply software engineering principles to the physical world.</p>
        `
    }
];
