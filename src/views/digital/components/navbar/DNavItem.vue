<!-- nav item -->
<script lang="ts" setup>
import { svgUrl } from "@/utils/imgURL";
defineOptions({ name: 'DNavItem' })
 const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
   },
   icon: {
    type: String,
    default: ''
  },
   onClick: {
    type: Function,
    default: () => {}
  }
 })
const Icon = svgUrl(props.icon)
 

</script>

<template>
  <div class="flex w-250px h-120px bg-#F3FAFD border border-solid border-gray-100 rounded-2 shadow-sm">
    <div class=" flex flex-1 flex-col justify-center items-center">
      <div class="pl-10px">
        <span class="font-600 text-16px text-#333333">
          {{ title }}
        </span>
        <span class="text-12px inline-block text-#666666 mt-2 mb-2">
          {{ desc }}
        </span>
        <el-button type="primary" size="small" @click="onClick">
          开始创作
        </el-button>
      </div>

    </div>
    <div class="flex-1">
      <el-image :src="Icon" alt="Icon" />
    </div>
  </div>
</template>
