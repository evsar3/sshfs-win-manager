<script setup lang="ts"></script>

<template>
  <router-view />
</template>

<style lang="less">
:root {
  --theme-color: #f5f5f5;
  --theme-contrast-color: #444;
  --theme-no-focus-window-border-color: rgba(0, 0, 0, 0.4);
  --theme-contrast-color-opacity-05: rgba(0, 0, 0, 0.05);
  --theme-contrast-color-opacity-1: rgba(0, 0, 0, 0.1);
  --theme-contrast-color-opacity-2: rgba(0, 0, 0, 0.2);
  --theme-contrast-color-opacity-3: rgba(0, 0, 0, 0.3);
  --theme-contrast-color-opacity-4: rgba(0, 0, 0, 0.4);
  --theme-contrast-color-opacity-5: rgba(0, 0, 0, 0.5);

  --theme-success-color: #2dc937;
  --theme-warning-color: #e7b416;
  --theme-danger-color: #cc3232;
}

@media (prefers-color-scheme: dark) {
  :root {
    --theme-color: #1f1f1f;
    --theme-contrast-color: #eee;
    --theme-no-focus-window-border-color: rgba(255, 255, 255, 0.1);
    --theme-contrast-color-opacity-05: rgba(255, 255, 255, 0.05);
    --theme-contrast-color-opacity-1: rgba(255, 255, 255, 0.1);
    --theme-contrast-color-opacity-2: rgba(255, 255, 255, 0.2);
    --theme-contrast-color-opacity-3: rgba(255, 255, 255, 0.3);
    --theme-contrast-color-opacity-4: rgba(255, 255, 255, 0.4);
    --theme-contrast-color-opacity-5: rgba(255, 255, 255, 0.5);
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body,
html,
#app {
  width: 100%;
  height: 100%;
}

body {
  font-family: 'Segoe UI', sans-serif;
  user-select: none;
  color: var(--theme-contrast-color);
  background-color: var(--theme-color);
}
</style>
