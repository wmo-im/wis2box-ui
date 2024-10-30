import { createRouter, createWebHistory } from 'vue-router'
import Datasets from '@/views/DatasetView.vue'
import Map from '@/views/MapView.vue'
import Services from '@/views/ServiceView.vue'

const Authorize = {
  template: "<div>{{ $t('messages.authorize') }}</div>",
}

const routes = [
  {
    path: '/fixed-land-station-map/:topic',
    props: true,
    name: 'Topic Map',
    component: Map,
  },
  {
    path: '/',
    name: 'Datasets',
    component: Datasets,
  },
  {
    path: '/services',
    name: 'Services',
    component: Services,
  },
  {
    path: '/authorize',
    name: 'Authorize',
    component: Authorize,
  },
  {
    path: '/:path',
    name: 'Not Found',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
