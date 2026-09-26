<!-- 表单 -->
<script lang="ts" setup>
import type { FormInstance } from 'element-plus'

const porps = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
})
const emits = defineEmits(['close'])
const baseFrom = reactive({})
const baseRules = reactive({})
const colorData = reactive({})
const loading = ref(false)
const enumData = ref<any[]>([])
const formEl = ref<FormInstance>()
const autoSize = { minRows: 3, maxRows: 5 }

watchEffect(() => {
  // 判断 porps.data 是否 array
  console.log('porps-data', porps.data.data)
  porps.data.data.map((item: any, index) => {
    if (item.children.length > 0) {
      item.children.map((child, childIndex) => {
        baseFrom[child.valuekey] = child.value || ''
        if (child.required) {
          baseRules[child.valuekey] = [
            { required: child.required, message: child.label + '不能为空', trigger: 'blur' }
          ]
        }
        if (child.type === 'select') {
          if (child.enumName || !(child.options && child.options.length > 0)) {
            enumData.value.push({ key: index, childIndex: childIndex, value: child.valuekey })
          }
        }
      })
    }
  })
})

const changeSelect = (index, field, value) => {}
const submit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
      loading.value = true
      setTimeout(() => {
        loading.value = false
        emits('close')
      }, 2000)
    } else {
      console.log('error submit!')
      return false
    }
  })
}
// onMounted(async () => {
//   await nextTick()
//   // 获取 父类 id viewModal 的元素
//   const dialog = document.querySelector<HTMLElement>('#view-modal')
//   if (dialog) {
//     // 获取dialog 的高度
//     const height = dialog.clientHeight
//     // 设置 dialog 的高度
//     const formHeight = formEl.value.$el.offsetHeight
//     console.log('formHeight', formHeight)
//     console.log('height', height)
//     if (formHeight > height) {
//       if (height > 0) {
//         const maxHeight = height * 2
//         dialog.style.maxHeight = maxHeight + 'px'
//       }
//       dialog.style.height = formHeight + 'px'
//     }
//   }
// })
</script>

<template>
  <div class="bg-#fff w-full h-full overflow-hidden overflow-y-auto box-border p-10px">
    <el-form
      ref="formEl"
      :model="baseFrom"
      :rules="baseRules"
      inline
      :loading="loading"
      label-width="auto"
    >
      <div class="w-full" v-for="(item, index) in data.data" :key="index">
        <div class="h-40px sticky flex items-center top-0 z-10 bg-#F3FAFD pl-10px">
          <span>{{ item.label }}</span>
        </div>
        <div class="grid grid-cols-1 row-auto w-full gap-2 mt-10px">
          <div class="w-full" v-for="(field, index2) in item.children" :key="index2">
            <el-form-item class="w-full" :label="field.label" :prop="field.valuekey">
              <template #label>
                <span :class="{ 'is-light': colorData[field.valuekey] == '1' }">{{
                  field.label
                }}</span>
              </template>
              <el-input
                v-if="field.type === 'input'"
                v-model="baseFrom[field.valuekey]"
                :disabled="field.disabled"
                :placeholder="field.disabled ? '' : field.placeholder"
                :type="field.inputType || 'text'"
              />

              <el-input
                v-else-if="field.type === 'textarea'"
                v-model="baseFrom[field.valuekey]"
                :disabled="field.disabled"
                :placeholder="field.disabled ? '' : field.placeholder"
                type="textarea"
                :autosize="field.autosize || autoSize"
              />

              <el-select
                v-else-if="field.type === 'select'"
                v-model="baseFrom[field.valuekey]"
                :disabled="field.disabled"
                :placeholder="field.disabled ? '' : field.placeholder"
                @change="changeSelect(index, field, $event)"
              >
                <el-option
                  v-for="option in field.options"
                  :key="option[field.optValue || 'value']"
                  :label="option[field.optLabel || 'label']"
                  :value="option[field.optValue || 'value']"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <div class="flex justify-end mt-10px" v-if="data.data.length > 0">
      <el-button type="primary" :loading="loading" @click="submit(formEl)">提交</el-button>
    </div>
  </div>
</template>
