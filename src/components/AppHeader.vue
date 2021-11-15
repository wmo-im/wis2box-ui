<template>
  <header :style="{ width: '100%' }">
    <div
      id="banner"
      :style="{
        'background-image': `url(${require('@/assets/img/wmo-banner.png')})`,
      }"
    >
      <a
        href="https://community.wmo.int/activity-areas/wis/wis2-implementation"
        title="wis2node"
      >
        <img
          alt="wis2node"
          width="68"
          height="77"
          src="@/assets/img/logo.png"
        />
      </a>
      <br />
      <h1>Welcome to WIS 2.0 node in box!</h1>
    </div>
  </header>
</template>
