This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

You can run this site locally or through a docker container.
For deployment the only intended way to run the server is through a docker container.
A local deployment may be useful for development purposes.

You may choose to connect the frontend to [local services](https://github.com/openml/services) (elasticsearch, database, ...).
It's the only way to have a fully functional local experience in which you browse assets.
Instructions can be found in the ["Local Services"](#local-services) section.

# Local Installation

Alternative installation paths with other runtimes or package managers are also possible.

## Installing Node and dependencies
This project needs Node 22 currently, because not all dependencies are available on newer versions.
You might want to consider [using a virtual environment](https://github.com/nvm-sh/nvm#installing-and-updating) for this project to avoid affecting other tools that use Node.
Using nvm, it will always use the Node version we specified in `.nvmrc`:

```bash
nvm install
nvm use # sets it for the shell only
```
You also need to install `npm` (e.g., `brew install npm` on MacOS).
You can then install the dependencies with `npm ci`.

## Configuration
The `npm run dev` command automatically picks up environment variables from `.env.local`.
Copy `.env.local.example` as `.env.local`, the example configuration will connect to [local services](#local-services).

## Starting the Server

First, run the development server: `npm run dev`.
Open [http://localhost:3050](http://localhost:3050) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Remote ES Server
You used to be able to connect to the ES server hosted remotely.
Since increased security measures around interacting with the ES API this seems to have broken.
Likely the ES client makes some request outside of the whitelisted URLs.

# Docker
The full documentation for the docker image can be found in [docker/README.md](docker/README.md).

## Configuration
The NextJS app in the container is configured by `.env.services`.
Copy `.env.services.example` as `.env.services` for an example configuration that connects to [local services](#local-services).

## Starting the Server
First make sure the [local services](#local-services) are up and running and the `openml-services` docker network is created.
Then simply run `docker compose -f compose.services.yaml up openml-next`. 

# Local Services
If you plan to connect the development site to local instances of the REST API and Elasticsearch,
you first need to set up your [local services](https://github.com/openml/services).

Clone the services repository somewhere (`git clone https://github.com/openml/services`) and from its root directory run `docker compose --profile frontend up -d`. 
This will make the old frontend available at http://localhost:8000/ but also bring up all the services a frontend needs to connect to.
Follow the 'configuration' section in 'Local Installation' or 'Docker Installation' to connect your setup to these services.

# Notes

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
