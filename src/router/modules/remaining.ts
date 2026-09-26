import { H5Layout,Layout } from '@/utils/routerHelper'

const { t } = useI18n()
/**
 * redirect: noredirect        当设置 noredirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'          设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
 hidden: true              当设置 true 的时候该路由不会再侧边栏出现 如404，login等页面(默认 false)

 alwaysShow: true          当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式，
 只有一个时，会将那个子路由当做根路由显示在侧边栏，
 若你想不管路由下面的 children 声明的个数都显示你的根路由，
 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，
 一直显示根路由(默认 false)

 title: 'title'            设置该路由在侧边栏和面包屑中展示的名字

 icon: 'svg-name'          设置该路由的图标

 noCache: true             如果设置为true，则不会被 <keep-alive> 缓存(默认 false)

 breadcrumb: false         如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)

 affix: true               如果设置为true，则会一直固定在tag项中(默认 false)

 noTagsView: true          如果设置为true，则不会出现在tag中(默认 false)

 activeMenu: '/dashboard'  显示高亮的路由路径

 followAuth: '/dashboard'  跟随哪个路由进行权限过滤

 canTo: true               设置为true即使hidden为true，也依然可以进行路由跳转(默认 false)
 }
 **/
const remainingRouter: AppRouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/digital/wrokspace',
    name: 'Home',
    meta: { hidden: true },
    children: [
      {
        path: '/digital/video-mgmt',
        component: () => import('@/views/digital/video-mgmt.vue'),
        name: '/digital/video-mgmt',
        meta: {
          title: '视频管理',
          icon: 'ep:home-filled',
          noCache: false,
          affix: false
        }
      },
      {
        path: '/digital/video-prod',
        component: () => import('@/views/digital/video-prod.vue'),
        name: '/digital/video-prod',
        meta: {
          title: '视频制作',
          icon: 'ep:home-filled',
          noCache: false,
          affix: false
        }
      },
      {
        path: '/digital/wrokspace',
        component: () => import('@/views/digital/wrokspace.vue'),
        name: '/digital/wrokspace',
        meta: {
          title: '创作空间',
          icon: 'ep:home-filled',
          noCache: false,
          affix: true
        }
      },
      {
        path: '/digital/digitalPersonManage',
        component: () => import('@/views/ai/digitalAvatar/DigitalPersonManage.vue'),
        name: 'digitalPersonManage',
        meta: {
          title: '数字人管理',
          icon: 'ep:home-filled',
          noCache: false,
          affix: false
        }
      },
      {
        path: '/digital/live/AiLiveMainDetail',
        component: () => import('@/views/digital/live/AiLiveMainDetail.vue'),
        name: 'aiLiveMainDetail',
        meta: {
          title: '直播详情',
          icon: 'ep:home-filled',
          noCache: false,
          affix: false
        },
        props(route){
          return route.query
        }
      },
      {
        path: '/digital/aitrainmain/AiTrainMainDetail',
        component: () => import('@/views/digital/aitrainmain/AiTrainMainDetail.vue'),
        name: 'aiTrainMainDetail',
        meta: {
          title: '视频详情',
          icon: 'ep:home-filled',
          noCache: false,
          affix: false
        },
        props(route){
          return route.query
        }
      },
      {
        path: '/digital/voiceManagement',
        component: () => import('@/views/ai/digitalAvatar/VoiceManagement.vue'),
        name: '/digital/voiceManagement',
        meta: {
          title: '声音管理',
          icon: 'ep:home-filled',
          noCache: false,
          affix: false
        }
      },
      {
        path: '/digital/createVoice',
        component: () => import('@/views/ai/digitalAvatar/CreateVoice.vue'),
        name: '/digital/createVoice',
        meta: {
          title: '声音制作',
          icon: 'ep:home-filled',
          noCache: false,
          affix: false
        }
      },
      {
        path: '/digital/text-prod',
        component: () => import('@/views/digital/text-prod.vue'),
        name: '/digital/text-prod',
        meta: {
          title: '文案制作',
          icon: 'ep:home-filled',
          noCache: false,
          affix: false
        }
      },
      {
        path: '/digital/traintext-prod',
        component: () => import('@/views/digital/traintext-prod.vue'),
        name: '/digital/traintext-prod',
        meta: {
          title: '文案制作',
          icon: 'ep:home-filled',
          noCache: false,
          affix: false
        }
      },
      {
        path: '/digital/text-mgmt',
        component: () => import('@/views/digital/text-mgmt.vue'),
        name: '/digital/text-mgmt',
        meta: {
          title: '文案管理',
          icon: 'ep:home-filled',
          noCache: false,
          affix: false
        }
      },
      {
        path: '/digital/createDigitalAvatar',
        component: () => import('@/views/ai/digitalAvatar/CreateDigitalAvatar.vue'),
        name: '/digital/createDigitalAvatar',
        meta: {
          title: '创建数字人',
          icon: 'ep:home-filled',
          noCache: false,
          affix: false
        }
      },
      {
        path: '/digital/interaction',
        component: () => import('@/views/digital/interaction.vue'),
        name: '/digital/interaction',
        meta: {
          title: '数字人互动',
          icon: 'ep:home-filled',
          noCache: false,
          affix: false
        }
      }
    ]
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/home',
  //   name: 'Home',
  //   meta: {},
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/Home/Index.vue'),
  //       name: 'Index',
  //       meta: {
  //         title: t('router.home'),
  //         icon: 'ep:home-filled',
  //         noCache: false,
  //         affix: true
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/ai/music',
  //   component: Layout,
  //   redirect: '/index',
  //   name: 'AIMusic',
  //   meta: {},
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/ai/music/components/index.vue'),
  //       name: 'AIMusicIndex',
  //       meta: {
  //         title: 'AI 音乐',
  //         icon: 'ep:home-filled',
  //         noCache: false,
  //         affix: true
  //       }
  //     }
  //   ]
  // },
  {
    path: '/user',
    component: Layout,
    name: 'UserInfo',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'profile',
        component: () => import('@/views/Profile/Index.vue'),
        name: 'Profile',
        meta: {
          canTo: true,
          hidden: true,
          noTagsView: false,
          icon: 'ep:user',
          title: t('common.profile')
        }
      },
      {
        path: 'notify-message',
        component: () => import('@/views/system/notify/my/index.vue'),
        name: 'MyNotifyMessage',
        meta: {
          canTo: true,
          hidden: true,
          noTagsView: false,
          icon: 'ep:message',
          title: '我的站内信'
        }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    name: 'dict',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'type/data/:dictType',
        component: () => import('@/views/system/dict/data/index.vue'),
        name: 'SystemDictData',
        meta: {
          title: '字典数据',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/system/dict'
        }
      }
    ]
  },

  {
    path: '/codegen',
    component: Layout,
    name: 'CodegenEdit',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'edit',
        component: () => import('@/views/infra/codegen/EditTable.vue'),
        name: 'InfraCodegenEditTable',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '修改生成配置',
          activeMenu: 'infra/codegen/index'
        }
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    name: 'JobL',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'job-log',
        component: () => import('@/views/infra/job/logger/index.vue'),
        name: 'InfraJobLog',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '调度日志',
          activeMenu: 'infra/job/index'
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/sso',
    component: () => import('@/views/Login/Login.vue'),
    name: 'SSOLogin',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/ssoLogin',
    component: () => import('@/views/Login/SsoLogin.vue'),
    name: 'SSOLoginNew',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/gzAppLogin',
    component: () => import('@/views/Login/GzAppLogin.vue'),
    name: 'GzAppLogin',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/social-login',
    component: () => import('@/views/Login/SocialLogin.vue'),
    name: 'SocialLogin',
    meta: {
      hidden: true,
      title: t('router.socialLogin'),
      noTagsView: true
    }
  },
  {
    path: '/403',
    component: () => import('@/views/Error/403.vue'),
    name: 'NoAccess',
    meta: {
      hidden: true,
      title: '403',
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFound',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  },
  {
    path: '/500',
    component: () => import('@/views/Error/500.vue'),
    name: 'Error',
    meta: {
      hidden: true,
      title: '500',
      noTagsView: true
    }
  },
  {
    path: '/h5',
    component: H5Layout,
    name: 'h5',
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/h5/live-video',
        component: () => import('@/views/h5/live-video.vue'),
        name: '/h5/live-video',
        meta: {
          title: '直播',
          icon: 'ep:home-filled',
          noCache: false,
          affix: false
        }
      },{
        path: '/h5/live-notice',
        component: () => import('@/views/h5/live-notice.vue'),
        name: '/h5/live-notice',
        meta: {
          title: '直播',
          icon: 'ep:home-filled',
          noCache: false,
          affix: false
        }
      },{
        path: '/h5/training-lesson',
        component: () => import('@/views/h5/training-lesson.vue'),
        name: '/h5/training-lesson',
        meta: {
          title: '课程',
          icon: 'ep:home-filled',
          noCache: false,
          affix: false
        }
      }
    ]
  },
  {
    path: '/studio',
    component: () => import('@/views/studio/index.vue'),
    name: 'VideoWorkspace',
    meta: {
      title: '视频工作台',
      icon: 'ep:home-filled',
      noCache: false,
      affix: false,
      hidden: true
    }
  },
  {
    path: '/chat',
    name: 'chat',
    meta: {
      hidden: true
    },
    children: [
      {
        path: '/chat/interaction-h5',
        component: () => import('@/views/digital/interaction-h5.vue'),
        name: '/chat/interaction-h5',
        meta: {
          title: '数字人互动',
          icon: 'ep:home-filled',
          noCache: false,
          affix: false
        }
      }
    ]
  }
]

export default remainingRouter
