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

<style scoped>
.productItem {
  display: flex;
  flex-direction: row;
  border-bottom: #c8c8c8 1rpx solid;
  padding: 20rpx 0;
}

.productItem .productImg {
  height: 90rpx;
  width: 90rpx;
  margin: 10rpx 20rpx 0rpx 10rpx;
}

.productItem .productInfo {
  padding: 0 10rpx 0 0;
}

.productInfo .productName {
  font-size: 36rpx;
  color: #000;
  font-weight: 500;
  margin-bottom: 10rpx;
}

.productInfo .productAttr {
  font-size: 24rpx;
  color: #c8c8c8;
  margin-bottom: 15rpx;
}

.productInfo .productImportBox {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 620rpx;
}

.productPrice {
  width: 270rpx;
}

.productPrice .nowPrice {
  font-size: 28rpx;
  color: #fe3d2d;
}

.productPrice .oldPrice {
  font-size: 24rpx;
  color: #6a7076;
  text-decoration: line-through;
  margin-left: 20rpx;
}

.shopcart .cartBottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 130rpx;
  z-index: 99;
  display: flex;
  background-color: #fff;
}

.priceBox {
  padding-top: 10rpx;
  color: #fe3d2d;
}

.price {
  font-size: 36rpx;
}

.deliveryPrice {
  color: #c8c8c8;
  font-size: 24rpx;
  padding-left: 10rpx;
}

.discount {
  font-size: 24rpx;
  text-decoration: line-through;
  margin-left: 12rpx;
}

.carIcon {
  flex: 1;
}

.iconBox {
  position: absolute;
  bottom: 22rpx;
  left: 18rpx;
  z-index: 101;
  background-color: #ffe810;
  border-radius: 50%;
  height: 130rpx;
  width: 130rpx;
  line-height: 55rpx;
}

.iconBox .allcount {
  position: absolute;
  right: -6rpx;
  top: 0;
  display: inline-block;
  padding: 0 2rpx;
  font-size: 24rpx;
  line-height: 40rpx;
  font-weight: 400;
  border-radius: 10rpx;
  background-color: #f01414;
  color: #ffffff;
}

.img {
  font-size: 50rpx;
  line-height: 50rpx;
  width: 90rpx;
  height: 90rpx;
  padding-left: 20rpx;
  padding-top: 20rpx;
  color: #cccccc;
  border-radius: 50%;
}

.carIcon .active {
  background-color: #fee53f;
}

.middle {
  display: flex;
  flex-direction: column;
  flex: 2;
  color: #ffffff;
}

.BtnRight {
  flex: 1;
  border-radius: 20rpx;
  margin: 10rpx;
  z-index: 99999;
}

.cartList {
  position: fixed;
  bottom: 130rpx;
  left: 0;
  right: 0;
  z-index: 90;
  border-radius: 30rpx;
}

.cartList .title,
.cartList .list-text {
  display: flex;
  flex-direction: row;
}

.cartList .title {
  background: #f3f5f7;
  justify-content: space-between;
  padding: 4rpx 8rpx;
}

.cartList .list-text {
  padding: 10rpx 6rpx 10rpx 8rpx;
  text-align: center;
}

.productList {
  background: #f8f8f8;
  padding-bottom: 10rpx;
}

.goToBuy {
  background-color: #fee53f;
  border-radius: 30rpx;
}

.listMask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 89;
  opacity: 0.5;
  background: #6a7076;
}

.clear {
  color: #c8c8c8;
  font-size: 24rpx;
}
</style>
