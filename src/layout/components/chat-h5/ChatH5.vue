<script lang="ts" setup>
import { ref } from 'vue'
import InteractionH5 from '@/views/digital/interaction-h5.vue'
defineOptions({
    name: 'ChatH5'
})

const isModalVisible = ref(false);

const toggleModal = () => {
    isModalVisible.value = !isModalVisible.value;
}

// 点击模态框外部关闭
const handleOverlayClick = (e: MouseEvent) => {
    // 检查点击的是否是modal-overlay本身（不是子元素）
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
        isModalVisible.value = false;
    }
}

const closeModal = () => {
    isModalVisible.value = false;
}

</script>

<template>
    <!-- 右下角浮动按钮 -->
    <button class="floating-btn" @click="toggleModal"></button>

    <!-- 模态框 - 确保在最上层 -->
    <div class="modal-overlay" id="iframeModal" v-if="isModalVisible" @click="handleOverlayClick">
        <div class="modal-container">
            <div class="modal-header">
                <h3 class="modal-title">AI数字人助手</h3>
                <button class="close-btn" @click="toggleModal">×</button>
            </div>
            <div class="modal-body">
                <div class="pageContent">
                    <InteractionH5 @close-modal="closeModal" />
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
/* 浮动按钮样式保持不变 */
.floating-btn {
    position: fixed;
    right: 30px;
    bottom: 30px;
    width: 53px;
    height: 53px;
    border-radius: 50%;
    background: url(../../../views/h5/images/icon-add.png) no-repeat;
    background: url(../../../assets/imgs/robot1.png) no-repeat;
    background-size: 100% 100%;
    color: white;
    border: none;
    font-size: 24px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    z-index: 999;
    /* 确保按钮在模态框之下 */
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pageContent {
    background-image: linear-gradient(180deg,
            #e7f0fe 0%,
            #edf8fd 100%);
    padding: 0 12px;
    /* height: 100vh; */
    height: 600px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.floating-btn:hover {
    transform: scale(1.1);
}

/* 模态框样式 - 确保在最上层 */
.modal-overlay {
    position: fixed;
    /* top: 0; */
    /* left: 0; */
    right: 0;
    bottom: 0;
    z-index: 1000;
    display: flex;
    justify-content: flex-end;
    /* 改为右对齐 */
    align-items: flex-end;
    /* 改为底部对齐 */

    /* padding-bottom: 80px; */
    /* 按钮高度+间距 */
}

.modal-container {
    background-color: white;
    width: 800px;
    /* width: 100%; */
    /* max-width: 800px; */
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    animation: modalFadeIn 0.3s;
}

@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: translateY(50px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modal-header {
    padding: 6px 20px;
    background:rgb(232, 240 , 254);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-title {
    margin: 0;
    font-size: 18px;
    text-align: center;
    width: 100%;
    padding-left: 40px;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #000;
    padding: 0;
    line-height: 1;
}

.close-btn:hover {
    opacity: 0.8;
}

.modal-body {
    padding: 0;
}

.modal-iframe {
    width: 100%;
    height: 400px;
    border: none;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .modal-container {
        height: 100vh;
        border-radius: 0;
        /* 使用视口高度单位 */
        max-height: none;
        /* 移除最大高度限制 */
    }

    .modal-body {
        padding: 0;
        overflow: hidden;

        height: calc(100%);
    }

    .modal-iframe {
        height: 100%;
        /* 继承父容器高度 */
    }

    .floating-btn {
        right: 20px;
        bottom: 20px;
        width: 50px;
        height: 50px;
        font-size: 20px;
    }
}
</style>