import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Layout from "@/layout/index.vue";
import store from "@/store";

Vue.use(VueRouter);

// 路由配置规则
const routes: Array<RouteConfig> = [
  {
    path: "/login",
    name: "login",
    component: () => import(/* webpackChunkName: 'login' */ "@/views/login/index.vue"),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/",
    component: Layout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: "", // 默认子路由
        name: "home",
        component: () => import(/* webpackChunkName: 'home' */ "@/views/home/index.vue"),
        meta: {
          breadcrumb: ["首页"]
        }
      },
      {
        path: "/role",
        name: "role",
        component: () => import(/* webpackChunkName: 'role' */ "@/views/role/index.vue"),
        meta: {
          breadcrumb: ["首页", "权限管理", "角色管理"]
        }
      },
      {
        path: "/role/:roleId/alloc-menu",
        name: "alloc-menu",
        component: () => import(/* webpackChunkName: 'alloc-menu' */ "@/views/role/alloc-menu.vue"),
        props: true, // 将路由路径参数映射到组件的 props 数据中，
        meta: {
          breadcrumb: ["首页", "权限管理", "角色管理", "角色分配菜单"]
        }
      },
      {
        path: "/role/:roleId/alloc-resource",
        name: "alloc-resource",
        component: () =>
          import(/* webpackChunkName: 'alloc-menu' */ "@/views/role/alloc-resource.vue"),
        props: true, // 将路由路径参数映射到组件的 props 数据中
        meta: {
          breadcrumb: ["首页", "权限管理", "角色管理", "角色分配资源"]
        }
      },
      {
        path: "/menu",
        name: "menu",
        component: () => import(/* webpackChunkName: 'menu' */ "@/views/menu/index.vue"),
        meta: {
          breadcrumb: ["首页", "权限管理", "菜单管理"]
        }
      },
      {
        path: "/resource",
        name: "resource",
        component: () => import(/* webpackChunkName: 'resource' */ "@/views/resource/index.vue"),
        meta: {
          breadcrumb: ["首页", "权限管理", "资源管理"]
        }
      },
      {
        path: "/course",
        name: "course",
        component: () => import(/* webpackChunkName: 'course' */ "@/views/course/index.vue"),
        meta: {
          breadcrumb: ["首页", "课程管理"]
        }
      },
      {
        path: "/course/create",
        name: "course-create",
        component: () =>
          import(/* webpackChunkName: 'course-create' */ "@/views/course/create.vue"),
        meta: {
          breadcrumb: ["首页", "课程管理", "创建"]
        }
      },
      {
        path: "/course/:courseId/edit",
        name: "course-edit",
        component: () => import(/* webpackChunkName: 'course-edit' */ "@/views/course/edit.vue"),
        props: true,
        meta: {
          breadcrumb: ["首页", "课程管理", "修改"]
        }
      },
      {
        path: "/course/:courseId/section",
        name: "course-section",
        component: () =>
          import(/* webpackChunkName: 'course-section' */ "@/views/course/section.vue"),
        props: true,
        meta: {
          breadcrumb: ["首页", "课程管理", "课程内容"]
        }
      },
      {
        path: "/user",
        name: "user",
        component: () => import(/* webpackChunkName: 'user' */ "@/views/user/index.vue"),
        meta: {
          breadcrumb: ["首页", "用户管理"]
        }
      },
      {
        path: "/advert",
        name: "advert",
        component: () => import(/* webpackChunkName: 'advert' */ "@/views/advert/index.vue"),
        meta: {
          breadcrumb: ["首页", "广告管理", "广告列表"]
        }
      },
      {
        path: "/advert-space",
        name: "advert-space",
        component: () =>
          import(/* webpackChunkName: 'advert-space' */ "@/views/advert-space/index.vue"),
        meta: {
          breadcrumb: ["首页", "广告管理", "广告位列表"]
        }
      }
    ]
  },
  {
    path: "*",
    name: "404",
    component: () => import(/* webpackChunkName: '404' */ "@/views/error-page/404.vue"),
    meta: {
      requiresAuth: false,
      name: "404"
    }
  }
];

const router = new VueRouter({
  routes
});

// 全局前置守卫：任何页面的访问都要经过这里
// to：要去哪里的路由信息
// from：从哪里来的路由信息
// next：通行的标志
router.beforeEach((to, from, next) => {
  // to.matched 是一个数组（匹配到是路由记录）
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters.user) {
      // 跳转到登录页面
      next({
        name: "login",
        query: {
          // 通过 url 传递查询字符串参数
          redirect: to.fullPath // 把登录成功需要返回的页面告诉登录页面
        }
      });
    } else {
      next(); // 允许通过
    }
  } else {
    next(); // 允许通过
  }

  // // 路由守卫中一定要调用 next，否则页码无法展示
  // next()
  // if (to.path !== '/login') {
  //   // 校验登录状态
  // }
});

export default router;
