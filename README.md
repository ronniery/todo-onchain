# To-Do Onchain Application

A simple and To-Do application built with Next.js, React, Tailwind CSS, TypeScript, and powered by the **Solana blockchain** for decentralized task management. The app leverages the power of the Solana blockchain for transparent and immutable to-do list storage.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [File Structure](#file-structure)
4. [Installation](#installation)
5. [Running Locally](#running-locally)
6. [Running Tests](#running-tests)
7. [Solana Integration](#solana-integration)
8. [Contributing](#contributing)
9. [License](#license)

---

## Features

- Decentralized task management using Solana blockchain.
- Simple UI built with React and styled using Tailwind CSS.
- Fully responsive and mobile-friendly design.
- Supports creating, updating, and deleting to-do items.
- Optimized for performance with Next.js.
- Written in TypeScript for better type safety.
- Reusable components and hooks for maintainability.

---

## Technologies Used

- **Solana Blockchain:** Backend for storing tasks in a decentralized manner.
- **Next.js:** Framework for server-side rendering and optimized performance.
- **React.js:** Frontend library for building interactive user interfaces.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **TypeScript:** Statically typed JavaScript for better developer experience.
- **Node.js:** Backend runtime for API integrations and Solana interactions.

---

## File Structure

```bash
├── app
│   ├── components               # Reusable React components
│   │   ├── Loading.js           # Loading spinner component
│   │   └── todo                 # Todo components folder
│   │       ├── TodoItem.js      # Individual todo item component
│   │       ├── TodoList.js      # List of todos component
│   │       └── TodoSection.js   # Todo section layout
│   ├── constants                # Application-wide constants
│   │   ├── index.js             # Index of constants
│   │   └── todo.json            # Sample todos data
│   ├── hooks                    # Custom React hooks
│   │   └── todo.js              # Hook for managing todo state
│   ├── index.ts                 # Main entry point
│   ├── next.config.js           # Next.js configuration
│   ├── package.json             # Project dependencies
│   ├── package-lock.json        # Package lock file
│   ├── pages                    # Next.js pages folder
│   │   ├── _app.js              # App component, global settings
│   │   └── index.js             # Home page displaying todos
│   ├── public                   # Public static files
│   │   └── favicon.ico          # Favicon for the app
│   ├── README.md                # Documentation (this file)
│   ├── styles                   # Global and component-level styles
│   │   ├── global.css           # Global styles
│   │   ├── Home.module.css      # Styles for the Home page
│   │   └── Todo.module.css      # Styles for Todo components
│   ├── utils                    # Utility functions
│   │   └── index.js             # Helper methods for the app
│   └── yarn.lock                # Yarn lock file
├── package.json                 # Root package file
├── tsconfig.json                # TypeScript configuration
└── yarn.lock                    # Lock file for consistent package installations
```

## Installation

To get started, clone this repository and install the dependencies:

```bash
git clone https://github.com/yourusername/solana-todo-app.git
cd solana-todo-app
yarn install
```

Make sure you have Node.js and Yarn installed globally on your system.

---

## Running Locally

After the installation is complete, you can run the application locally with:

```bash
yarn dev
```

This will start a development server at `http://localhost:3000`. Open your browser and navigate to this address to view the app.

---

## Running Tests

To run tests for your application:

```bash
yarn test
```

Make sure your test cases cover essential components like:
- `TodoItem.js`: Ensure tasks are displayed correctly.
- `TodoList.js`: Verify the list renders all items and handles empty states.
- `todo.js`: Check that hooks behave as expected when adding or deleting tasks.

---

## Solana Integration

This app interacts with the Solana blockchain to store and retrieve to-do tasks. You'll need to configure the Solana network by providing your own RPC endpoint in your environment variables.

### Solana Setup

1. Install the Solana CLI on your machine.
2. Set up a Solana wallet.
3. Update the `.env.local` file with your Solana RPC URL.

Example `.env.local`:

```
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

### Steps to Contribute

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
