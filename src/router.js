import Vue from 'vue'
import Router from 'vue-router'
import PrerequisiteGraph from '@/components/PrerequisiteGraph'
import CourseForm from '@/components/CourseForm'
import Course from '@/views/Course'
import StrandForm from '@/components/StrandForm'
import BenchmarkGraph from '@/components/BenchmarkGraph'
import BenchmarkCard from '@/components/BenchmarkCard'
import Compare from '@/views/Compare'

// noinspection JSUnresolvedFunction
Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      component: CourseForm
    },
    {
      name: 'courses',
      path: '/courses',
      component: CourseForm
    },
    {
      path: '/benchmarks',
      component: StrandForm
    },
    {
      path: '/benchmarks/:name',
      component: BenchmarkCard
    },
    {
      name: 'prereqGraph',
      path: '/prerequisites',
      component: PrerequisiteGraph
    },
    {
      path: '/courses/:name',
      component: Course
    },
    {
      name: 'edit',
      path: '/courses/:name/edit',
      component: CourseForm,
      props: {edit: true}
    },
    {
      name: 'benchmarkGraph',
      path: '/visualize',
      component: BenchmarkGraph
    },
    {
      name: 'compare',
      path: '/courses/:name/compare/:then/:now',
      component: Compare
    }
  ]
})
