import { ArtWork } from './artwork'
import { CardContainer, CardView } from './card'
import { DNavbar } from './navbar'
import { DResources } from './resources'
import { Tookit } from './tookit'
import { DigitalVideo, CardVideo } from './video'
import { CardVoice, VoiceContainer, VoiceModal } from './voice'
import { CardText, TextContainer, TextDetail, TextDetailEdit } from './text'
import { MoreView } from './more'
import { DSideBar, DSideBarPane } from './sidebar'
import BgContainer from './bg/BgContainer.vue'
import PPTContainer from './ppt/PPTContainer.vue'
import StageView from './stageCanvas/index.vue'
import LayersBox from './stageCanvas/layersBox.vue'
import MaterialContainer from './material/index.vue'
import ThumbnailList from './ppt/ThumbnailList.vue'

export {
  /**我的作品 */
  ArtWork,
  /**卡片数字人容器 */
  CardContainer,
  /**卡片数字人-卡片 */
  CardView,
  /** 头部快捷入口 */
  DNavbar,
  /**我的资源 */
  DResources,
  /**AI工具箱 */
  Tookit,
  /**数字人视频-容器 */
  DigitalVideo,
  /**数字人视频-卡片 */
  CardVideo,
  /**数字人语音-卡片 */
  CardVoice,
  /**数字人语音-容器 */
  VoiceContainer,
  /**数字人文本-卡片 */
  CardText,
  /**数字人文本-容器 */
  TextContainer,
  /**更多: */
  MoreView,
  /** 侧边栏 */
  DSideBar,
  DSideBarPane,
  BgContainer,
  PPTContainer,
  TextDetail,
  TextDetailEdit,
  StageView,
  LayersBox,
  MaterialContainer,
  ThumbnailList,
  VoiceModal
}
