const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin (check if already initialized to avoid errors)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const posts = [
    {
        slug: 'the-art-of-subtraction',
        title: 'The Art of Subtraction in UI Design',
        subtitle: 'Why less is almost always more.',
        date: '2024-01-15',
        excerpt: 'In a world of noise, clarity is the ultimate luxury. How removing elements can actually increase user engagement and trust.',
        content: `
# The Art of Subtraction

**"Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away."** — Antoine de Saint-Exupéry

Modern interfaces are often cluttered with "features" that distract rather than empower. In my work with React and Design Systems, I've found that the most robust components are those with the fewest props.

## The Cognitive Load

Every pixel requires processing. When we reduce visual noise, we allow the user's brain to focus on the primary task. This isn't just aesthetic minimalism; it's functional essentialism.

### Practical Steps

1. **Audit your UI**: Look at every element and ask, "Does the user need this *right now*?"
2. **Hide advanced features**: Use progressive disclosure.
3. **WhiteSpace is active**: It groups content and guides the eye.

## Conclusion

Strip it back. Then strip it back again.
    `,
        coverImage: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=2000'
    },
    {
        slug: 'building-for-resilience',
        title: 'Building for Resilience',
        subtitle: 'Error boundaries are not enough.',
        date: '2024-02-10',
        excerpt: 'True resilience in distributed systems implies graceful degradation, optimistic UI updates, and a "fail-loud" approach during development.',
        content: `
# Building for Resilience

We often think of "resilience" as just handling exceptions. But in frontend engineering, resilience is about the *user's perception* of stability.

## Optimistic UI

When a user clicks "Like", don't wait for the server. Toggle the heart immediately. If the request fails, revert it with a toast notification. This makes the app feel instant and confident.

## Types of Failure

- **Network**: The internet is flaky. Retries and Offline support (PWA) are key.
- **Logic**: Bugs happen. Error Boundaries should catch distinct sections (like a widget), not crash the whole page.
- **Data**: Zod validation at the boundary (API response) ensures your components don't explode with undefined data.

    `,
        coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000'
    }
];

async function seedWriting() {
    console.log('Seeding writing posts...');
    const collectionRef = db.collection('posts');

    for (const post of posts) {
        await collectionRef.doc(post.slug).set(post);
        console.log(`Seeded post: ${post.title}`);
    }

    console.log('Done!');
    process.exit(0);
}

seedWriting().catch(console.error);
