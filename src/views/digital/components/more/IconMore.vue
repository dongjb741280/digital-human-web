<!-- 更多 -->
<script lang="ts" setup>
  defineOptions({
    name: 'MoreView'
  })
  const porps = defineProps({
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
  })
</script>

<template>
  <el-popover trigger="hover">

        <div class="flex flex-col gap-2">
          <template v-for="(item, index) in data" :key="index">
            <div class="flex justify-between border border-solid border-gray-100 p-8px hover:border-#409eff rounded-1 cursor-pointer" @click="item.onClick">
              <span>{{ item.name }} </span>
              <Icon v-if="item.icon" :icon="item.icon" />
            </div>
          </template>
        </div>

      <template #reference>
        <Icon icon="system-uicons:menu-vertical" :size="16" />
      </template>

    </el-popover>
</template>
