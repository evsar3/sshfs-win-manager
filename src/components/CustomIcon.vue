<script lang="ts" setup>
defineProps<{
  icon: 'plus'
}>()
</script>

<template>
  <svg
    v-if="icon === 'plus'"
    viewBox="0 -0.5 21 21"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <title>plus [#1512]</title>
      <desc>Created with Sketch.</desc>
      <defs></defs>
      <g id="Page-1" stroke="none" stroke-width="1">
        <g id="Dribbble-Light-Preview" transform="translate(-379.000000, -240.000000)">
          <g id="icons" transform="translate(56.000000, 160.000000)">
            <polygon
              id="plus-[#1512]"
              fill="var(--theme-contrast-color)"
              points="344 89 344 91 334.55 91 334.55 100 332.45 100 332.45 91 323 91 323 89 332.45 89 332.45 80 334.55 80 334.55 89"
            ></polygon>
          </g>
        </g>
      </g>
    </g>
  </svg>
</template>
