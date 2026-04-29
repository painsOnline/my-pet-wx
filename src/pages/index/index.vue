
<template>
  <view class="viewport">
    <!-- 自定义导航栏 -->
    <pet-nav-bar />
    <!-- 滚动容器 -->
    <scroll-view 
      class="scroll-view"
      scroll-y>
        <template>
          <MySwiper :list="bannerList"/>
          <HotPannel :list="hotList"/>
        </template>
    </scroll-view>
    <PetShopCart/>
  </view>
</template>

<script setup lang="ts">
import MySwiper from './components/MySwiper.vue';
import type { BannerItem, HotItem } from '@/types/home';
import type { ProductItem } from '@/types/global';
import { ref } from 'vue';
import HotPannel from './components/HotPannel.vue';
import PetNavBar from '@/components/PetNavBar.vue';
import PetShopCart from '@/components/PetShopCart.vue';
import CartControl from '@/components/CartControl.vue';
import type { CartItem } from '@/types/cart';
const bannerList = ref<BannerItem[]>([
  { hrefUrl: "", id: "", imgUrl: "/static/images/banner-new.png", type: 1 },
  { hrefUrl: "", id: "", imgUrl: "/static/images/banner-new.png", type: 1 },
  { hrefUrl: "", id: "", imgUrl: "/static/images/banner-new.png", type: 1 },
])

const productImages = ['/static/images/product-s1.png', '/static/images/product-s2.png', '/static/images/product-s3.png']
const randomImage = () => productImages[Math.floor(Math.random() * productImages.length)]

// 获取热门推荐数据
const hotList = ref<ProductItem[]>([
  {
    id: 'aabbbb',
    name: '好命天生木薯混合猫砂除臭强2.5Kg/袋',
    price: 100,
    picture: randomImage(),
    discount: 0.80,
    orderNum: 10,
    desc: '者是商品描述'
  },
  {
    id: 'aabbbb',
    name: '尼可露豆腐猫砂6L/袋原味膨润土除臭猫砂',
    price: 100,
    picture: randomImage(),
    discount: 0.80,
    orderNum: 10,
    desc: '者是商品描述'
  },
  {
    id: 'aabbbb',
    name: '尼可露豆腐猫砂6L/袋原味膨润土除臭猫砂',
    price: 100,
    picture: randomImage(),
    discount: 0.80,
    orderNum: 10,
    desc: '者是商品描述'
  },
  {
    id: 'aabbbb',
    name: '鲜朗低温烘培木薯猫砂',
    price: 100,
    picture: randomImage(),
    discount: 0.80,
    orderNum: 10,
    desc: '者是商品描述'
  },
  {
    id: 'aabbbb',
    name: '鲜朗低温烘培幼猫猫粮',
    price: 100,
    picture: randomImage(),
    discount: 0.80,
    orderNum: 10,
    desc: '者是商品描述'
  },
  {
    id: 'aabbbb',
    name: '好命天生经典膨润土猫砂',
    price: 100,
    picture: randomImage(),
    discount: 0.80,
    orderNum: 10,
    desc: '者是商品描述'
  },
  {
    id: 'aabbbb',
    name: '鲜朗低温烘培幼猫猫粮',
    price: 100,
    picture: randomImage(),
    discount: 0.80,
    orderNum: 10,
    desc: '者是商品描述'
  },
  {
    id: 'aabbbb',
    name: '好命天生经典膨润土猫砂',
    price: 100,
    picture: randomImage(),
    discount: 0.80,
    orderNum: 10,
    desc: '者是商品描述'
  },
  {
    id: 'aabbbb',
    name: '尼可露豆腐猫砂6L/袋原味膨润土除臭猫砂',
    price: 100,
    picture: randomImage(),
    discount: 0.80,
    orderNum: 10,
    desc: '者是商品描述'
  }
  ,
  {
    id: 'aabbbb',
    name: '热门推荐1',
    price: 100,
    picture: randomImage(),
    discount: 0.80,
    orderNum: 10,
    desc: '者是商品描述'
  },
  {
    id: 'aabbbb',
    name: '热门推荐1',
    price: 100,
    picture: randomImage(),
    discount: 0.80,
    orderNum: 10,
    desc: '者是商品描述'
  },
  {
    id: 'aabbbb',
    name: '热门推荐1',
    price: 100,
    picture: randomImage(),
    discount: 0.80,
    orderNum: 10,
    desc: '者是商品描述'
  }
])

</script>

<style lang="scss">
page {
  background-color: #f7f7f7;
  height: 100%;
  overflow: hidden;
}

.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
}
</style>
