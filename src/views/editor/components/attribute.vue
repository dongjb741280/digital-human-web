<template>
  <div class="box" v-if="mixinState.mSelectMode === 'one'">
    <!-- 字体属性 -->
    <div v-show="textType.includes(mixinState.mSelectOneType)">
      <el-divider plain content-position="left">{{ $t('editor.attributes.font') }}</el-divider>
      <div class="rounded-1 bg-#f6f7f9 p-5px box-border mb-5px flex gap-1">
        <div class="flex items-center flex-1" v-loading="fontLoading">
          <div class="w-40px text-size-14px">字体</div>
          <el-select v-model="fontAttr.fontFamily" @change="changeFontFamily">
            <el-option
              v-for="item in fontsList"
              :label="item.name"
              :value="item.name"
              :key="`font-${item.name}`"
            >
              <div
                v-if="item.img"
                class="font-item"
                :style="`background-image:url('${item.img}');`"
              >
                {{ !item.img ? item : '' }}
                <!-- 解决无法选中问题 -->
                <span style="display: none">{{ item.name }}</span>
              </div>
            </el-option>
          </el-select>
        </div>
        <div class="flex items-center flex-1">
          <div class="w-40px text-size-14px">字号</div>
          <el-input-number
            v-model="fontAttr.fontSize"
            size="default"
            @change="(value) => changeCommon('fontSize', value)"
            :min="1"
          />
        </div>
      </div>
      <div class="rounded-1 bg-#f6f7f9 p-5px box-border mb-5px">
        <div class="flex-item">
          <el-radio-group
            class="button-group"
            v-model="fontAttr.textAlign"
            @change="(value) => changeCommon('textAlign', value)"
            type="button"
          >
            <el-radio v-for="(item, i) in textAlignList" :label="item" :key="item">
              <span v-html="textAlignListSvg[i]"></span>
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="rounded-1 bg-#f6f7f9 p-5px box-border mb-5px">
        <div class="flex-item">
          <el-button-group class="button-group">
            <el-button @click="changeFontWeight('fontWeight', fontAttr.fontWeight)">
              <svg viewBox="0 0 1024 1024" width="14" height="14">
                <path
                  d="M793.99865 476a244 244 0 0 0 54-130.42C862.75865 192.98 743.01865 64 593.85865 64H195.01865a32 32 0 0 0-32 32v96a32 32 0 0 0 32 32h63.74v576H195.01865a32 32 0 0 0-32 32v96a32 32 0 0 0 32 32h418.64c141.6 0 268.28-103.5 282-244.8 9.48-96.9-32.78-184.12-101.66-239.2zM418.33865 224h175.52a96 96 0 0 1 0 192h-175.52z m175.52 576h-175.52V576h175.52a112 112 0 0 1 0 224z"
                  :fill="fontAttr.fontWeight === 'bold' ? '#305ef4' : '#666'"
                />
              </svg>
            </el-button>
            <el-button @click="changeFontStyle('fontStyle', fontAttr.fontStyle)">
              <svg viewBox="0 0 1024 1024" width="14" height="14">
                <path
                  d="M832 96v64a32 32 0 0 1-32 32h-125.52l-160 640H608a32 32 0 0 1 32 32v64a32 32 0 0 1-32 32H224a32 32 0 0 1-32-32v-64a32 32 0 0 1 32-32h125.52l160-640H416a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32h384a32 32 0 0 1 32 32z"
                  :fill="fontAttr.fontStyle === 'italic' ? '#305ef4' : '#666'"
                />
              </svg>
            </el-button>
            <el-button @click="changeLineThrough('linethrough', fontAttr.linethrough)">
              <svg viewBox="0 0 1024 1024" width="14" height="14">
                <path
                  d="M893.088 501.792H125.344a32 32 0 0 0 0 64h767.744a32 32 0 0 0 0-64zM448 448h112V208h288V96H160v112h288zM448 640h112v288H448z"
                  :fill="fontAttr.linethrough ? '#305ef4' : '#666'"
                />
              </svg>
            </el-button>
            <el-button @click="changeUnderline('underline', fontAttr.underline)">
              <svg viewBox="0 0 1024 1024" width="14" height="14">
                <path
                  d="M703.232 67.008h127.488v413.248c0 158.016-142.656 286.016-318.72 286.016-176 0-318.72-128-318.72-286.016V67.008h127.488v413.248c0 39.872 18.176 78.144 51.136 107.776 36.8 32.96 86.528 51.072 140.096 51.072s103.36-18.112 140.032-51.136c33.024-29.632 51.2-67.968 51.2-107.776V67.008zM193.28 871.616h637.44v85.376H193.28v-85.376z"
                  :fill="fontAttr.underline ? '#305ef4' : '#666'"
                />
              </svg>
            </el-button>
          </el-button-group>
        </div>
      </div>

      <div class="p-5px box-border mb-5px flex gap-1 flex-col">
        <div class="flex-1 flex items-center">
          <div class="w-40px text-size-14px">{{ $t('editor.attributes.line_height') }}</div>
          <el-input-number
            v-model="fontAttr.lineHeight"
            size="default"
            @change="(value) => changeCommon('lineHeight', value)"
            :step="0.1"
          />
        </div>
        <div class="flex-1 flex items-center">
          <div class="w-40px text-size-14px">{{ $t('editor.attributes.char_spacing') }}</div>
          <el-input-number
            v-model="fontAttr.charSpacing"
            size="default"
            @change="(value) => changeCommon('charSpacing', value)"
          />
        </div>
      </div>

      <div class="p-5px box-border mb-5px">
        <div class="flex items-center">
          <span class="w-40px text-size-14px">{{ $t('editor.background') }}</span>
          <div class="content">
            <el-color-picker
              v-model="fontAttr.textBackgroundColor"
              @change="(value) => changeCommon('textBackgroundColor', value)"
              show-alpha
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 通用属性 -->
    <div v-show="baseType.includes(mixinState.mSelectOneType)">
      <el-divider plain content-position="left">{{ $t('editor.attributes.exterior') }}</el-divider>
      <!-- 多边形边数 -->
      <div class="flex" v-if="mixinState.mSelectOneType === 'polygon'">
        <div class="flex gap-1 items-center">
          <span class="w-40px text-size-14px">边数</span>
          <el-input-number
            v-model="baseAttr.points.length"
            :min="3"
            :max="30"
            size="default"
            @change="changeEdge"
          />
        </div>
      </div>
      <!-- 颜色 -->
      <colorSelector :color="baseAttr.fill" @change="(value) => changeCommon('fill', value)" />
      <div class="flex gap-1 flex-col mb-5px">
        <div class="flex gap-1 items-center">
          <span class="w-40px text-size-14px">{{ $t('editor.attributes.left') }}</span>
          <el-input-number
            v-model="baseAttr.left"
            size="default"
            @change="(value) => changeCommon('left', value)"
          />
        </div>
        <div class="flex gap-1 items-center">
          <span class="w-40px text-size-14px">{{ $t('editor.attributes.top') }}</span>
          <el-input-number
            v-model="baseAttr.top"
            size="default"
            @change="(value) => changeCommon('top', value)"
          />
        </div>
      </div>
      <div class="rounded-1 bg-#f6f7f9 p-5px box-border mb-5px">
        <div class="flex items-center gap-1">
          <span class="w-40px text-size-14px">{{ $t('editor.attributes.angle') }}</span>
          <el-slider
            class="flex-1"
            v-model="baseAttr.angle"
            :max="360"
            @input="(value) => changeCommon('angle', value)"
          />
        </div>
      </div>
      <div class="rounded-1 bg-#f6f7f9 p-5px box-border mb-5px">
        <div class="flex items-center gap-1">
          <span class="w-40px text-size-14px">{{ $t('editor.attributes.opacity') }}</span>
          <el-slider
            class="flex-1"
            v-model="baseAttr.opacity"
            @input="(value) => changeCommon('opacity', value)"
          />
        </div>
      </div>
      <!-- 边框 -->
      <el-divider plain content-position="left">{{ $t('editor.attributes.stroke') }}</el-divider>

      <div class="flex gap-1 items-center">
        <div class="flex-1">
          <div class="flex items-center">
            <div class="w-40px text-size-14px">{{ $t('editor.color') }}</div>
            <div class="content">
              <el-color-picker
                v-model="baseAttr.stroke"
                @change="(value) => changeCommon('stroke', value)"
                show-alpha
              />
            </div>
          </div>
        </div>
        <div class="flex-1 flex items-center">
          <div class="w-40px text-size-14px">{{ $t('editor.width') }}</div>
          <el-input-number
            v-model="baseAttr.strokeWidth"
            @on-change="(value) => changeCommon('strokeWidth', value)"
            :min="0"
            size="default"
          />
        </div>
      </div>

      <div class="flex mt-10px">
        <div class="flex-1">
          <div class="flex items-center">
            <span class="w-40px text-size-14px">{{ $t('editor.attributes.stroke') }}</span>
            <div class="w-full">
              <el-select v-model="baseAttr.strokeDashArray" @change="borderSet">
                <el-option
                  v-for="item in strokeDashList"
                  :value="item.label"
                  :label="item.label"
                  :key="`stroke-${item.label}`"
                />
              </el-select>
            </div>
          </div>
        </div>
      </div>

      <!-- 阴影 -->
      <el-divider plain content-position="left">{{ $t('editor.attributes.shadow') }}</el-divider>

      <div class="flex gap-1">
        <div class="flex-1">
          <div class="flex items-center">
            <div class="w-40px text-size-14px">{{ $t('editor.color') }}</div>
            <div class="flex-1">
              <el-color-picker
                v-model="baseAttr.shadow.color"
                @change="(value) => changeCommon('color', value)"
                show-alpha
              />
            </div>
          </div>
        </div>
        <div class="flex-1 flex items-center">
          <div class="w-40px text-size-14px">{{ $t('editor.attributes.blur') }}</div>
          <el-input-number
            v-model="baseAttr.shadow.blur"
            :defaultValue="0"
            @change="(value) => changeShadow('blur', value)"
            :min="0"
          />
        </div>
      </div>

      <div class="flex gap-1 w-full mt-10px flex-col">
        <div class="flex-1 flex items-center">
          <div class="w-40px text-size-14px">{{ $t('editor.attributes.offset_x') }}</div>
          <el-input-number
            v-model="baseAttr.shadow.offsetX"
            :defaultValue="0"
            size="default"
            @change="(value) => changeShadow('offsetX', value)"
          />
        </div>
        <div class="flex-1 flex items-center">
          <div class="w-40px text-size-14px">{{ $t('editor.attributes.offset_y') }}</div>
          <el-input-number
            v-model="baseAttr.shadow.offsetY"
            :defaultValue="0"
            @change="(value) => changeShadow('offsetY', value)"
            size="default"
          />
        </div>
      </div>
    </div>

    <!-- ID属性 -->
    <div>
      <!-- <el-divider plain content-position="left">{{ $t('editor.attributes.id') }}</el-divider>
      <div class="rounded-1 bg-#f6f7f9 p-5px box-border mb-5px">
        <div class="content slider-box">
          <el-input v-model="baseAttr.id" @change="changeCommon('id', baseAttr.id)" />
        </div>
      </div> -->
      <!-- 关联数据 -->
      <el-divider plain content-position="left">{{ $t('editor.attributes.linkData') }}</el-divider>
      <div class="p-5px box-border mb-5px">
        <div class="flex flex-col gap-1">
          <el-select
            v-model="baseAttr.linkData[0]"
            filterable
            allow-create
            @change="changeCommon('linkData', baseAttr.linkData)"
          >
            <el-option value="src" label="src" />
            <el-option value="text" label="text" />
          </el-select>
          <el-input v-model="baseAttr.linkData[1]" size="large" placeholder="请输入" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="AttrBute">
import useSelect from '@/hooks/select'
import colorSelector from './colorSelector.vue'
import { getPolygonVertices } from '@/utils/math'

const update = getCurrentInstance()
const { fabric, mixinState, canvasEditor } = useSelect()

const fontsList = ref([])
const fontLoading = ref(false)

canvasEditor.getFontList().then((list) => {
  console.log('getFontList', list)
  fontsList.value = list
})

// 通用元素
const baseType = [
  'text',
  'i-text',
  'textbox',
  'rect',
  'circle',
  'triangle',
  'polygon',
  'image',
  'group',
  'line',
  'arrow'
]
// 文字元素
const textType = ['i-text', 'textbox', 'text']
// 通用属性
const baseAttr = reactive({
  id: '',
  opacity: 0,
  angle: 0,
  fill: '#fff',
  left: 0,
  top: 0,
  strokeWidth: 0,
  strokeDashArray: [],
  stroke: '#fff',
  shadow: {
    color: '#fff',
    blur: 0,
    offsetX: 0,
    offsetY: 0
  },
  points: {},
  linkData: [null, null]
})
// 字体属性
const fontAttr = reactive({
  fontSize: 0,
  fontFamily: '',
  lineHeight: 0,
  charSpacing: 0,
  fontWeight: '',
  textBackgroundColor: '#fff',
  textAlign: '',
  fontStyle: '',
  underline: false,
  linethrough: false,
  overline: false
})
const strokeDashList = [
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [],
      strokeLineCap: 'butt'
    },
    label: 'Stroke'
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 10],
      strokeLineCap: 'butt'
    },
    label: 'Dash-1'
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 10],
      strokeLineCap: 'round'
    },
    label: 'Dash-2'
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [15, 15],
      strokeLineCap: 'square'
    },
    label: 'Dash-3'
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [15, 15],
      strokeLineCap: 'round'
    },
    label: 'Dash-4'
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [25, 25],
      strokeLineCap: 'square'
    },
    label: 'Dash-5'
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [25, 25],
      strokeLineCap: 'round'
    },
    label: 'Dash-6'
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 8, 16, 8, 1, 20],
      strokeLineCap: 'square'
    },
    label: 'Dash-7'
  },
  {
    value: {
      strokeUniform: true,
      strokeDashArray: [1, 8, 16, 8, 1, 20],
      strokeLineCap: 'round'
    },
    label: 'Dash-8'
  }
]
// 字体对齐方式
const textAlignList = ['left', 'center', 'right']
// 对齐图标
const textAlignListSvg = [
  '<svg t="1650441458823" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3554" width="18" height="18"><path d="M198.4 198.4h341.333333c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-341.333333c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m0 170.666667h569.6c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-569.6c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m0 170.666666h454.4c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-454.4c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533334z m0 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z" p-id="3555"></path></svg>',
  '<svg t="1650441512015" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3704" width="18" height="18"><path d="M313.6 198.4h398.933333c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-398.933333c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 10.666667-8.533333 19.2-8.533333z m-115.2 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m115.2 170.666666h398.933333c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-398.933333c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 10.666667-8.533333 19.2-8.533334z m-115.2 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z" p-id="3705"></path></svg>',
  '<svg t="1650441519862" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3854" width="18" height="18"><path d="M454.4 283.733333v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h341.333334c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-341.333334c-8.533333 0-14.933333-2.133333-19.2-8.533334-4.266667-4.266667-8.533333-10.666667-8.533333-19.2z m-226.133333 170.666667v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h569.6c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333H256c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-4.266667-8.533333-10.666667-8.533333-19.2z m113.066666 170.666667v-57.6c0-8.533333 2.133333-14.933333 8.533334-19.2 6.4-6.4 12.8-8.533333 19.2-8.533334h454.4c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-454.4c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-4.266667-8.533333-10.666667-8.533334-19.2z m-170.666666 170.666666v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-4.266667-8.533333-10.666667-8.533333-19.2z" p-id="3855"></path></svg>'
]

const getObjectAttr = (e) => {
  const activeObject = canvasEditor.canvas.getActiveObject()
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return
  if (activeObject) {
    // base
    baseAttr.id = activeObject.get('id')
    baseAttr.opacity = activeObject.get('opacity') * 100
    baseAttr.fill = activeObject.get('fill')
    baseAttr.left = activeObject.get('left')
    baseAttr.top = activeObject.get('top')
    baseAttr.stroke = activeObject.get('stroke')
    baseAttr.strokeWidth = activeObject.get('strokeWidth')
    baseAttr.shadow = activeObject.get('shadow') || {}
    baseAttr.angle = activeObject.get('angle') || 0
    baseAttr.points = activeObject.get('points') || {}
    baseAttr.linkData = activeObject.get('linkData') || [null, null]

    const textTypes = ['i-text', 'text', 'textbox']
    if (textTypes.includes(activeObject.type)) {
      fontAttr.fontSize = activeObject.get('fontSize')
      fontAttr.fontFamily = activeObject.get('fontFamily')
      fontAttr.lineHeight = activeObject.get('lineHeight')
      fontAttr.textAlign = activeObject.get('textAlign')
      fontAttr.underline = activeObject.get('underline')
      fontAttr.linethrough = activeObject.get('linethrough')
      fontAttr.charSpacing = activeObject.get('charSpacing')
      fontAttr.overline = activeObject.get('overline')
      fontAttr.fontStyle = activeObject.get('fontStyle')
      fontAttr.textBackgroundColor = activeObject.get('textBackgroundColor')
      fontAttr.fontWeight = activeObject.get('fontWeight')
    }
  }
}

const selectCancel = () => {
  baseAttr.fill = ''
  update?.proxy?.$forceUpdate()
}

const init = () => {
  // 获取字体数据

  canvasEditor.on('selectCancel', selectCancel)
  canvasEditor.on('selectOne', getObjectAttr)
  canvasEditor.canvas.on('object:modified', getObjectAttr)
}

// 修改字体
const changeFontFamily = async (fontName) => {
  if (!fontName) return
  fontLoading.value = true
  canvasEditor
    .loadFont(fontName)
    .catch((err) => {
      console.log('err', err)
    })
    .finally(() => (fontLoading.value = false))
}

// 通用属性改变
const changeCommon = (key, value) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0]
  // 透明度特殊转换
  if (key === 'opacity') {
    activeObject && activeObject.set(key, value / 100)
    canvasEditor.canvas.renderAll()
    return
  }
  // 旋转角度适配
  if (key === 'angle') {
    activeObject.rotate(value)
    canvasEditor.canvas.renderAll()
    return
  }
  activeObject && activeObject.set(key, value)
  canvasEditor.canvas.renderAll()

  // 更新属性
  getObjectAttr()
}

// 边框设置
const borderSet = (key) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0]
  if (activeObject) {
    const stroke = strokeDashList.find((item) => item.label === key)
    activeObject.set(stroke.value)
    canvasEditor.canvas.renderAll()
  }
}

// 阴影设置
const changeShadow = () => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0]
  activeObject && activeObject.set('shadow', new fabric.Shadow(baseAttr.shadow))
  canvasEditor.canvas.renderAll()
}

// 加粗
const changeFontWeight = (key, value) => {
  const nValue = value === 'normal' ? 'bold' : 'normal'
  fontAttr.fontWeight = nValue
  const activeObject = canvasEditor.canvas.getActiveObjects()[0]
  activeObject && activeObject.set(key, nValue)
  canvasEditor.canvas.renderAll()
}

// 斜体
const changeFontStyle = (key, value) => {
  const nValue = value === 'normal' ? 'italic' : 'normal'
  fontAttr.fontStyle = nValue
  const activeObject = canvasEditor.canvas.getActiveObjects()[0]
  activeObject && activeObject.set(key, nValue)
  canvasEditor.canvas.renderAll()
}

// 中划
const changeLineThrough = (key, value) => {
  const nValue = value === false
  fontAttr.linethrough = nValue
  const activeObject = canvasEditor.canvas.getActiveObjects()[0]
  activeObject && activeObject.set(key, nValue)
  canvasEditor.canvas.renderAll()
}

// 下划
const changeUnderline = (key, value) => {
  const nValue = value === false
  fontAttr.underline = nValue
  const activeObject = canvasEditor.canvas.getActiveObjects()[0]
  activeObject && activeObject.set(key, nValue)
  canvasEditor.canvas.renderAll()
}

// 修改边数
const changeEdge = (value) => {
  const activeObjects = canvasEditor.canvas.getActiveObjects()
  if (!activeObjects || !activeObjects.length) return
  activeObjects[0].set(
    'points',
    getPolygonVertices(value, Math.min(activeObjects[0].width, activeObjects[0].height) / 2)
  )
  canvasEditor.canvas.requestRenderAll()
}

onMounted(init)

onBeforeUnmount(() => {
  canvasEditor.off('selectCancel', selectCancel)
  canvasEditor.off('selectOne', getObjectAttr)
  canvasEditor.canvas.off('object:modified', getObjectAttr)
})
</script>

<style scoped lang="scss">
.box {
  width: 100%;
}
:deep(.el-input-number--default) {
  line-height: 30px;
  width: 100% !important;
}

.font-selector {
  .font-item {
    height: 40px;
    width: 330px;
    background-size: auto 40px;
    background-repeat: no-repeat;
  }
}
</style>
