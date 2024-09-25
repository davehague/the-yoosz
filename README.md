# Yoosz

Yoosz is a web application for managing and storing memories. Built with Nuxt 3, it provides a user-friendly interface for creating, viewing, and organizing personal memories.

## Features

- Create and store memories
- View a list of all memories
- View individual memory details
- Persistent data storage using Supabase

## Technology Stack

- [Nuxt 3](https://nuxt.com/) - The Vue.js Framework
- [Pinia](https://pinia.vuejs.org/) - State management
- [Supabase](https://supabase.com/) - Backend and database

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/yoosz.git
   cd yoosz
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run generate` - Generate a static version of the application
- `npm run preview` - Preview the built application

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).