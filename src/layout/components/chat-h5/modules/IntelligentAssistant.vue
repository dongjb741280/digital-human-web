<template>
    <div class="answer-box">
        <div class="answeringArea">
            <div class="area_left">
                <div class="answer" v-html="dynamicAnswer"></div>
            </div>
            <div class="time">
                {{ getNewDate() }}
            </div>
            <img
                v-show="showActiveMan || showActiveManCopy"
                fit="contain"
                src="../../../../assets/images/wowanGIF.gif" 
            />
            <img
                v-show="!showActiveMan && !showActiveManCopy"
                fit="contain"
                src="../../../../assets/images/halfBody.png"
            />
        </div>
    </div>
</template>

<script>
import wowanGIF from '@/assets/images/wowanGIF.gif'
import halfBody from '@/assets/images/halfBody.png'

export default {
    name: 'IntelligentAssistant',
    components: {},
    props: {
        showActiveMan: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            halfBody,
            wowanGIF,
            dynamicAnswer: '',
            showActiveManCopy: false,
            WELCOME_MESSAGE:'您好，专属智能助理小联为您服务！我一直都在，有疑问您可以随时问我哦～'
        }
    },

    watch: {
        WELCOME_MESSAGE: {
            handler(val) {
                this.showActiveManCopy = true
                // 根据val动态生成
                let i = 0
                const interval = setInterval(() => {
                    // 检查是否已经显示完所有字符
                    if (val && i < val.length) {
                        // 逐字添加到容器中
                        this.dynamicAnswer += val.charAt(i)
                        i++
                    } else {
                        // 显示完所有字符后清除定时器
                        clearInterval(interval)
                        this.showActiveManCopy = false
                    }
                }, 100) // 设置每隔100毫秒显示一个字符
            },
            immediate: true
        }
    },
    created() {},
    mounted() {},
    methods: {
        getNewDate() {
            let date = new Date()
            let hours = date.getHours()
            let minutes = date.getMinutes()
            let time = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`
            return time
        }
    }
}
</script>

<style scoped lang="scss">
.answeringArea {
    margin-top: 50px;  // 原80px → 40px
    margin-bottom: 10px;  // 原20px → 10px
    width: 100%;
    position: relative;
    background: #ffffff;
    box-shadow: 0px 3px 8px 0px var(--theme-box-shadow-color);
    border-radius: 6px;  // 原32px → 16px
    .time {
        position: absolute;
        top: -50px;
        left: 50%;
        font-family: PingFangSC-Regular;
        font-size: 14px;  // 原20px → 14px
        color: rgba(0, 0, 0, 0.5);
        letter-spacing: 0;
        font-weight: 400;
        opacity: 0.58;
        background: #ffffff;
        border-radius: 6px;  // 原18px → 8px
        padding: 4px 8px;  // 原6px 10px → 4px 8px
    }

    .area_left {
        margin-left: 88px;  // 原180px → 120px
        margin-right: 20px;  // 新增右边距
        padding: 10px 0px;  // 原20px 0px → 10px 0px
        min-height: 34px;
        .answer {
            color: #111;
            font-size: 12px;
            padding: 8px;  // 新增内边距
            min-height: 34px;
        }

        ::v-deep.van-button--info,
        .van-button--plain {
            padding: 6px 12px;  // 原10px 20px → 6px 12px
            bottom: 24px;  // 原44px → 24px
        }
    }

    .time {
        top: -45px;  // 原-50px → -30px
        padding: 3px 6px;  // 原4px 8px → 3px 6px
        font-size: 12px;  // 原14px → 12px
    }

    img {
        width: 80px;  // 原120px → 100px
        height: auto;
        position: absolute;
        bottom: 4px;
        left: 10px;
    }
}
</style>
