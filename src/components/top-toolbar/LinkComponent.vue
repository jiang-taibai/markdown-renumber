<script setup>
import {NButtonGroup, NButton, NIcon, NPopover} from "naive-ui";
import {reactive, computed} from "vue";
import {useI18n} from "vue-i18n";

import iconGithub from "@/assets/img/icon/github.png";
import iconGitee from "@/assets/img/icon/gitee.png";
import iconUpgrade from "@/assets/img/icon/upgrade.png";
import iconRight from "@/assets/img/icon/right.png";
import {getLatestVersion, getLocalVersion} from "@/assets/js/utils/check-for-updates";

const {t} = useI18n()

const localVersion = getLocalVersion()
const state = reactive({
  latestVersion: localVersion,
})
const hasNewVersion = computed(() => {
  return localVersion < state.latestVersion
})

getLatestVersion()
    .then(version => {
      state.latestVersion = version;
    })
    .catch(err => {
      // 静默处理，允许在无法获取最新版本时继续使用
    });

const links = [
  {
    name: 'Github',
    icon: iconGithub,
    url: 'https://github.com/jiang-taibai/markdown-renumber',
  },
  {
    name: 'Gitee',
    icon: iconGitee,
    url: 'https://gitee.com/jiang-taibai/markdown-renumber',
  }
]
</script>

<template>
  <n-button-group>
    <n-popover trigger="hover" :disabled="!hasNewVersion">
      <template #trigger>
        <n-button v-if="hasNewVersion" tag="a" target="_blank" :href="links[0].url">
          <template v-show="hasNewVersion" #icon>
            <n-icon>
              <img class="button-icon" :src="iconUpgrade" alt="logo"/>
            </n-icon>
          </template>
          <span>{{ localVersion }}</span>
        </n-button>
        <n-button v-else tag="a" target="_blank" :href="links[0].url">
          <template v-show="hasNewVersion" #icon>
            <n-icon>
              <img class="button-icon" :src="iconRight" alt="logo"/>
            </n-icon>
          </template>
          <span>{{ localVersion }}</span>
        </n-button>
      </template>
      <span>{{ $t('TopToolbar.Upgraded', {version: state.latestVersion}) }}</span>
    </n-popover>
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