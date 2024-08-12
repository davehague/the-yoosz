<!-- layouts/default.vue -->
<template>
  <div class="app-container">
    <header>
      <h1>The Yoosz</h1>
      <nav>
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/memories">Browse Memories</NuxtLink>
      </nav>
    </header>

    <main>
      <slot />
    </main>

    <footer>
      <p>&copy; 2024 The Yoosz App. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// No setup logic needed for this component
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: #4CAF50;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header h1 {
  margin: 0;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  color: white;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}

main {
  flex-grow: 1;
  padding: 2rem;
}

footer {
  background-color: #f1f1f1;
  padding: 1rem;
  text-align: center;
}
</style>