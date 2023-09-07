<script>
import {defineComponent, onMounted, watch} from 'vue'
import {useI18n} from "vue-i18n";
import {NRadioGroup, NRadioButton} from "naive-ui";

export default defineComponent({
  emits: ['onLocaleChange'],
  components: {
    NRadioGroup,
    NRadioButton,
  },
  setup(props, {emit}) {
    const i18n = useI18n()
    const availableLocaleOptions = [
      {label: '简体中文', value: 'zh-CN'},
      {label: '繁體中文', value: 'zh-TW'},
      {label: 'English', value: 'en-US'},
    ]

    const onLocaleChange = (e) => {
      localStorage.setItem('locale', i18n.locale.value)
      emit('onLocaleChange')
    }

    onMounted(() => {
      const locale = localStorage.getItem('locale')
      if (locale) {
        i18n.locale.value = locale
      }
    })

    return {
      availableLocaleOptions, onLocaleChange,
    }
  },
})
</script>

<template>
  <div class="locale-changer">
    <n-radio-group v-model:value="$i18n.locale" name="i18nLocaleRadioGroup" @change="onLocaleChange">
      <n-radio-button v-for="locale in availableLocaleOptions" :key="`locale-${locale.value}`" :value="locale.value"
                      :label="locale.label"/>
    </n-radio-group>
  </div>
</template>

<style scoped lang="less">

</style>