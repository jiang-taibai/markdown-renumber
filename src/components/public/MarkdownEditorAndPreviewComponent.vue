<script>
// 第三方库
import {NButton, NCode, NScrollbar, NInput, useNotification} from "naive-ui";
import {computed, defineComponent, nextTick, onMounted, ref, watchEffect} from "vue";
import {useI18n} from "vue-i18n";

export default defineComponent({
  name: "MarkdownEditorAndPreview",
  components: {NCode, NButton, NScrollbar, NInput},
  props: {
    md: {
      type: String,
      required: true,
    },
    showToolbar: {
      type: Boolean,
      required: false,
      default: true,
    },
    height: {
      type: String,
      required: false,
      default: '600px',
    }
  },
  emits: ['update:md'],
  setup(props, {emit}) {
    // 注册组件
    const notification = useNotification()
    const {t} = useI18n()

    // 定义数据
    const md = ref(props.md)
    let oldMd = props.md
    const showToolbar = props.showToolbar
    const height = props.height
    const editState = ref(false)

    // 计算属性：编辑状态下的按钮文字
    const toggleButtonText = computed(() => editState.value ? t('MarkdownEditorAndPreview.ButtonText.Save') : t('MarkdownEditorAndPreview.ButtonText.Edit'))
    const onToggle = () => {
      if (editState.value) {
        oldMd = md.value;
        emit('update:md', md.value);
      }
      editState.value = !editState.value;
    }
    const onCancelEdit = () => {
      md.value = oldMd;
      editState.value = false;
    }
    const onCopy = () => {
      navigator.clipboard.writeText(md.value).then(() => {
        notification.success({
          duration: 1000,
          title: t('MarkdownEditorAndPreview.Copy.Success.Title'),
          content: t('MarkdownEditorAndPreview.Copy.Success.Content'),
        })
      }).catch(err => {
        notification.error({
          duration: 5000,
          title: t('MarkdownEditorAndPreview.Copy.Fail.Title'),
          content: t('MarkdownEditorAndPreview.Copy.Fail.Content', err.message),
        })
      });
    }
    watchEffect(() => {
      md.value = props.md;
    });
    return {
      t,
      md, showToolbar, height,
      editState,
      toggleButtonText,
      onCopy, onToggle, onCancelEdit,
    }
  }
})
</script>

<template>
  <div>
    <div class="markdown-area" :style="{height: height}">
      <div class="toolbar">
        <div class="code-window-buttons">
          <span class="close"></span>
          <span class="minimize"></span>
          <span class="maximize"></span>
        </div>
        <div class="button-group" v-show="showToolbar">
          <n-button secondary size="small" type="primary" @click="onCancelEdit" v-if="editState">
            {{ t('MarkdownEditorAndPreview.ButtonText.Cancel') }}
          </n-button>
          <n-button secondary size="small" type="primary" @click="onToggle">{{ toggleButtonText }}</n-button>
          <n-button secondary size="small" type="primary" @click="onCopy">
            {{ t('MarkdownEditorAndPreview.ButtonText.Copy') }}
          </n-button>
        </div>
      </div>
      <n-scrollbar class="markdown-content" x-scrollable trigger="none">
        <n-code v-if="!editState" :code="md" language="markdown" show-line-numbers/>
        <textarea v-else class="markdown-editor" v-model="md"></textarea>
      </n-scrollbar>
    </div>
  </div>

</template>

<style scoped lang="less">
.markdown-area {
  border: #D7D8D9 1px solid;
  border-radius: 8px;
  padding: 20px;
  overflow: hidden;
  background-color: rgb(40, 44, 52);
  color: #F2F2F2;
  display: flex;
  flex-direction: column;

  .toolbar {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    .code-window-buttons {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      span {
        display: block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 5px;
      }

      .close {
        background-color: #ff5f56;
      }

      .minimize {
        background-color: #ffbd2e;
      }

      .maximize {
        background-color: #27c93f;
      }
    }

    .button-group {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
    }
  }

  .markdown-content {
    flex-grow: 1;

    .markdown-editor {
      position: absolute;
      top: 0;
      left: 0;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      background: transparent;
      border: none;
      outline: none;
      resize: none;
      color: inherit;
      font-family: inherit;
      font-size: inherit;
    }
  }
}
</style>
<style>
.n-code__line-numbers {
  text-align: left !important;
}

.hljs-code {
  color: #F2F2F2 !important;
}
</style>