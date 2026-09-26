<!--
 * 尺寸设置
-->

<template>
  <div v-if="!mixinState.mSelectMode">
    <el-divider plain content-position="left">{{ $t('editor.size') }}</el-divider>
    <el-form :label-width="40" class="flex gap-1">
      <el-form-item :label="$t('editor.width')" prop="name">
        <el-input
          type="number"
          style="--el-input-width: 80px"
          disabled
          v-model="width"
          @change="setSize"
        />
      </el-form-item>
      <el-form-item :label="$t('editor.height')" prop="name">
        <el-input
          type="number"
          style="--el-input-width: 80px"
          disabled
          v-model="height"
          @change="setSize"
        />
      </el-form-item>
      <el-form-item class="flex items-center justify-center">
        <Icon icon="system-uicons:create" :size="20" @click="() => (showModal = true)" />
      </el-form-item>
    </el-form>

    <el-dialog
      v-model="showModal"
      :title="$t('editor.setSizeTip')"
      width="600px"
      :before-close="handleClose"
    >
      <p>{{ $t('editor.custom_size') }}</p>
      <el-form :label-width="40" class="flex">
        <el-form-item :label="$t('editor.width')" prop="name">
          <el-input-number :min="1" :max="99999999" v-model="modalData.width" />
        </el-form-item>
        <el-form-item :label="$t('editor.height')" prop="name">
          <el-input-number :min="1" :max="99999999" v-model="modalData.height" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleConfirm">{{ $t('editor.ok') }}</el-button>
        </el-form-item>
      </el-form>
      <p>{{ $t('editor.default_size') }}</p>
      <div class="my-10px flex flex-col gap-2">
        <el-button
          v-for="(item, i) in presetSize"
          :key="`${i}presetSize`"
          size="normal"
          @click="setSizeBy(item.width, item.height)"
        >
          {{ item.label }}:{{ item.width }}x{{ item.height }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="CanvasSize">
import useSelect from '@/hooks/select'
import { useI18n } from 'vue-i18n'

const { mixinState, canvasEditor } = useSelect()
const { t } = useI18n()

const DefaultSize = {
  width: 1920,
  height: 1080
}

const showModal = ref(false)
const modalData = reactive({
  width: DefaultSize.width,
  height: DefaultSize.height
})
let width = ref(DefaultSize.width)
let height = ref(DefaultSize.height)
let presetSize = reactive([
  {
    label: '公众号首图',
    width: 900,
    height: 383
  },
  {
    label: '公众号次图',
    width: 500,
    height: 500
  },
  {
    label: '竖版直播背景',
    width: 1242,
    height: 1660
  },
  {
    label: '竖版数字人',
    width: 1080,
    height: 1920
  },
  {
    label: '横板数字人',
    width: 1920,
    height: 1080
  }
])

onMounted(() => {
  canvasEditor.setSize(width.value, height.value)
  canvasEditor.on('sizeChange', (w, h) => {
    width.value = w
    height.value = h
  })

  // canvas.editor.editorWorkspace.setSize(width.value, height.value);
  // canvas.editor.editorWorkspace = new EditorWorkspace(canvas.c, {
  //   width: width.value,
  //   height: height.value,
  // });
})

const setSizeBy = (w, h) => {
  modalData.width = w
  modalData.height = h
  handleConfirm()
}
const setSize = () => {
  canvasEditor.setSize(width.value, height.value)
  // canvas.editor.editorWorkspace.setSize(width.value, height.value);
}

const handleClose = () => {
  showModal.value = false
}

const handleConfirm = () => {
  width.value = modalData.width
  height.value = modalData.height
  setSize()
  handleClose()
}
</script>

<style scoped lang="scss">
:deep(.el-button + .el-button) {
  margin-left: 0px;
}
</style>
