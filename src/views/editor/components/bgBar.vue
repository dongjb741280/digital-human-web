<template>
  <div v-if="!mixinState.mSelectMode">
    <el-divider content-position="left" plain>{{ $t('editor.color') }}</el-divider>
    
    <div class="w-full box-border p-2px border rounded-1 border-1px border-solid border-gray-300 flex justify-between items-center hover:border-#409eff" @click="showColorPicker">
      <el-color-picker ref="colorPicker" v-model="color" show-alpha @change="setThisColor" />
      <Icon icon="ep:arrow-down" class="hover:text-#409eff  mr-8px" />
    </div>
    <el-divider content-position="left" plain>{{ $t('editor.color_macthing') }}</el-divider>
    <div class="flex flex-wrap gap-5px">
      <template v-for="(item, i) in colorList" :key="item.label + i">
        <span
          class="w-30px h-30px rounded-100% v-middle"
          v-for="itc in item.color"
          :key="itc"
          :style="`background:${itc}`"
          @click="setColor(itc)"
        ></span>
      </template>
    </div>
  </div>
</template>

<script setup name="BgBar">
import { ref } from 'vue'
import useSelect from '@/hooks/select'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { mixinState, canvasEditor } = useSelect()
const colorPicker = ref()
const isColorPickerShow = ref(false)
const colorList = [
  {
    label: t('editor.scenary_x', { number: 1 }),
    color: ['#5F2B63', '#B23554', '#F27E56', '#FCE766']
  },
  {
    label: t('editor.scenary_x', { number: 2 }),
    color: ['#86DCCD', '#E7FDCB', '#FFDC84', '#F57677']
  },
  {
    label: t('editor.scenary_x', { number: 3 }),
    color: ['#5FC2C7', '#98DFE5', '#C2EFF3', '#DDFDFD']
  },
  {
    label: t('editor.scenary_x', { number: 4 }),
    color: ['#9EE9D3', '#2FC6C8', '#2D7A9D', '#48466d']
  },
  {
    label: t('editor.scenary_x', { number: 5 }),
    color: ['#61c0bf', '#bbded6', '#fae3d9', '#ffb6b9']
  },
  {
    label: t('editor.scenary_x', { number: 6 }),
    color: ['#ffaaa5', '#ffd3b6', '#dcedc1', '#a8e6cf']
  }
]
const showColorPicker = () => {
  isColorPickerShow.value = isColorPickerShow.value ? false : true
  if(isColorPickerShow.value){
    colorPicker.value && colorPicker.value.show()
  }else{
    colorPicker.value && colorPicker.value.hide()
  }
}

const color = ref('')
// 背景颜色设置
const setThisColor = () => {
  setColor(color.value)
}
// 背景颜色设置
function setColor(color) {
  const workspace = canvasEditor.canvas.getObjects().find((item) => item.id === 'workspace')
  workspace.set('fill', color)
  canvasEditor.canvas.renderAll()
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.img {
  width: 50px;
  padding: 5px;
  background: #f5f5f5;
  margin-left: 2px;
  height: 70px;
  cursor: pointer;
}

:deep(.el-color-picker .el-color-picker__empty){
  display: none !important;
}
:deep(.el-color-picker__icon){
  display: none !important;
}
:deep(.el-color-picker__icon){
  display: none !important;
}
:deep(.el-color-picker__trigger){
  border: none !important;
}
</style>
