<!-- 右键菜单 -->
<script lang="ts" setup>
const { onMenuClick } = defineProps<{
  onMenuClick: (type: string) => void
}>()
</script>

<template>
  <div class="bg-#fff shadow-2xl rounded-4px absolute display-[none]">
    <div class="flex-1 flex items-center justify-center p-5px gap-1">
      <el-tooltip content="删除">
        <Icon
          icon="system-uicons:trash"
          :size="24"
          @click="onMenuClick('delete')"
          class="cursor-pointer border-transparent border border-solid rounded-1 hover:border-#409eff hover:text-#409eff"
        />
      </el-tooltip>
      <el-tooltip content="下一个">
        <Icon
          icon="system-uicons:pull-down"
          :size="24"
          class="cursor-pointer border-transparent border border-solid rounded-1 hover:border-#409eff hover:text-#409eff"
          @click="onMenuClick('moveDown')"
        />
      </el-tooltip>
      <el-tooltip content="上一个">
        <Icon
          icon="system-uicons:pull-up"
          :size="24"
          class="cursor-pointer border-transparent border border-solid rounded-1 hover:border-#409eff hover:text-#409eff"
          @click="onMenuClick('moveUp')"
        />
      </el-tooltip>
      <el-tooltip content="置底">
        <Icon
          icon="system-uicons:push-down"
          :size="24"
          class="cursor-pointer border-transparent border border-solid rounded-1 hover:border-#409eff hover:text-#409eff"
          @click="onMenuClick('moveToBottom')"
        />
      </el-tooltip>
      <el-tooltip content="置顶">
        <Icon
          icon="system-uicons:push-up"
          :size="24"
          class="cursor-pointer border-transparent border border-solid rounded-1 hover:border-#409eff hover:text-#409eff"
          @click="onMenuClick('moveToTop')"
        />
      </el-tooltip>
    </div>
  </div>
</template>
