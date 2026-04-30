<script setup lang="ts">
import type { ProductDetail } from '@/types/product'

defineProps<{
  list: ProductDetail[]
  isFinish?: boolean
  isLoading?: boolean
}>()
</script>

<template>
  <view class="panel">
    <view class="title">
      <text class="name">热门推荐</text>
      <navigator class="more" hover-class="none">全部</navigator>
    </view>
    <view class="section">
      <navigator
        v-for="product in list"
        :key="product.id"
        class="product"
        open-type="navigate"
        hover-class="none"
        :url="`pages/product/product?id=${product.id}`"
      >
        <image class="image" :src="product.picture"></image>
        <view class="name ellipsis">{{ product.name }}</view>
        <view class="price">
          <text class="symbol">¥</text>
          <text class="number">{{ product.price }}</text>
        </view>
      </navigator>
    </view>
    <view class="loading-text" v-if="isFinish || isLoading">
      {{ isFinish ? '没有更多数据哟...' : '数据正在加载中...' }}
    </view>
  </view>
</template>

<style lang="scss">
@use './styles/hot.scss';
</style>
