<!--
 * 保存文件
-->

<template>
  <div class="inline-block">
    <el-button class="ml-10px" text @click="beforeClear">
      {{ $t('editor.empty') }}
    </el-button>
    <el-dropdown class="ml-10px" @command="saveWith">
      <el-button type="primary">
        {{ $t('editor.keep') }}
        <Icon icon="ep:arrow-down" />
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <!-- <el-dropdown-item command="clipboard">{{
            $t('editor.copy_to_clipboard')
          }}</el-dropdown-item> -->
          <el-dropdown-item command="saveImg">{{ $t('editor.save_as_picture') }}</el-dropdown-item>
          <el-dropdown-item command="saveSvg">{{ $t('editor.save_as_svg') }}</el-dropdown-item>
          <el-dropdown-item command="saveJson" divided>{{
            $t('editor.save_as_json')
          }}</el-dropdown-item>
          <el-dropdown-item command="saveTemplate">{{
            $t('editor.save_as_template')
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup name="save-bar">
import { ElMessageBox } from 'element-plus'
import useSelect from '@/hooks/select'
import { debounce } from 'lodash-es'
import { useI18n } from 'vue-i18n'
// import { downloadFile } from '@/utils/utils';

const { t } = useI18n()

const { canvasEditor } = useSelect()
const cbMap = {
  clipboard() {
    canvasEditor.clipboard()
  },

  saveJson() {
    canvasEditor.saveJson()
  },

  saveSvg() {
    canvasEditor.saveSvg()
  },

  saveImg() {
    canvasEditor.saveImg()
  },
  saveTemplate() {
    ElMessageBox.prompt('请输入模板名称', '提示', {
      inputValue: canvasEditor.getTempData()?.label || '',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(({ value }) => {
      const data = canvasEditor.getTempData() || {}
      canvasEditor.saveTempData({
        ...data,
        label: value
      })
      canvasEditor.saveTemplate()
    })
  }
}

const saveWith = debounce(function (type) {
  cbMap[type] && typeof cbMap[type] === 'function' && cbMap[type]()
}, 300)

/**
 * @desc clear canvas 清空画布
 */
const clear = () => {
  canvasEditor.clear()
}

const beforeClear = () => {
  ElMessageBox.confirm(`${t('editor.clearTip')}`).then(() => {
    canvasEditor.saveTempData({})
    clear()
  })
}
</script>
