<!--PPT-->
<script lang="ts" setup>
import { debounce } from 'lodash-es'
import { useUserStore } from '@/store/modules/user'
import { getTextManageListPage, getFirstPptImageByCopywriteId } from "@/api/digital";
import { Search } from '@element-plus/icons-vue'
defineOptions({
  name: 'PPTContainer'
})
const userStore = useUserStore()
const porps = defineProps({
  className: {
    type: [String, Object, Array],
    default: () => {
      return {}
    }
  },
  align: {
    type: String,
    default: 'left'
  },
  id: {
    type: String,
    default: '-1'
  },
  pagination: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: '' // null 查询所有 1: 3:失败 4:成功
  },
  showSearch: {
    type: Boolean,
    default: false
  },
  pptId:{
    type:String,
    default: ""
  }
})
watch(() => porps.id, (newVal) => {
  selectId.value = newVal
})
const selectId = ref(porps.id)
const loading = ref(false)
const alignClass = computed(() => {
  return {
    'justify-start': porps.align === 'left',
    'justify-right': porps.align === 'right',
    'justify-center': porps.align === 'center'
  }
})
const emit = defineEmits(['onClick'])
const data = ref<any[]>([])
const pageParams = reactive({
  total: 0,
  pageNo: 1,
  pageSize: 10
})
const copywriteTitle = ref('')
const onSearch = () => {
  pageParams.pageNo = 1
  getList()
}
const onItemClick = (item: any) => {
  selectId.value = item.id
  item.copywriteId = item.id
  emit('onClick', item)
}
const getList = debounce(() => {
  loading.value = true
  if(porps.pptId){

  }
  getTextManageListPage({ publicLibType: '0', copywriteStatus: porps.status, oprStaff: userStore.getUser.id, ...pageParams, copywriteTitle: copywriteTitle.value,id:porps.pptId }).then(res => {

    pageParams.total = res.total
    loadImages(res.list)

  }).catch(err => {
    console.log(err)
  }).finally(() => {
    loading.value = false
  })
}, 500)
onMounted(() => {
  getList()
})
const loadImages = async (list: any[]) => {
  for (const item of list) {
    item.imageUrl = await getCoverUrl(item.id)
  }
  data.value = list
  return list
}
const getCoverUrl = async (id: string) => {
  const resp = await getFirstPptImageByCopywriteId({ copywriteId: id })
  return resp.imageData
}
</script>

<template>

  <div v-loading="loading">
    <div v-if="data.length > 0" class="flex flex-col gap-10px items-center pt-10px" :class="alignClass">
      <el-input v-if="showSearch" v-model="copywriteTitle" placeholder="请输入文案标题搜索" clearable @clear="onSearch">
        <template #append>
          <el-button :icon="Search" @click="onSearch" />
        </template>
      </el-input>
      <el-image
        class="border border-solid border-gray-100 rounded-2 shadow-sm w-85% h-100px"
        v-for="(item, index) in data" :key="index" :src="item.imageUrl"
        :class="{ '!border-#409eff p-3px': selectId === item.id }" @click="onItemClick(item)" />
    </div>
    <el-empty class="h-150px" :image-size="50" description="暂无数据" v-else />
  </div>

</template>
