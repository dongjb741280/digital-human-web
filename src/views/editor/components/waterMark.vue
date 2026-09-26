<template>
  <el-button text @click="addWaterMark">
    {{ $t('editor.waterMark.text') }}
  </el-button>

  <el-dialog v-model="showWaterMadal" :title="$t('editor.waterMark.modalTitle')" width="500px">
    <div class="w-full flex justify-start items-center mb-10px">
      <span class="mr-10px whitespace-nowrap">{{ $t('editor.waterMark.setting.name') }}</span>
      <el-input
        class="w-full"
        v-model="waterMarkState.text"
        maxlength="15"
        show-word-limit
        :placeholder="$t('editor.placeholder')"
      />
    </div>
    <div class="w-full flex justify-start items-center mb-10px">
      <span class="mr-10px whitespace-nowrap">选择字体</span>
      <el-select class="w-full" v-model="waterMarkState.fontFamily" @on-change="changeFontFamily">
        <el-option
          v-for="item in fontsList"
          :value="item.name"
          :label="item.name"
          :key="`font-${item.name}`"
        >
          <div class="h-40px w-full" v-if="!item.img">{{ item.name }}</div>
          <div
            class="h-40px w-full bg-auto bg-no-repeat"
            v-else
            :style="`background-image:url('${item.img}');`"
          >
            {{ !item.img ? item : '' }}
          </div>
        </el-option>
      </el-select>
    </div>
    <div class="w-full flex justify-start items-center mb-10px">
      <span class="mr-10px whitespace-nowrap">{{ $t('editor.waterMark.setting.size') }}</span>

      <el-slider class="w-full" v-model="waterMarkState.size" :min="18" :max="48" />
    </div>
    <div class="w-full flex justify-start items-center mb-10px">
      <span class="mr-10px whitespace-nowrap">{{ $t('editor.waterMark.setting.color') }}</span>

      <el-color-picker v-model="waterMarkState.color" />
    </div>
    <div class="w-full flex justify-start items-center mb-10px">
      <span class="mr-10px whitespace-nowrap">{{
        $t('editor.waterMark.setting.position.label')
      }}</span>

      <el-radio-group v-model="waterMarkState.position">
        <el-radio :value="POSITION.lt">{{ $t('editor.waterMark.setting.position.lt') }}</el-radio>
        <el-radio :value="POSITION.rt">{{ $t('editor.waterMark.setting.position.rt') }}</el-radio>
        <el-radio :value="POSITION.lb">{{ $t('editor.waterMark.setting.position.lb') }}</el-radio>
        <el-radio :value="POSITION.rb">{{ $t('editor.waterMark.setting.position.rb') }}</el-radio>
        <el-radio :value="POSITION.full">{{
          $t('editor.waterMark.setting.position.full')
        }}</el-radio>
      </el-radio-group>
    </div>

    <div
      class="w-full flex justify-start items-center mb-10px"
      v-show="waterMarkState.position === POSITION.full"
    >
      <span class="mr-10px whitespace-nowrap">{{ $t('editor.waterMark.setting.angle') }}</span>

      <div>
        <el-radio-group v-model="waterMarkState.isRotate">
          <el-radio :value="0">横向</el-radio>
          <el-radio :value="1">倾斜</el-radio>
        </el-radio-group>
      </div>
    </div>
    <template #footer>
      <el-button size="small" text @click="onCleanUpWaterMark">{{
        `${$t('editor.cleanUp')}${$t('editor.waterMark.text')}`
      }}</el-button>
      <el-button size="small" type="primary" @click="onModalOk">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script name="WaterMark" lang="ts" setup>
import { cloneDeep, debounce } from 'lodash-es'
import useSelect from '@/hooks/select'
// import { useFont } from '@/hooks';
import { ElMessage } from 'element-plus'
enum POSITION {
  lt = 'Left_Top',
  lb = 'Left_Right',
  rt = 'Right_Top',
  rb = 'Right_Bottom',
  full = 'Full'
}

type IPosition = POSITION.lt | POSITION.lb | POSITION.rt | POSITION.rb | POSITION.full // lt 左上 lr 左上 rt 右上  rb 右下 full 平铺 后续可扩展其他功能

type IDrawOps = {
  text: string
  size: number
  fontFamily: string
  color: string
  isRotate: boolean
  position: IPosition
}
const { canvasEditor }: any = useSelect()

const fontsList = ref<{ name: string; img?: string }[]>([])
// canvasEditor.getFontList().then((list: any) => {
//   fontsList.value = list
// })
const waterMarkState: any = reactive({
  text: '',
  size: 24,
  isRotate: 0, // 组件不支持boolean
  fontFamily: '汉体', // 可考虑自定义字体
  color: '#ccc', // 可考虑自定义颜色
  position: POSITION.lt // lt 左上 rt 右上 lb 左下  rb 右下 full 平铺
})

const showWaterMadal = ref(false)

const onCleanUpWaterMark = () => {
  waterMarkState.text = ''
  waterMarkState.size = 24
  waterMarkState.fontFamily = 'serif'
  waterMarkState.color = '#ccc'
  waterMarkState.position = POSITION.lt
  waterMarkState.isRotate = 0
  canvasEditor.clearWaterMMatk()
}

const onModalOk = async () => {
  if (!waterMarkState.text)
    return ElMessage({
      message: '水印名字不能为空',
      type: 'warning'
    })
  const ops: IDrawOps = cloneDeep(waterMarkState)
  ops.isRotate = !!ops.isRotate // 转为对应类型  后续再统一处理类型
  await canvasEditor.drawWaterMark(ops)
  // onMadalCancel();
}

const changeFontFamily = (fontName: string) => {
  if (!fontName) return
  canvasEditor.loadFont(fontName)
}

const addWaterMark = debounce(function () {
  showWaterMadal.value = true
}, 250)
</script>
