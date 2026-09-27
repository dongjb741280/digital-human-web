<script lang="ts" setup>
import { ref } from 'vue'
import InteractionH5 from '@/views/digital/interaction-h5.vue'
import logo from '@/assets/imgs/logo.svg'
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
    <button class="floating-btn" @click="toggleModal" aria-label="打开 AI 数字人助手">
        <img class="floating-btn__logo" :src="logo" alt="AI 数字人" />
    </button>

    <!-- 模态框 - 确保在最上层 -->
    <div class="modal-overlay" id="iframeModal" v-if="isModalVisible" @click="handleOverlayClick">
        <div class="modal-container">
            <div class="modal-header">
                <div class="modal-brand">
                    <img class="modal-brand__logo" :src="logo" alt="AI 数字人" />
                    <span class="modal-title">AI数字人助手</span>
                </div>
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
/* 右下角品牌浮动按钮（使用新 logo） */
.floating-btn {
    position: fixed;
    right: 28px;
    bottom: 28px;
    width: 56px;
    height: 56px;
    padding: 0;
    border: none;
    border-radius: 16px;
    cursor: pointer;
    z-index: 999;
    box-shadow: 0 8px 24px rgba(61, 107, 255, 0.35);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.floating-btn__logo {
    width: 100%;
    height: 100%;
    border-radius: 16px;
    display: block;
}

.floating-btn:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 12px 32px rgba(61, 107, 255, 0.45);
}

.pageContent {
    background: var(--dh-gradient-soft);
    padding: 0 12px;
    /* height: 100vh; */
    height: 600px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
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
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(18, 34, 74, 0.25);
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
    padding: 12px 18px;
    background: var(--dh-gradient);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-brand {
    display: flex;
    align-items: center;
    gap: 10px;
}

.modal-brand__logo {
    width: 30px;
    height: 30px;
    border-radius: 8px;
}

.modal-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
}

.close-btn {
    background: rgba(255, 255, 255, 0.18);
    border: none;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    color: #fff;
    padding: 0;
    line-height: 1;
    transition: background 0.2s ease;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.32);
    opacity: 1;
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