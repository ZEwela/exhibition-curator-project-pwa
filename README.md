# Exhibition Curator

## Overview

**Exhibition Curator** is a Next.js application designed to help users curate their own exhibitions by browsing and managing a collection of artworks. The app allows users to search for artworks, add them to their exhibitions, and view detailed information about each piece. This project was bootstrapped with `create-next-app` and utilizes modern React and Next.js features.

## Live Demo

You can view the live version of the Exhibition Curator app here: [Exhibition Curator Live](https://exhibition-curator-project-pwa.vercel.app/)

## PWA Installation Instructions

This app is a Progressive Web App (PWA), which means you can install it directly on your device for an enhanced experience, similar to a native application.

You can install this app on your device by following these steps:

1. Open the app in your browser.
2. Look for the install prompt or the option in your browser's menu.
3. Follow the instructions to add the app to your device.

For detailed instructions on how to install PWAs on different devices, please refer to the following link:

[How to Install a PWA to Your Device](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing)

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Setup Environment Variables](#setup-environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)

## Features

- **Search Functionality**: Search for artworks by keyword.
- **Artwork Details**: View detailed information about each artwork, including title, artist, medium, and description.
- **Curate Exhibitions**: Add or remove artworks to/from your exhibition collection.
- **Responsive Design**: Optimized for both mobile and desktop devices.
- **Pagination**: Navigate through artworks using pagination controls.

## Getting Started

To get a local copy of this project up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed:

- **Node.js** (version 14.x or higher)
- **npm** (comes with Node.js)
- Alternatively, you can use **Yarn**, **pnpm**, or **bun** as your package manager.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/exhibition-curator.git

   ```

2. Navigate to the project directory:

   ```bash
   cd exhibition-curator

   ```

3. Navigate to the project directory:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

   or

   ```bash
   pnpm install
   ```

   or

   ```bash
   bun install
   ```

## Setup Environment Variables

To access the Harvard Art Museums API, you need to create a `.env.local` file in the root directory of your project and add your API key.

#### Steps to Get the API Key:

1. Visit the [Harvard Art Museums API page](https://harvardartmuseums.org/collections/api) to sign up and get an API key.
2. Once you have your API key, create a file named `.env.local` in the root directory of your project.

#### Add the API Key to `.env.local`

In the `.env.local` file, add the following line:

```env
HARVARD_ART_MUSEUMS_API=your_api_key_here
```

## Usage

1. Run the development server:

   ```bash
    npm run dev
   ```

   or

   ```bash
   yarn dev
   ```

   or

   ```bash
    pnpm dev
   ```

   or

   ```bash
    bun dev
   ```

2. Open your browser and navigate to http://localhost:3000 to see the application in action.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.
