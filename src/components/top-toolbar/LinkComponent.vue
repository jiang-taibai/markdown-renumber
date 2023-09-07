<script setup>
import {NButtonGroup, NButton, NIcon} from "naive-ui";
import iconGithub from "@/assets/img/icon/github.png";
import iconGitee from "@/assets/img/icon/gitee.png";

const links = [
  {
    name: 'Github',
    icon: iconGithub,
    url: '#',
  },
  {
    name: 'Gitee',
    icon: iconGitee,
    url: '#',
  }
]
</script>

<template>
  <n-button-group>
    <n-button tag="a" target="_blank"
              v-for="link in links" :key="`link-${link.name}`" :href="link.url">
      <template #icon>
        <n-icon>
          <img class="button-icon" :src="link.icon" alt="logo"/>
        </n-icon>
      </template>
      <span>{{ link.name }}</span>
    </n-button>
  </n-button-group>
</template>

<style scoped lang="less">
.button-icon {
  width: 1em;
  height: 1em;
}
</style>