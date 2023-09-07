<script setup>
// 第三方库
import {ref, computed} from 'vue';
import {NScrollbar} from 'naive-ui';
import {MdPreview, MdCatalog} from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import '@vavt/markdown-theme/css/all.css';

// 自定义脚本
import {getLocalHelpDocument} from '@/assets/js/data/help-document.js';

// 关联 DOM 节点
const scrollbarForPreview = ref(null)
const markdownPreview = ref(null)

// 定义计算属性
const helpDocument = computed(() => {
  return getLocalHelpDocument()
})

/**
 * 得到目标标题的相对位置
 *
 * @param target 点击的目标标题，样例：{active: false, children: [], index: 5, level: 1, text: "3. 生成序号"}
 * @returns {{top: number, left: number}}
 */
function getTitleOfRelativePosition(target) {
  const article = markdownPreview.value.querySelector('article')
  const headers = article.querySelectorAll('h' + target.level);
  let targetHeader = null;
  for (const header of headers) {
    if (header.innerText === target.text) {
      targetHeader = header;
      break
    }
  }

  let top = 0;
  let left = 0;

  if (targetHeader) {
    top += targetHeader.offsetTop;
    left += targetHeader.offsetLeft;
  }

  return {
    top: top,
    left: left
  };
}

/**
 * 点击目录项时，滚动到对应的标题
 *
 * @param e
 * @param target
 */
const onScrollTo = (e, target) => {
  const {top, left} = getTitleOfRelativePosition(target)
  scrollbarForPreview.value.scrollTo({
    left: left,
    top: top,
    behavior: 'smooth'
  })
}
</script>

<template>
  <div class="main">
    <div class="markdown-preview">
      <n-scrollbar ref="scrollbarForPreview" style="max-height: 700px" trigger="none">
        <div ref="markdownPreview">
          <MdPreview previewTheme="vuepress" editorId="markdown-preview-only" :modelValue="helpDocument"/>
        </div>
      </n-scrollbar>
    </div>
    <div class="markdown-catalog">
      <n-scrollbar ref="scrollbarForCatalog" style="max-height: 700px; max-width: 300px" x-scrollable trigger="none">
        <div class="title">{{ $t('Help.CatalogTitle') }}</div>
        <MdCatalog editorId="markdown-preview-only" @on-click="onScrollTo"/>
      </n-scrollbar>
    </div>
  </div>
</template>

<style scoped lang="less">
.main {
  display: flex;
  flex-direction: row;
  gap: 8px;

  .markdown-preview {
    background-color: #FFFFFF;
    border-radius: 8px;
    padding: 20px;
  }

  .markdown-catalog {
    background-color: #FFFFFF;
    border-radius: 8px;
    padding: 20px;

    .title {
      font-weight: bold;
      font-size: 20px;
      margin-bottom: 8px;
    }
  }
}

</style>

<style>
.md-editor-catalog-active > span {
  color: var(--md-color) !important;
}

.md-editor-catalog-active > span:hover {
  color: #73d13d !important;
}
</style>