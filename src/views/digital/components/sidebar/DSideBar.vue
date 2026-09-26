<!-- DSideBar 视频创建 侧边栏 -->
<script lang="ts" setup>
defineOptions({
  name: 'DSideBar'
})
const emit = defineEmits(['update:value'])
const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  data: {
    type: Array,
    default: () => []
  }
})
const active = ref('')
watchEffect(() => {
  active.value = props.value
})
const onClick = (item: any) => {
  active.value = item.id
  emit('update:value', item.id)
}
</script>

<template>
  
  <div v-for="(item, index) in data" :key="index" class="relative h-60px flex items-center justify-center cursor-pointer select-none" :class="{ 'bg-#DEE8F3 text-#409eff layout-border__right !after:bg-#409eff !after:w-2px': active === item.id }" @click="onClick(item)">
    {{ item.name  }}
  </div>

</template>
