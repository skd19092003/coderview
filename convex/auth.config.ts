export default {
    providers: [
      {
        domain: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API_URL!,
        applicationID: "convex",
      },
    ]
  };

  // This tells Convex which authentication provider to use (Clerk).