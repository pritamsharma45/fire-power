# Docs

This is a starter template to get started with Next JS and GraphQL.
We will be using Apollo Server and Apollo client libraries to handle data fetching
We will try to dockerize it

# Library Used

1. Next.js
2. React
3. ApolloGraphQL
4. TailwindCSS
5. Casual ( for fake data)
6. Docker
7. Heroku (for deployment)
8. Jest for unit testing
9. Cypress (e2e)
10. Supabase (Postgres Database service)
11. Nexus ( Adding typedefs to Graph QL)
12. Prisma ( ORM to work with Postgres Database like - modelling, migration,generate SQL query)
13. Stripe ( payment integration)
14. Apache KAFKA

# Run commands to get started

- npm install (install all the dependencies)
- npm run dev (for fast refresh)
- npm run build (production build)
- npm run start ( after production build)
- npm run test ( unit testing)

# Build Docker Container

- docker build -t nextjs-docker .

# Run Docker

- docker run -p 3000:3000 nextjs-docker

# Pushing Docker Image to Docker Hub

- Docker Login
- docker tag nextjs-docker alexmorgan/nextjs-docker:version1.0
- docker push alexmorgan/nextjs-docker
- Go to Docker hub and then refresh
- Pull the uploaded image by using command: docker pull username/imageName:versionName
- Run it in your internal system command line.
- Then finally there should be no change with your internal image.

# Push Docker Link Image

- docker push techlever45/awesome-links-web:version1

# Docker Image link

- https://hub.docker.com/repository/docker/techlever45/awesome-links-web
- command: docker pull techlever45/awesome-links-web:version1

# e2e testing using Cypress

- npm run e2e [ this will run the test in headless mode]
- npm run cypress [ this will run the test after opening Browser]

# Deploy to Heroku

- heroku login
- heroku create
- heroku stack:set container
- git push heroku master

# Spin up your Database

- [Supabase DB setup](docs/databaseSetup.md)

# Configuration Requirements

- next.config.js
  - ensure you have listed all the domains you will be using for images in next.config.js. Like drive.google.com or cloudinary.com etc.
- .env
  - Replace DATABASE_URL with actual database url from Supabase dashboard. [DB setup](docs/databaseSetup.md) | [Prisma ORM](docs/workingWithPrisma.md)
  - NEXTAUTH_URL has to be replaced with your domain.
  - SECRET can be generate using secret generator site like -
  - Ensure you have duly populated all the id and secret field for different auth provider like Google, Facebook, Twitter etc.
  - [ Auth Setup](docs/authProviders.md)
- .env.local
  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY has to be obtained from Stripe dashboard.
  - STRIPE_SECRET_KEY has to be obtained from stripe dashboard.
  - STRIPE_WEBHOOK_SECRET has to be generated using CLI or using Stripe dashboard.
  - [Stripe Setup](docs/stripeSetup.md)

# [References/docs](docs/allReferences.md)
