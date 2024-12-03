<script lang="ts" setup>
import { watch } from 'vue'
import { useSettingsStore } from './store/settings'

const settingsStore = useSettingsStore()

watch(
  () => settingsStore.settings.theme,
  (theme) => {
    document.documentElement.classList.remove('app-theme-light', 'app-theme-dark', 'app-theme-auto')
    document.documentElement.classList.add(`app-theme-${theme}`)
  },
  { immediate: true }
)
</script>

<template>
  <router-view />
</template>

<style lang="less">
.theme-light {
  --theme-color: hsl(0, 0%, 96%);
  --theme-contrast-color: #444;
}

.theme-dark {
  --theme-color: hsl(0, 0%, 12%);
  --theme-contrast-color: #eee;
}

:root {
  .theme-light();

  --theme-contrast-color-opacity-05: color-mix(
    in srgb,
    var(--theme-contrast-color) 5%,
    transparent
  );

  --theme-contrast-color-opacity-1: color-mix(
    in srgb,
    var(--theme-contrast-color) 10%,
    transparent
  );

  --theme-contrast-color-opacity-2: color-mix(
    in srgb,
    var(--theme-contrast-color) 20%,
    transparent
  );

  --theme-contrast-color-opacity-3: color-mix(
    in srgb,
    var(--theme-contrast-color) 30%,
    transparent
  );

  --theme-contrast-color-opacity-4: color-mix(
    in srgb,
    var(--theme-contrast-color) 40%,
    transparent
  );

  --theme-contrast-color-opacity-5: color-mix(
    in srgb,
    var(--theme-contrast-color) 50%,
    transparent
  );

  --theme-primary-color: #007bff;
  --theme-primary-contrast-color: var(--theme-color);
  --theme-success-color: #2dc937;
  --theme-success-contrast-color: var(--theme-color);
  --theme-warning-color: #e7b416;
  --theme-warning-contrast-color: var(--theme-color);
  --theme-danger-color: #cc3232;
  --theme-danger-contrast-color: var(--theme-color);
}

@media (prefers-color-scheme: dark) {
  :root {
    .theme-dark();
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
}

html {
  &.app-theme-light {
    .theme-light() !important;
  }

  &.app-theme-dark {
    .theme-dark() !important;
  }
}

body {
  font-family: 'Segoe UI', sans-serif;
  color: var(--theme-contrast-color);
  background-color: var(--theme-color);
  user-select: none;
  overflow: hidden;

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: var(--theme-contrast-color-opacity-3);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: var(--theme-contrast-color-opacity-4);
  }

  ::-webkit-scrollbar-thumb:active {
    background-color: var(--theme-contrast-color-opacity-5);
  }
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
