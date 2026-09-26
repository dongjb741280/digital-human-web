<!--数字人头部金刚位-->
<script lang="ts" setup>
import DNavItem from "./DNavItem.vue";

const router = useRouter()
defineOptions({
  name: 'DNavbar'
})
const menus = [
  {
    title: '数字人视频制作',
    desc: '快速创建数字人视频',
    id: 'menu-1',
    icon: 'digital-menu-1',
    onClick: () => {
      router.push({
        path: '/digital/video-prod'
      })
    }
  },
  {
    id: 'menu-2',
    title: '数字人形象制作',
    desc: '快速创建数字人形象',
    icon: 'digital-menu-2',
    onClick: () => {
      router.push({
        path: '/digital/createDigitalAvatar',
        query: {isNew: true},
      })
    }
  },
  {
    id: 'menu-3',
    title: '声音制作',
    desc: '快速创建个性声音',
    icon: 'digital-menu-3',
    onClick: () => {
      router.push({
        path: '/digital/createVoice'
      })
    }
  },
  {
    id: 'menu-4',
    title: '文案制作',
    desc: '快速生成文案',
    icon: 'digital-menu-4',
    onClick: () => {
      router.push({
        path: '/digital/text-prod'
      })
    }
  }
]
</script>

<template>
  <div class="flex flex-wrap gap-5 p-1px">
    <template v-for="(menu, index) in menus" :key="index">
      <DNavItem
:id="menu.id" :title="menu.title" :desc="menu.desc" :icon="menu.icon"
                :onClick="menu.onClick"/>
    </template>
  </div>
</template>
