<script lang="tsx">
import { ElScrollbar } from 'element-plus'
import H5View from './components/H5View.vue'
import { NavTab } from "./components/tab";
import { ChatH5 } from "./components/chat-h5";


export default defineComponent({
  name: 'H5Layout',
  setup() {
    // 获取 NavTab 的实例
    const navTabRef = ref(null);
    const pageTitle = ref('');

    const goBack = () => {
      history.back();
    };

    // 监听子组件的 childValue
    watch(
      () => navTabRef.value?.title,
      (newValue, oldValue) => {
        pageTitle.value = newValue ? newValue : oldValue;
      }
    );


    return () => (
      <div>
        <div class="nav-bar">
          <div class="back-button" onClick={goBack}>
              <div class="back-arrow"></div>
              <span>返回</span>
          </div>
          <h1 class="title">{ pageTitle.value }</h1>
        </div>
        <NavTab ref={ navTabRef }></NavTab>
        <ChatH5></ChatH5>

        <ElScrollbar>
          <H5View></H5View>
        </ElScrollbar>
      </div>
    )
  }
})
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-layout;

.#{$prefix-cls} {
  background-color: var(--app-content-bg-color);
  :deep(.#{$elNamespace}-scrollbar__view) {
    height: 100% !important;
  }
}


.back-button:hover .wechat-back-arrow {
    transform: rotate(45deg) translateX(-3px);
}

.back-button {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    padding: 10px;
}

.back-arrow {
    width: 10px;
    height: 10px;
    border-left: 2px solid #333;
    border-bottom: 2px solid #333;
    transform: rotate(45deg);
    margin-right: 8px;
    transition: transform 0.2s ease;
}

.fixed-top {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 2.5em;
    background-color: #ffffff;
    z-index: 999;
}

body, h1, p, button {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.nav-bar {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    color: rgb(194, 190, 190);
    height: 40px;
    padding: 0 12px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
}

.back-button {
    background: none;
    border: none;
    color: rgb(38, 38, 38);
    font-size: 15px;
    cursor: pointer;
    padding: 5px;
    margin-right: 10px;
}

.back-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
}

.title {
    position: fixed;
    font-size: 17px;
    margin: 0;
    flex-grow: 1;
    left: 45%;
    color: #333;
}
</style>
