export default {
	router: {
		extendRoutes(routes, resolve) {
			// 清除Nuxt.js基于pages目录生成的路由表规则
			routes.splice(0)

			routes.push({
				name: 'layout',
				path: '/',
				component: resolve(__dirname, 'pages/layout/index.vue'),
				children: [
					{
						name: 'home',
						path: '',
						component: resolve(__dirname, 'pages/home/index.vue')
					},
					{
						name: 'login',
						path: 'login',
						component: resolve(__dirname, 'pages/login/index.vue')
					},
					{
						name: 'register',
						path: 'register',
						component: resolve(__dirname, 'pages/login/index.vue')
					},
					{
						name: 'profile',
						path: '/profile/:username',
						component: resolve(__dirname, 'pages/profile/index.vue')
					},
					{
						name: 'settings',
						path: '/settings',
						component: resolve(__dirname, 'pages/settings/index.vue')
					},
					{
						name: 'editor',
						path: '/editor/:slug?',
						component: resolve(__dirname, 'pages/editor/index.vue')
					},
					{
						name: 'article',
						path: '/article/:slug',
						component: resolve(__dirname, 'pages/article/index.vue')
					}
				]
			})
		},
		linkActiveClass: 'active'
	},
	server: {
    host: '0.0.0.0',
    port: 3000
  },
	plugins: [
		'~/plugins/request.js',
		'~/plugins/dayjs.js'
	]
}