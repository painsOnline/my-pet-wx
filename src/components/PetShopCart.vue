<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CartItem } from '@/types/cart'
import CartControl from '@/components/CartControl.vue'

defineProps<{
  buyType?: string
  buyDis?: boolean
}>()

const isShowList = ref(false)

const products = ref<CartItem[]>([
  {
    id: 'aabbbb',
    skuId: 'aabbbb',
    name: '尼可露 原味 混合猫砂 除臭',
    picture: '/static/images/product-s1.png',
    count: 6,
    price: 100,
    nowPrice: 99,
    stock: 100,
    selected: true,
    attrsText: '规格：2.5kg/袋',
    isEffective: true,
  },
  {
    id: 'dddd',
    skuId: 'aabbddddbb',
    name: '好命天生 豆腐膨润土混合猫砂',
    picture: '/static/images/product-s2.png',
    count: 3,
    price: 100,
    nowPrice: 99,
    stock: 100,
    selected: true,
    attrsText: '规格：1.5kg/袋',
    isEffective: true,
  },
])

const getList = computed(() => products.value)

const getSelection = computed(() => products.value.filter((item) => item.selected))

const getAllCount = computed(() => {
  let result = 0
  getSelection.value.forEach((item) => {
    result += item.count
  })
  return result
})

// 解决浮点数运算出现多位小数
const accMul = (arg1: number, arg2: number): number => {
  let m = 0
  try { m += arg1.toString().split('.')[1].length } catch (e) { /* empty */ }
  try { m += arg2.toString().split('.')[1].length } catch (e) { /* empty */ }
  return (Number(arg1.toString().replace('.', '')) * Number(arg2.toString().replace('.', ''))) / Math.pow(10, m)
}

const getAllPrice = computed(() => {
  let result = 0
  getSelection.value.forEach((product) => {
    result += accMul(product.count, product.nowPrice)
  })
  return result.toFixed(2)
})

const getAllDiscount = computed(() => {
  // 暂未实现折扣计算，保留接口
  return '0.00'
})

const toggleList = () => {
  if (getList.value.length) {
    isShowList.value = !isShowList.value
  }
}

const emit = defineEmits<{
  delAll: []
  add: [item: CartItem]
  dec: [item: CartItem]
  input: [item: CartItem]
}>()

const buyList = () => {
  if (getSelection.value.length) {
    console.log('getAllPrice：' + getAllPrice.value)
    console.log('buyList：' + JSON.stringify(getSelection.value))
    uni.showToast({ title: '总价格：' + getAllPrice.value })
  }
}

const delShopcart = () => {
  emit('delAll')
}

const addCart = (item: CartItem) => {
  emit('add', item)
}

const decreaseCart = (item: CartItem) => {
  emit('dec', item)
}

const inputCart = (item: CartItem) => {
  if (item.count >= item.stock) {
    uni.showToast({ title: '该宝贝不能购买更多了~' })
  } else {
    emit('input', item)
  }
}
</script>

<template>
  <view class="shopcart">
    <view class="cartBottom">
      <view class="carIcon" @click="toggleList">
        <view class="iconBox" :class="getAllCount ? 'active' : ''">
          <text class="allcount" v-if="getAllCount">{{ getAllCount }}</text>
          <image src="/static/tabs/cart.png" class="img" />
        </view>
      </view>
      <view class="middle" @click="toggleList">
        <view class="priceBox">
          <text class="price" :class="getAllCount ? 'active' : ''">￥{{ getAllPrice }}</text>
          <text class="discount" :class="getAllDiscount">共减￥{{ getAllDiscount }}</text>
        </view>
        <text class="deliveryPrice">满20免配送费</text>
      </view>
      <view class="BtnRight">
        <button class="goToBuy" :type="buyType" :disabled="buyDis" @click="buyList">去结算</button>
      </view>
    </view>

    <!-- 选择的商品 -->
    <view class="cartList" v-show="isShowList && getList.length">
      <scroll-view scroll-y style="max-height: 500rpx;">
        <view class="title">
          <text>购物车</text>
          <view class="clear" @click="delShopcart">清空购物车</view>
        </view>
        <view class="productList">
          <view class="productItem" v-for="(item, index) in getList" :key="index">
            <image class="productImg" :src="item.picture" />
            <view class="productInfo">
              <view class="productName">{{ item.name }}</view>
              <view class="productAttr">{{ item.attrsText }}</view>
              <view class="productImportBox">
                <view class="productPrice">
                  <text class="nowPrice">优惠价￥{{ item.nowPrice }}</text>
                  <text class="oldPrice">￥{{ item.price }}</text>
                </view>
                <CartControl :product="item" />
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="listMask" v-show="isShowList && getList.length" @click="toggleList" />
  </view>
</template>

<style scoped lang="scss">
@use './styles/PetShopCart.scss';
</style>
