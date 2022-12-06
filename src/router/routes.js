
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'userlist', component: () => import('pages/UserList.vue') },
      { path: 'edit-profile', component: () => import('pages/EditProfile.vue') },
      { path: 'message', component: () => import('pages/MessageList.vue'),name:"message", props: true },
      { path: 'contact', component: () => import('pages/Contact.vue') },
    ]
  },

  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
