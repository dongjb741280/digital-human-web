/*
 * @Descripttion:公用方法
 * @version: 1.0.0
 * @Author: pan.qi
 * @Date: 2024-04-23 15:09:22
 * @LastEditors: pan.qi
 * @LastEditTime: 2024-06-28 15:16:02
 */

/**
 * @des: 获取元素距离底部的距离
 * @param {*} el DOM元素
 * @return {*} 距离底部的距离
 */
export function getDistanceToBodyBottom(el) {
    if (!el) {
        return 0;
    }
    const rect = el.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    return viewportHeight - (rect.top + rect.height);
}
let timer = null;

export function scrollToBottom(el) {
    // 使用防抖函数，避免频繁调用
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(function () {
        let scrollDiv = document.querySelector(el);
        scrollDiv.scrollTop = scrollDiv.scrollHeight;
    }, 100);
}

// 退出
export function logout() {
    let params = {
        param: '返回'
    };
    window.parent.postMessage(params, '*');
}
