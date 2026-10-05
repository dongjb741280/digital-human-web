<!-- view container -->
<script lang="ts" setup>
import { DSideBar } from './'
import { CardContainer, VoiceContainer, BgContainer, PPTContainer, MaterialContainer } from "../";
const emit = defineEmits(['onClick'])
defineOptions({
  name: 'DSideBarPane'
})
const props = defineProps({
  data: {
    type: Object as PropType<IDType>,
    default: () => {
      return {
        humanId: '',
        voiceId: '',
        backgroundId: '',
        copywriteId: '',
        materialId: ''
      }
    }
  },
  pptId:{
    type: String,
    default: "",
  }
})
export type IDType = {
  humanId?: string,
  voiceId?: string,
  backgroundId?: string,
  copywriteId?: string
  materialId?: string
}
const views = [
  {
    name: '数字人',
    id: 'humanId',
    status: '4',
    component: markRaw(CardContainer),
    className: '!w-90px !h-110px',
    // align: 'right',
    btns: [
      {
        name: '我的克隆',
        type: '0',
      },
      {
        name: '公共库',
        type: '1'
      }
    ]
  },
  {
    name: '声音',
    id: 'voiceId',
    align: 'center',
    status: '4',
    className: '!w-180px !h-55px',
    showSearch: true,
    component: markRaw(VoiceContainer),
    btns: [
      {
        name: '我的声音',
        type: '0',
      },
      {
        name: '公共库',
        type: '1'
      }
    ]
  },
  {
    name: '背景',
    id: 'backgroundId',
    component: markRaw(BgContainer),
    btns: [
      {
        name: '我的',
        type: '0',
      },
      {
        name: '公共库',
        type: '1'
      }
    ]
  },
  {
    name: 'PPT',
    id: 'copywriteId',
    status: '4',
    showSearch: true,
    component: markRaw(PPTContainer),
    btns: [
      {
        name: '我的文案',
        type: '0',
      },
      {
        name: '公共库',
        type: '1'
      }
    ]
  },
  {
    name: '素材',
    id: 'materialId',
    status: '5',
    component: markRaw(MaterialContainer),
    btns: [
      {
        name: '我的素材',
        type: '0',
      },
      {
        name: '公共库',
        type: '1'
      }
    ]
  },
]
const activeId = ref('humanId')
const types = reactive({
  humanId: '0',
  voiceId: '0',
  backgroundId: '0',
  copywriteId: '0',
  materialId: '0'
})
const onItemClick = (item: any) => {
  emit('onClick',item)
}
</script>

<template>
  <div class="flex border border-solid border-coolgray-100 rounded-2 overflow-hidden">
    <div class="flex-1 bg-white p-10px">
      <template v-for="(item, index) in views" :key="index">
        <div v-show="activeId === item.id" class="flex flex-col items-center justify-center">
          <el-radio-group v-model="types[item.id]" v-if="item.btns">
            <el-radio
              v-for="(btn, index1) in item.btns"
              :key="index1"
              :value="btn.type" border>{{ btn.name }}</el-radio>
          </el-radio-group>
          <component
            :is="item.component" :type="types[item.id]" @on-click="onItemClick" :className="item?.className" :pptId="props.pptId"
            :align="item?.align" class="!h-[calc(100vh_-_220px)] !w-full overflow-y-auto custom-scroll-bar" :id="data[item.id]" :status="item?.status" :showSearch="item?.showSearch" isMobile/>
        </div>
      </template>
    </div>
    <div class="w-70px bg-#F3FAFD">
      <DSideBar v-model:value="activeId" :data="views.map(v => { return { name: v.name, id: v.id } })" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-radio__inner){
    display: none;
}
.custom-scroll-bar::-webkit-scrollbar {
  display: none;
}

.custom-scroll-bar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
