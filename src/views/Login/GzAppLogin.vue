<template>
  <div class="container">
    <div class="content">
      <div class="loader"></div>
      <div class="text">公众app跳转登录中<div class="loader1"></div>
      </div>
    </div>

  </div>
</template>
<script lang="ts" setup>
import { openLoading, closeLoading } from '@/hooks/loading'
import { usePermissionStore } from '@/store/modules/permission'
import * as LoginApi from '@/api/login'
import * as authUtil from '@/utils/auth'
import { deleteUserCache } from '@/hooks/web/useCache'
const redirect = ref<string>('')
const { currentRoute, push } = useRouter()
const permissionStore = usePermissionStore()
const getUrlParams = (url) => {
  const paramsRegex = /[?&]+([^=&]+)=([^&]*)/gi;
  const params = {};
  let match;
  while (match = paramsRegex.exec(url)) {
    params[match[1]] = match[2];
  }
  return params;
}
const getCookie = (name) => {
  let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
      return arr[2];
  else
      return null;
}

onMounted(() => {
  //1. 获取url参数
  //2. 调用后台获取token
  //3. 跳转到相应的页面
  // 
  let sessionid = getCookie('sessionid');
  let params = getUrlParams(location.href);
  if (sessionid) {
    openLoading()
    if (params.method) {
      redirect.value = params.method
    }else{
      redirect.value = '/'
    }
    deleteUserCache()
    authUtil.setTenantId('1')
    LoginApi.gzAppLogin(sessionid).then(res => {
      closeLoading()
      authUtil.setToken(res)
      push({ path: redirect.value || permissionStore.addRouters[0].path })
    }).catch(err => {
      console.log(err);
      closeLoading()
    })
  }


})
</script>

<style scoped lang="scss">
div {
  box-sizing: border-box;
}

.container {
  height: 100vh;
  width: 100vw;
  max-width: 100vw;
  background-color: #dce5ed;
  padding-top: 1px;

  .content {
    margin-top: 10%;
  }
}

.text {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  font-size: 24px;
  text-align: center;
  margin-top: 60px;
  color: #1c64d0;
  font-weight: bold;
}

/* HTML: <div class="loader"></div> */
.loader {
  margin: 0 auto;
  width: 400px;
  aspect-ratio: 1;
  display: grid;
  border: 40px solid #0000;
  border-radius: 50%;
  border-right-color: #0764f0;
  animation: l15 1s infinite linear;
}

.loader::before,
.loader::after {
  content: "";
  grid-area: 1/1;
  margin: 2px;
  border: inherit;
  border-radius: 50%;
  animation: l15 2s infinite;
}

.loader::after {
  margin: 8px;
  animation-duration: 3s;
}

@keyframes l15 {
  100% {
    transform: rotate(1turn)
  }
}

/* HTML: <div class="loader"></div> */
.loader1 {
  margin-left: 12px;
  width: 30px;
  aspect-ratio: 4;
  background: radial-gradient(circle closest-side, #1c64d0 90%, #0000) 0/calc(100%/3) 100% space;
  clip-path: inset(0 100% 0 0);
  animation: l1 1s steps(4) infinite;
}

@keyframes l1 {
  to {
    clip-path: inset(0 -34% 0 0)
  }
}
</style>
