<script setup lang="ts">
import type { ProductItem } from '@/types/global'

// 定义 props 接收数据
defineProps<{
  list: ProductItem[]
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
        hover-class="none"
        :url="`/pages/products/product?id=${product.id}`"
      >
        <image class="image" src="/static/images/product.png"></image>
        <view class="name ellipsis">{{ product.name }}</view>
        <view class="price">
          <text class="symbol">¥</text>
          <text class="number">{{ product.price }}</text>
        </view>
      </navigator>
    </view>
  </view>
</template>

<style lang="scss">
@use './styles/hot.scss';
</style>