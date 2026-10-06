<!-- nav item -->
<script lang="ts" setup>
import { svgUrl } from '@/utils/imgURL'
defineOptions({ name: 'DNavItem' })
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  onClick: {
    type: Function,
    default: () => {}
  }
})
const Icon = svgUrl(props.icon)
</script>

<template>
  <div class="dh-nav-card" @click="onClick">
    <div class="nav-icon">
      <img :src="Icon" alt="Icon" class="nav-icon-img" />
    </div>
    <div class="nav-info">
      <span class="nav-title">{{ title }}</span>
      <span class="nav-desc">{{ desc }}</span>
      <span class="nav-cta">开始创作 <i class="nav-arrow">→</i></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dh-nav-card {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 250px;
  height: 96px;
  padding: 16px 18px;
  background: var(--dh-surface, #fff);
  border: 1px solid var(--el-border-color-lighter, #eef0f5);
  border-radius: var(--dh-radius-md, 16px);
  box-shadow: var(--dh-shadow-sm);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.dh-nav-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--dh-shadow-md);
  border-color: var(--dh-primary, #3d6bff);
}

.nav-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--dh-gradient);
}

.nav-icon-img {
  width: 32px;
  height: 32px;
  filter: brightness(0) invert(1);
}

.nav-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}

.nav-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--dh-text, #12224a);
}

.nav-desc {
  margin-top: 4px;
  font-size: 12px;
  color: var(--dh-text-secondary, #64748b);
}

.nav-cta {
  margin-top: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--dh-primary, #3d6bff);
  transition: color 0.2s ease;
}

.dh-nav-card:hover .nav-cta {
  color: var(--dh-primary-deep, #2a4fe0);
}

.nav-arrow {
  margin-left: 2px;
  font-style: normal;
}
</style>
