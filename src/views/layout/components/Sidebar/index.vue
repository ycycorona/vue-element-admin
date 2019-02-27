<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <div class="sidebar-header">
      <transition name="fade" mode="out-in">
        <div v-if="!isCollapse" key="1" class="sidebar-title">
          Video DB
        </div>
        <div v-else key="2" class="sidebar-title">
          VD
        </div>
      </transition>

    </div>
    <el-menu :default-active="$route.path" :collapse="isCollapse" :background-color="variables.menuBg" :text-color="variables.menuText" :active-text-color="variables.menuActiveText" style="padding-top:50px" mode="vertical">
      <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path" />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: {
    SidebarItem
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style lang="scss" scoped>
  .sidebar-header {
    font-size: 12px;
    position: absolute;
    width: 100%;
    z-index: 9;
    background: #002140;
    height: 50px;
    color: white;
  }

  .sidebar-title {
    display: inline-block;
    margin: 0 0 0 0;
    color: #fff;
    font-weight: 600;
    font-size: 20px;
    font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
    vertical-align: middle;
    line-height: 50px;
    width: 100%;
    text-align: center;
    white-space:nowrap;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to
  /* .fade-leave-active below version 2.1.8 */

  {
    opacity: 0;
  }
</style>

