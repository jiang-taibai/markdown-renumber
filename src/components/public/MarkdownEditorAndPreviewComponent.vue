<script>
import {NButton, NCode, NScrollbar, useNotification} from "naive-ui";
import {computed, defineComponent, ref, watchEffect} from "vue";

export default defineComponent({
  name: "MarkdownEditorAndPreview",
  components: {NCode, NButton, NScrollbar},
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
    const notification = useNotification()
    const md = ref(props.md)
    const showToolbar = props.showToolbar
    const height = props.height

    const editor = ref(null)
    const editState = ref(false)
    const toggleButtonText = computed(() => editState.value ? '保存' : '编辑')
    const onToggle = () => {
      if (editState.value) {
        md.value = editor.value.innerText;
        emit('update:md', md.value);
      }
      editState.value = !editState.value;
    }
    const onCopy = () => {
      navigator.clipboard.writeText(md.value).then(() => {
        notification.success({
          duration: 1000,
          title: '复制成功',
          content: '已复制到剪贴板',
        })
      }).catch(err => {
        notification.error({
          duration: 5000,
          title: '复制失败',
          content: '复制失败，错误原因：' + err,
        })
      });
    }
    watchEffect(() => {
      md.value = props.md;
    });
    return {
      md, showToolbar, height,
      editor,
      editState,
      toggleButtonText,
      onCopy, onToggle
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
          <n-button secondary size="small" type="primary" @click="onToggle">{{ toggleButtonText }}</n-button>
          <n-button secondary size="small" type="primary" @click="onCopy">复制</n-button>
        </div>
      </div>
      <n-scrollbar class="markdown-content" x-scrollable trigger="none">
        <n-code v-if="!editState" :code="md" language="markdown" show-line-numbers/>
        <div v-else ref="editor" contenteditable="true" :innerText="md"/>
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