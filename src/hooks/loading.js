import {
    ElLoading
} from 'element-plus'

let loading = ""
let timerId = null;
function openLoading(option) {
    loading = ElLoading.service({
        lock: true,
        background: 'rgba(255, 255, 255, 0.7)',
        customClass: 'osloading',
        ...option,
    })
}
function setStyle() {
    // 设置样式
    document.querySelector('.el-loading-spinner').style.left = 0
    document.querySelector('.el-loading-spinner').style.width = '100%'
}
function openTimeLoading(option = { text: '附件上传中，大附件上传时间可能较长' }) {

    let count = 0;
    loading = ElLoading.service({
        target: 'timeLoading',
        lock: true,
        background: 'rgba(255, 255, 255, 0.7)',
        customClass: 'osloading',
        ...option,
    })
    timerId = setInterval(() => {
        setStyle()
        count++;
        document.querySelector('.el-loading-text').textContent = `${option.text}, ${count}s`
    }, 2000);
}

function closeLoading() {
    if (timerId) {
        clearInterval(timerId)
    }
    loading.close()

}
export {
    openLoading,
    closeLoading,
    openTimeLoading,
}