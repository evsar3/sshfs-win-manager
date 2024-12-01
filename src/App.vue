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
  --theme-success-contrast-color: var(--theme-color);
  --theme-warning-color: #e7b416;
  --theme-warning-contrast-color: var(--theme-color);
  --theme-danger-color: #cc3232;
  --theme-danger-contrast-color: var(--theme-color);

  --theme-primary-color: #007bff;
  --theme-primary-contrast-color: var(--theme-color);
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

p:not(:last-child) {
  margin-bottom: 10px;
}

.btn {
  border-radius: 10px;
  padding: 10px 20px;
  margin-left: 10px;
  cursor: pointer;
  border: none;
  color: var(--theme-contrast-color);
  background-color: var(--theme-contrast-color-opacity-05);

  &.btn-primary {
    background-color: var(--theme-primary-color);
    color: var(--theme-primary-contrast-color);

    &:hover {
      background-color: color-mix(
        in srgb,
        var(--theme-primary-color) 80%,
        var(--theme-primary-contrast-color)
      );
    }

    &:active {
      background-color: color-mix(in srgb, var(--theme-primary-color) 60%, transparent);
    }
  }

  &.btn-success {
    background-color: var(--theme-success-color);
    color: var(--theme-success-contrast-color);

    &:hover {
      background-color: color-mix(
        in srgb,
        var(--theme-success-color) 80%,
        var(--theme-success-contrast-color)
      );
    }

    &:active {
      background-color: color-mix(in srgb, var(--theme-success-color) 60%, transparent);
    }
  }

  &.btn-warning {
    background-color: var(--theme-warning-color);
    color: var(--theme-warning-contrast-color);

    &:hover {
      background-color: color-mix(
        in srgb,
        var(--theme-warning-color) 80%,
        var(--theme-warning-contrast-color)
      );
    }

    &:active {
      background-color: color-mix(in srgb, var(--theme-warning-color) 60%, transparent);
    }
  }

  &.btn-danger {
    background-color: var(--theme-danger-color);
    color: var(--theme-danger-contrast-color);

    &:hover {
      background-color: color-mix(
        in srgb,
        var(--theme-danger-color) 80%,
        var(--theme-danger-contrast-color)
      );
    }

    &:active {
      background-color: color-mix(in srgb, var(--theme-danger-color) 60%, transparent);
    }
  }

  &:hover {
    background-color: var(--theme-contrast-color-opacity-1);
  }

  &:active {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &.active {
    background-color: var(--theme-contrast-color-opacity-2);
  }

  &.btn-icon {
    border-radius: 32px;
    width: 32px;
    height: 32px;
    padding: 0;
  }
}
</style>
